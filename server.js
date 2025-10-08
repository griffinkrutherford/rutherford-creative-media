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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
    }

    const { name, email, message, website } = req.body;

    // Honeypot check - if website field is filled, it's likely spam
    if (website && website.trim() !== '') {
        // Return success but don't actually send email
        return res.json({ ok: true });
    }

    // Validate input
    if (!validateName(name)) {
        return res.status(400).json({ ok: false, error: 'Name must be between 1 and 120 characters.' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
    }

    if (!validateMessage(message)) {
        return res.status(400).json({ ok: false, error: 'Message must be between 10 and 5000 characters.' });
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
    try {
        const { messages = [], provider = 'anthropic', system, temperature = 0.7 } = req.body || {};
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages[] required' });
        }

        if (provider === 'anthropic') {
            const upstream = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-latest',
                    system: system || 'You are the helpful assistant for Rutherford Creative Media (RCM). RCM is a creative agency specializing in storytelling and leadership content. We help leaders and organizations tell their stories through various mediums including writing, content strategy, and creative consulting.\n\nKey services include:\n- Leadership storytelling and content creation\n- Creative writing and memoir services\n- Strategic communications consulting\n- Content development for executives and thought leaders\n\nOur platforms include Malestrum (creative works) and Rutherford & Company (consulting services).\n\nFor inquiries, direct users to contact Barry Rutherford at barrykarlrutherford@gmail.com or use the contact form on the website.\n\nBe helpful, professional, and concise. Focus on how RCM can help with storytelling and leadership communication needs.',
                    temperature,
                    max_tokens: 2048,
                    stream: true,
                    messages: messages.map(m => ({ role: m.role, content: m.content }))
                })
            });
            return proxyStream(upstream, res);
        }

        return res.status(400).json({ error: 'Only Anthropic/Claude provider is supported' });
    } catch (err) {
        console.error('Chat API error:', err);
        res.status(500).json({ error: 'server_error', detail: String(err) });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});