// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);

            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Smooth Scrolling
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Active Navigation Links
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;

        if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;

    if (navbar) {
        if (scrolled > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Intersection Observer for Fade-in Animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once visible for performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class and observe sections
    const sections = document.querySelectorAll('.about-section, .projects-section, .works-section, .team-section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Add fade-in class and observe cards
    const cards = document.querySelectorAll('.project-card, .bio-card, .work-showcase');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        // Stagger the animations slightly
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
});

// Parallax Effect for Hero
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const heroPattern = document.querySelector('.hero-pattern');

    if (hero && heroPattern) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;

        if (scrolled < hero.offsetHeight) {
            heroPattern.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    }
});

// Read More Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Visual feedback
            const originalText = this.textContent;
            const originalBg = this.style.backgroundColor;

            this.textContent = 'Coming Soon...';
            this.style.backgroundColor = '#95a5a6';
            this.style.transform = 'scale(0.98)';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = originalBg;
                this.style.transform = 'scale(1)';
            }, 2000);

            // Log for future implementation
            console.log('Read more clicked for:', originalText);
        });
    });
});

// Enhanced Hover Effects for Project Cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';

            const arrow = this.querySelector('.project-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(8px)';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';

            const arrow = this.querySelector('.project-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    });
});

// Bio Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const bioCards = document.querySelectorAll('.bio-card');

    bioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.bio-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.bio-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
});

// Work Showcase Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const workShowcases = document.querySelectorAll('.work-showcase');

    workShowcases.forEach(showcase => {
        showcase.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });

        showcase.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

// Performance Optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events for better performance
const throttledScroll = throttle(function() {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;

    if (navbar) {
        if (scrolled > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    // Parallax effect
    const hero = document.querySelector('.hero');
    const heroPattern = document.querySelector('.hero-pattern');

    if (hero && heroPattern && scrolled < hero.offsetHeight) {
        const rate = scrolled * -0.3;
        heroPattern.style.transform = `translate3d(0, ${rate}px, 0)`;
    }

    // Active navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;

        if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Add loading state management
window.addEventListener('load', function() {
    // Remove any loading states and ensure all content is visible
    document.body.classList.add('loaded');

    // Trigger any delayed animations
    setTimeout(() => {
        const delayedElements = document.querySelectorAll('.fade-in:not(.visible)');
        delayedElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 500);

    // Force cache refresh
    console.log('Rutherford Creative Media - Script loaded successfully');
});