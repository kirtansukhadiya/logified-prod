// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');

// Prevent white flash during page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Apply current theme immediately
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Add animation class to body after a brief delay
    setTimeout(() => {
        document.body.classList.add('animate-content');
    }, 50);
});

// Handle page transitions
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && 
        link.href && 
        !link.href.startsWith('#') && 
        !link.target && 
        link.href !== window.location.href &&
        link.origin === window.location.origin) {
        
        e.preventDefault();
        
        // Fade out current page
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
            window.location.href = link.href;
        }, 300);
    }
});

// Disable transitions temporarily when page loads
document.documentElement.classList.add('no-transition');
window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
    });
});

// Intersection Observer for scroll animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .slide-in').forEach(el => {
        observer.observe(el);
    });
};

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
});

// Mobile Navigation
hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

themeToggle?.addEventListener('click', toggleTheme);

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handler is in form.js

// Navbar Background Change on Scroll
const handleNavbarScroll = () => {
    const navbar = document.querySelector('.header');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
        }
    }
};

// Loading Animation
const showLoadingAnimation = () => {
    const body = document.body;
    body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            body.style.transition = 'opacity 0.5s ease-in-out';
            body.style.opacity = '1';
        }, 100);
    });
};

// Form Validation
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
};

const showFieldError = (input, message) => {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.style.borderColor = '#ef4444';
    input.parentNode.appendChild(errorDiv);
};

const clearFieldError = (input) => {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Lazy Loading for Images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    showLoadingAnimation();
    lazyLoadImages();
});

// Window event listeners
window.addEventListener('scroll', handleNavbarScroll);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    }
});

// Prevent form submission on Enter key for textareas
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            const form = textarea.closest('form');
            if (form) {
                form.requestSubmit();
            }
        }
    });
});

// Auto-resize textareas
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTheme,
        toggleTheme,
        validateForm,
        isValidEmail,
        debounce,
        throttle
    };
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    // Toggle animation for mobile menu button
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}

// Form handling (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
        });
    }
});

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Lottie Animation Hover Controls
document.addEventListener('DOMContentLoaded', function() {
    // Get all Lottie players on the page
    const lottieAnimations = document.querySelectorAll('lottie-player');
    
    lottieAnimations.forEach(animation => {
        const featureCard = animation.closest('.feature-card');
        if (featureCard) {
            featureCard.addEventListener('mouseenter', () => {
                animation.play();
            });
            
            featureCard.addEventListener('mouseleave', () => {
                animation.stop();
            });
        }
    });
});
