---
title: "Contact RCM"
slug: "rcm/contact"
date: "2025-10-11"
status: "active"
tags: ["rcm","contact"]
last_updated: "2025-10-11"
draft: false
---

# Contact RCM

Get in touch about your project needs.

## Contact Form

<form id="contact-form" action="/api/contact" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <textarea name="message" placeholder="Tell us about your project" required></textarea>
  <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
  <button type="submit">Send Message</button>
</form>

**Fallback contact:** hello@rutherfordcreativemedia.com