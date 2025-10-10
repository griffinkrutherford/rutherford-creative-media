const express = require('express');
const sgMail = require('@sendgrid/mail');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

// Spam protection constants
const BLOCK = [/viagra/i, /porn/i, /escort/i, /crypto\s*(invest|profit)/i, /loan\s*approval/i];
const duplicateMap = new Map(); // IP/email -> recent submissions
const DUPLICATE_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS = 10; // Max stored per IP/email

// Middleware
app.use(express.json());
app.use(express.static('./'));

// Rate limiting function
function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];

    // Filter out old requests outside the window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= RATE_LIMIT_MAX) {
        return false;
    }

    // Add current request
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    return true;
}

// Validation functions
function validateName(name) {
    return typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= 120;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
}

function validateMessage(message) {
    return typeof message === 'string' && message.trim().length >= 10 && message.trim().length <= 5000;
}

// Spam protection helpers
function sameOriginOk(req) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const hostname = req.hostname || req.headers.host;

    if (!origin && !referer) return false;

    const sourceUrl = origin || referer;
    return sourceUrl.includes(hostname);
}

function dwellOk(formTs) {
    if (!formTs || isNaN(formTs)) return false;

    const now = Date.now();
    const delta = now - parseInt(formTs);

    return delta >= 5000 && delta <= 7200000; // 5 seconds to 2 hours
}

function linkCount(text) {
    const matches = text.match(/(https?:\/\/|www\.)/gi);
    return matches ? matches.length : 0;
}

function hasBlockedTerms(text) {
    return BLOCK.some(pattern => pattern.test(text));
}

function isDuplicate(ip, email, message) {
    const key = `${ip}:${email}`;
    const messageSnippet = message.substring(0, 60).toLowerCase();
    const now = Date.now();

    if (!duplicateMap.has(key)) {
        duplicateMap.set(key, []);
    }

    const submissions = duplicateMap.get(key);

    // Clean old entries
    const recentSubmissions = submissions.filter(sub => now - sub.timestamp < DUPLICATE_WINDOW);

    // Check for duplicate message
    const isDupe = recentSubmissions.some(sub => sub.messageSnippet === messageSnippet);

    if (isDupe) return true;

    // Add current submission
    recentSubmissions.push({ messageSnippet, timestamp: now });

    // Keep only the most recent MAX_SUBMISSIONS
    if (recentSubmissions.length > MAX_SUBMISSIONS) {
        recentSubmissions.shift();
    }

    duplicateMap.set(key, recentSubmissions);
    return false;
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
    }

    const { name, email, message, website, form_ts } = req.body;

    // 1. Honeypot check - if website field is filled, it's likely spam
    if (website && website.trim() !== '') {
        // Return success but don't actually send email (silent drop)
        return res.json({ ok: true });
    }

    // 2. Origin/Referrer check
    if (!sameOriginOk(req)) {
        return res.status(403).json({ ok: false, error: 'Invalid request origin.' });
    }

    // 3. Timing check
    if (!dwellOk(form_ts)) {
        return res.status(400).json({ ok: false, error: 'Invalid timing.' });
    }

    // 4. Basic validation
    if (!validateName(name)) {
        return res.status(400).json({ ok: false, error: 'Name must be between 1 and 120 characters.' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
    }

    if (!validateMessage(message)) {
        return res.status(400).json({ ok: false, error: 'Message must be between 10 and 5000 characters.' });
    }

    // 5. URL/link count check
    const totalLinks = linkCount(name) + linkCount(message);
    if (totalLinks > 2) {
        return res.status(400).json({ ok: false, error: 'Too many links.' });
    }

    // 6. Blocked terms check
    const fullText = `${name} ${message}`;
    if (hasBlockedTerms(fullText)) {
        return res.status(400).json({ ok: false, error: 'Blocked terms.' });
    }

    // 7. Duplicate check
    if (isDuplicate(clientIp, email, message)) {
        return res.status(429).json({ ok: false, error: 'Duplicate.' });
    }

    // Prepare email
    const msg = {
        to: process.env.CONTACT_TO,
        from: process.env.CONTACT_FROM,
        subject: `New Contact Form Submission from ${name.trim()}`,
        text: `
Name: ${name.trim()}
Email: ${email.trim()}

Message:
${message.trim()}
        `,
        html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name.trim()}</p>
<p><strong>Email:</strong> ${email.trim()}</p>
<p><strong>Message:</strong></p>
<p>${message.trim().replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await sgMail.send(msg);
        res.json({ ok: true });
    } catch (error) {
        console.error('SendGrid error:', error);
        res.status(500).json({ ok: false, error: 'Failed to send message. Please try again later.' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Chatbot streaming proxy function
async function proxyStream(upstreamResponse, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!upstreamResponse.ok || !upstreamResponse.body) {
        const txt = await upstreamResponse.text();
        res.write(`data: ${JSON.stringify({ error: txt })}\n\n`);
        res.end();
        return;
    }

    const reader = upstreamResponse.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        res.write(chunk);
    }
    res.end();
}

// Health endpoint
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'development',
    hasKey,
    model: 'claude-3-5-sonnet-20240620',
    serverTime: new Date().toISOString()
  });
});

// Chat endpoint (Claude/Anthropic; server-side system; robust upstream logs)
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[chat] missing ANTHROPIC_API_KEY');
      return res.status(500).json({ error: 'missing_key' });
    }

    const raw = Array.isArray(req.body?.messages) ? req.body.messages : [];
    // Only pass user/assistant turns; we inject system here
    const turns = raw.filter(
      (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
    );

    const payload = {
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2048,
      temperature: 0.7,
      system: 'You are a concise, friendly site assistant for Rutherford Creative Media (RCM). RCM is Barry Rutherford\'s studio for creative work, media projects, and advisory—where five decades of global leadership meet narrative craft. We build stories and systems: from memoir and fiction to modern media platforms and AI-augmented workflows. Our platforms include Malestrum (creative works) and Rutherford & Company (consulting services). For inquiries, direct users to contact Barry Rutherford at barrykarlrutherford@gmail.com. Be helpful, professional, and concise.',
      messages: turns.map(m => ({ role: m.role, content: m.content }))
    };

    const upstreamUrl = 'https://api.anthropic.com/v1/messages';
    const r = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const respText = await r.text();
    if (r.ok) {
      let data;
      try {
        data = JSON.parse(respText);
        console.log('[chat] anthropic_response_structure:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('[chat] json_parse_error:', parseError);
        data = {};
      }
      const reply = data?.content?.[0]?.text ?? '';
      console.log('[chat] extracted_reply:', reply);
      return res.json({ reply });
    } else {
      // Log upstream details (truncated) for Railway logs
      console.error('[chat] upstream_error', {
        url: upstreamUrl,
        status: r.status,
        statusText: r.statusText,
        body: respText.slice(0, 1000),
      });
      return res.status(502).json({ error: 'upstream_error', detail: respText });
    }
  } catch (e) {
    console.error('[chat] handler_error', e);
    return res.status(500).json({ error: 'chat_failed' });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});