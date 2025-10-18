// RCM Fallbacks - Handle form submissions when API is unavailable
(function() {
  'use strict';

  // Handle contact form fallback to mailto
  function handleContactFormFallback() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      // If POST_URL is empty or API fails, fall back to mailto
      const formData = new FormData(this);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';

      // Check if we should use fallback (when POST action is empty or API fails)
      if (!this.action || this.action === '' || this.action === window.location.href) {
        e.preventDefault();

        const subject = encodeURIComponent(`Contact from ${name}`);
        const body = encodeURIComponent(`From: ${name} <${email}>\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:hello@rutherfordcreativemedia.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoUrl;
        return false;
      }
    });
  }

  // Initialize fallbacks when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleContactFormFallback);
  } else {
    handleContactFormFallback();
  }
})();