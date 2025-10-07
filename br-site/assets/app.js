/**
 * Barry Rutherford Author Site - Interactive JavaScript
 * Mobile menu, smooth scrolling, and accessibility enhancements
 */

(function() {
  'use strict';

  // ===== MOBILE MENU FUNCTIONALITY =====

  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!menuToggle || !navLinks) return;

    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.contains('open');

      // Toggle menu state
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open');

      // Update ARIA attributes
      menuToggle.setAttribute('aria-expanded', !isOpen);

      // Prevent body scroll when menu is open
      if (!isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking nav links
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = menuToggle.contains(event.target) || navLinks.contains(event.target);

      if (!isClickInsideNav && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        menuToggle.focus(); // Return focus to toggle button
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== SMOOTH SCROLLING =====

  function initSmoothScrolling() {
    // Get all anchor links that point to sections on the same page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        const href = this.getAttribute('href');

        // Skip empty hashes or just "#"
        if (!href || href === '#') return;

        const targetElement = document.querySelector(href);

        if (targetElement) {
          event.preventDefault();

          // Calculate offset for fixed header
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20; // 20px extra spacing

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }

          // Focus management for accessibility
          setTimeout(() => {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
            targetElement.removeAttribute('tabindex');
          }, 100);
        }
      });
    });
  }

  // ===== SCROLL-BASED HEADER STYLING =====

  function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      // Add/remove scrolled class based on scroll position
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====

  function initScrollAnimations() {
    // Only run if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe sections and cards for animation
    const animatedElements = document.querySelectorAll('.section, .card, .hero-content');
    animatedElements.forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });
  }

  // ===== FORM ENHANCEMENTS =====

  function initFormEnhancements() {
    // Find all forms (for future newsletter signup, contact forms, etc.)
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      // Add loading state functionality
      form.addEventListener('submit', function() {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.classList.add('loading');

          // Re-enable after 3 seconds as fallback
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
          }, 3000);
        }
      });
    });
  }

  // ===== KEYBOARD NAVIGATION ENHANCEMENTS =====

  function initKeyboardNavigation() {
    // Improve focus visibility and keyboard navigation
    document.addEventListener('keydown', function(event) {
      // Add keyboard navigation class when tab is pressed
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    // Remove keyboard navigation class on mouse interaction
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // ===== EXTERNAL LINK HANDLING =====

  function initExternalLinks() {
    // Add proper attributes to external links
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="barryrutherford.com"])');

    externalLinks.forEach(link => {
      // Ensure external links have proper attributes
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }

      // Add visual indicator for screen readers
      if (!link.querySelector('.sr-only')) {
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = ' (opens in new window)';
        link.appendChild(srText);
      }
    });
  }

  // ===== IMAGE LAZY LOADING FALLBACK =====

  function initImageLazyLoading() {
    // Fallback for browsers that don't support native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      return; // Native lazy loading is supported
    }

    const images = document.querySelectorAll('img[loading="lazy"]');

    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }

  // ===== PERFORMANCE MONITORING =====

  function initPerformanceLogging() {
    // Log Core Web Vitals if available
    if ('web-vital' in window) {
      // This would integrate with actual web vitals library if included
      console.log('Web Vitals monitoring ready');
    }

    // Log page load time
    window.addEventListener('load', function() {
      const loadTime = performance.now();
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });
  }

  // ===== ERROR HANDLING =====

  function initErrorHandling() {
    // Global error handler for JavaScript errors
    window.addEventListener('error', function(event) {
      console.error('JavaScript error:', event.error);
      // In production, you might want to send this to an error tracking service
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  // ===== INITIALIZATION =====

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all functionality
    try {
      initMobileMenu();
      initSmoothScrolling();
      initScrollHeader();
      initScrollAnimations();
      initFormEnhancements();
      initKeyboardNavigation();
      initExternalLinks();
      initImageLazyLoading();
      initPerformanceLogging();
      initErrorHandling();

      console.log('Barry Rutherford site initialized successfully');
    } catch (error) {
      console.error('Error initializing site:', error);
    }
  }

  // Start initialization
  init();

  // ===== PUBLIC API =====

  // Expose useful functions globally if needed
  window.BRSite = {
    scrollToSection: function(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = element.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    },

    toggleMobileMenu: function() {
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) {
        menuToggle.click();
      }
    }
  };

})();

// ===== CSS FOR ANIMATIONS (added via JavaScript) =====

// Add CSS for scroll animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .animate-ready {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  .header.scrolled {
    background: rgba(14, 15, 18, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .loading {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .keyboard-navigation *:focus {
    outline: 2px solid var(--acc);
    outline-offset: 2px;
  }

  .lazy {
    filter: blur(5px);
    transition: filter 0.3s;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-ready {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;

document.head.appendChild(animationStyles);