// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const galleryContainer = document.getElementById('galleryContainer');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');

// Gallery Images Data
const galleryImages = [
  { src: 'https://i.postimg.cc/DZW1j2hy/machine.jpg', alt: 'Garden machinery work' },
  { src: 'https://i.postimg.cc/7Ltgn5ph/art.jpg', alt: 'Garden landscaping' },
  { src: 'https://i.postimg.cc/QtR1vRNx/yardb.jpg', alt: 'Before garden cleanup' },
  { src: 'https://i.postimg.cc/hGtLmL3P/image1.jpg', alt: 'After garden cleanup' },
  { src: 'https://i.postimg.cc/XJTdtTNq/round.jpg', alt: 'Paving and edging' },
  { src: 'https://i.postimg.cc/4drVjr4d/yardg.jpg', alt: 'Green lawn finish' },
  { src: 'https://i.postimg.cc/rmC80YFB/IMG_20260118_WA0016.jpg', alt: 'Project 1' },
  { src: 'https://i.postimg.cc/qRXkhZM1/IMG_20260118_WA0020.jpg', alt: 'Project 2' },
  { src: 'https://i.postimg.cc/50qxYkNg/IMG_20260118_WA0021.jpg', alt: 'Project 3' },
  { src: 'https://i.postimg.cc/sgyb1DGk/IMG_20260118_WA0006.jpg', alt: 'Project 4' },
  { src: 'https://i.postimg.cc/C1HFB6LX/IMG_20260118_WA0023.jpg', alt: 'Project 5' }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderGallery();
  initLightbox();
  initContactForm();
  initSmoothScrolling();
});

// Navigation Toggle
function initNavigation() {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
  });

  // Close menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Render Gallery Images
function renderGallery() {
  galleryImages.forEach((image, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('role', 'button');
    galleryItem.setAttribute('tabindex', '0');
    galleryItem.setAttribute('aria-label', `View image ${index + 1}: ${image.alt}`);
    
    galleryItem.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy">
      <div class="gallery-overlay">${image.alt}</div>
    `;
    
    galleryItem.addEventListener('click', () => openLightbox(image.src, image.alt));
    galleryItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(image.src, image.alt);
      }
    });
    
    galleryContainer.appendChild(galleryItem);
  });
}

// Lightbox Functionality
function initLightbox() {
  // Close lightbox on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close button
  lightboxClose.addEventListener('click', closeLightbox);
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

// Contact Form
function initContactForm() {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !phone || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Format message for WhatsApp
    const whatsappMessage = `New Service Inquiry%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Service Needed:* ${message}%0A%0A_I would like a free quote for this service._`;
    const whatsappUrl = `https://wa.me/27660400260?text=${whatsappMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showNotification('Opening WhatsApp to send your message...', 'success');
    
    // Reset form
    contactForm.reset();
  });
}

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 3000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  if (type === 'success') {
    notification.style.backgroundColor = '#2e7d32';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#d32f2f';
  } else {
    notification.style.backgroundColor = '#1976d2';
  }
  
  document.body.appendChild(notification);
  
  // Remove notification after animation
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3300);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);

// Lazy loading for images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '0px 0px 100px 0px'
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Form validation enhancement
function initFormValidation() {
  const phoneInput = document.getElementById('phone');
  
  phoneInput.addEventListener('input', (e) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
  });
  
  phoneInput.addEventListener('blur', (e) => {
    const value = e.target.value;
    if (value && value.length < 10) {
      e.target.setCustomValidity('Please enter a valid phone number');
    } else {
      e.target.setCustomValidity('');
    }
  });
}

// Initialize form validation
initFormValidation();

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Handle scroll-based animations here
  }, 100);
});

// Add loading state for buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function() {
    if (this.type === 'submit' || this.href.includes('wa.me')) {
      this.classList.add('loading');
      setTimeout(() => this.classList.remove('loading'), 2000);
    }
  });
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
  .btn.loading {
    position: relative;
    color: transparent !important;
  }
  
  .btn.loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -10px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(loadingStyle);