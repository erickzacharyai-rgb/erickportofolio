/**
 * Erick Zachary Cantona — Portfolio Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Loader Handling (Fast & Smooth)
  // =========================================================================
  const loader = document.getElementById('loader');
  if (loader) {
    const hideLoader = () => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 450);
    };

    window.addEventListener('load', hideLoader);
    // Safety fallback (ensures loader never gets stuck)
    setTimeout(hideLoader, 1200);
  }

  // =========================================================================
  // 2. Custom Smooth Cursor
  // =========================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    // Hover effect on interactable elements
    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .tab-btn, .contact-card-item');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // =========================================================================
  // 3. Navigation & Scroll Effects
  // =========================================================================
  const navbar = document.querySelector('.navbar-wrapper');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-active');
      });
    });
  }

  // =========================================================================
  // 4. Scroll Reveal Animations & Stats Counter
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const countUpStats = () => {
    if (statsCounted) return;
    statsCounted = true;

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      let count = 0;
      const speed = Math.max(20, Math.floor(1500 / target));

      const timer = setInterval(() => {
        count += 1;
        stat.textContent = `${count}+`;
        if (count >= target) {
          clearInterval(timer);
          stat.textContent = `${target}+`;
        }
      }, speed);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        if (entry.target.querySelector('.stat-number')) {
          countUpStats();
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el) => observer.observe(el));

  // =========================================================================
  // 5. Portfolio Filtering Logic
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // =========================================================================
  // 6. Video Preview & Poster Frame Fix
  // =========================================================================
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach((vid) => {
    const setPosterFrame = () => {
      try {
        if (vid.currentTime < 0.1) {
          vid.currentTime = 0.5;
        }
      } catch (e) {}
    };

    vid.addEventListener('loadedmetadata', setPosterFrame);
    vid.addEventListener('loadeddata', setPosterFrame);
    vid.addEventListener('canplay', setPosterFrame);
    if (vid.readyState >= 1) {
      setPosterFrame();
    }
  });

  const videoCards = document.querySelectorAll('.portfolio-card.video-card');
  videoCards.forEach((card) => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, ignore
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      try {
        video.currentTime = 0.5;
      } catch (e) {}
    });
  });

  // =========================================================================
  // 7. Lightbox Modal (Images & Full Videos)
  // =========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightboxMediaContainer');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  const openLightbox = (type, src, title, desc) => {
    if (!lightbox || !lightboxMedia) return;

    lightboxMedia.innerHTML = '';

    if (type === 'video') {
      const videoEl = document.createElement('video');
      videoEl.src = src;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.muted = false;
      lightboxMedia.appendChild(videoEl);
    } else {
      const imgEl = document.createElement('img');
      imgEl.src = src;
      imgEl.alt = title;
      lightboxMedia.appendChild(imgEl);
    }

    if (lightboxTitle) lightboxTitle.textContent = title || 'Portofolio';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    // Pause any playing video inside modal
    const vid = lightboxMedia?.querySelector('video');
    if (vid) {
      vid.pause();
    }
    setTimeout(() => {
      if (lightboxMedia) lightboxMedia.innerHTML = '';
    }, 300);
  };

  // Attach click listener to each card
  portfolioCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const type = card.getAttribute('data-type');
      const src = card.getAttribute('data-src');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      openLightbox(type, src, title, desc);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  // =========================================================================
  // 8. Safe Fallback for Local File Protocol
  // =========================================================================
  if (window.location.protocol === 'file:') {
    const allMedia = document.querySelectorAll('.portfolio-card img, .portfolio-card video');
    allMedia.forEach((media) => {
      media.addEventListener('error', () => {
        const originalSrc = media.getAttribute('src');
        if (originalSrc && !originalSrc.startsWith('file:///')) {
          const documentsBase = 'file:///C:/Users/Erick/Documents/PORTOFOLIO%20ERICK/';
          const cleanSrc = originalSrc.split('#')[0];
          media.src = documentsBase + encodeURI(cleanSrc);
        }
      });
    });
  }

});
