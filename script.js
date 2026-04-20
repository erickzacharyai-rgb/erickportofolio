document.addEventListener('DOMContentLoaded', () => {

  // --- Loader ---
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 2000);
    });
    // Fallback if load takes too long
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 4000);
  }

  // --- Custom Cursor ---
  const cursor = document.getElementById('cursorDot');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Cursor hover effects on links/buttons
    const hoverElements = document.querySelectorAll('a, button, .portfolio-card, .portfolio-video-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });
  }

  // --- Navigation & Scroll ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // Close nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Smooth Scroll for Hash Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // --- Hero Animations ---
  const animateElements = document.querySelectorAll('.animate-in');
  animateElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 2200 + (index * 150)); // Start after loader
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // If it's a skill bar, actuate it
        if (entry.target.classList.contains('skills-grid')) {
          const fills = entry.target.querySelectorAll('.skill-fill');
          fills.forEach(fill => {
            fill.style.width = fill.getAttribute('data-width') + '%';
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Portfolio Filtering ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.classList.remove('hidden');
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.classList.add('hidden');
          card.style.opacity = '0';
        }
      });
    });
  });

  // --- Video Playing Handling ---
  const videoCards = document.querySelectorAll('.portfolio-video-card');
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    
    card.addEventListener('click', () => {
      if (video.paused) {
        // Pause all other videos first
        document.querySelectorAll('video').forEach(v => {
          if(v !== video) {
            v.pause();
            v.closest('.portfolio-video-card')?.classList.remove('playing');
          }
        });
        
        video.muted = false;
        video.play();
        card.classList.add('playing');
      } else {
        video.pause();
        card.classList.remove('playing');
      }
    });

    video.addEventListener('ended', () => {
      card.classList.remove('playing');
    });
  });

  // --- Lightbox Logic ---
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  
  if(lightbox && lightboxContent && lightboxClose) {
    // Collect all click targets (images and videos) in the portfolio grid
    const mediaItems = document.querySelectorAll('.portfolio-media img, .portfolio-media video');
    
    mediaItems.forEach(item => {
      // Modify cursor behavior for clickable media
      item.style.cursor = 'pointer';
      
      item.addEventListener('click', (e) => {
        // Prevent event from bubbling to video play button logic
        e.stopPropagation();
        
        // Clear previous content
        lightboxContent.innerHTML = '';
        
        if(item.tagName === 'IMG') {
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = item.alt;
          lightboxContent.appendChild(img);
        } else if(item.tagName === 'VIDEO') {
          const video = document.createElement('video');
          video.src = item.src;
          video.controls = true;
          video.autoplay = true;
          lightboxContent.appendChild(video);
        }
        
        lightbox.classList.add('active');
      });
    });

    // Close lightbox functions
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      // Stop checking if it's a video
      const vid = lightboxContent.querySelector('video');
      if(vid) vid.pause();
      setTimeout(() => { lightboxContent.innerHTML = ''; }, 400); // clear after transition
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if(e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

});
