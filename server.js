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

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();
    try {
        const { messages = [] } = req.body || {};

        const userTurns = Array.isArray(messages)
            ? messages.filter((m) => m && m.role !== 'system')
            : [];

        const body = {
            model: 'gpt-4o-mini',
            temperature: 0.7,
            messages: [
                {
                    role: 'system',
                    content: 'You are a concise, friendly site assistant for Rutherford Creative Media (RCM). RCM is Barry Rutherford\'s studio for creative work, media projects, and advisory—where five decades of global leadership meet narrative craft. We build stories and systems: from memoir and fiction to modern media platforms and AI-augmented workflows.\n\nKey services include:\n- Leadership storytelling and content creation\n- Creative writing and memoir services\n- Strategic communications consulting\n- Content development for executives and thought leaders\n- Practical AI strategy and implementations\n\nOur platforms include Malestrum (creative works) and Rutherford & Company (consulting services).\n\nFor inquiries, direct users to contact Barry Rutherford at barrykarlrutherford@gmail.com or use the contact form on the website.\n\nBe helpful, professional, and concise. Focus on how RCM can help with storytelling and leadership communication needs.'
                },
                ...userTurns,
            ],
        };

        const r = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(body),
        });

        if (!r.ok) {
            const err = await r.text();
            return res.status(502).json({ error: 'upstream_error', detail: err });
        }

        const data = await r.json();
        const reply = data?.choices?.[0]?.message?.content ?? '';
        res.status(200).json({ reply });
    } catch (e) {
        console.error('Chat API error:', e);
        res.status(500).json({ error: 'chat_failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});