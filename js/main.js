// Toggle mobile nav menu
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// Scroll fade-in animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        
        // Special handling for about content
        if (entry.target.classList.contains('about-content')) {
          entry.target.classList.add('animate');
        }
        
        // Special handling for about image
        if (entry.target.classList.contains('about-image')) {
          entry.target.classList.add('slide-right');
        }
        
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe elements that should animate on scroll
  document.querySelectorAll('.feature-card, .product-card, .about-content, .about-image, .products-box, .services-box').forEach(card => {
    observer.observe(card);
  });
}

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector('.header');
  const headerBgRgb = getComputedStyle(document.documentElement).getPropertyValue('--header-bg-rgb').trim();
  if (window.scrollY > 50) {
    navbar.style.background = `rgba(${headerBgRgb}, 0.95)`;
    navbar.style.backdropFilter = 'blur(10px)';
  } else {
    navbar.style.background = '';
    navbar.style.backdropFilter = '';
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
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
}

// Close mobile menu when clicking on nav links
function initMobileMenuClose() {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('active');
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  initScrollAnimations();
  initSmoothScrolling();
  initMobileMenuClose();
});

// Window event listeners
window.addEventListener('scroll', handleNavbarScroll);

// Loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
