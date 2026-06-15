document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  const state = {
    theme: localStorage.getItem('theme') || 'dark',
    lang: localStorage.getItem('lang') || 'zh'
  };

  // --- SELECTORS ---
  const body = document.body;
  const langToggle = document.getElementById('lang-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // --- THEME CONTROL ---
  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    state.theme = themeName;
    localStorage.setItem('theme', themeName);
    
    // Update icon
    if (themeName === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
    }
  }

  // Initial Theme Load
  applyTheme(state.theme);

  themeToggle.addEventListener('click', () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // --- LANGUAGE CONTROL ---
  function applyLanguage(langCode) {
    state.lang = langCode;
    localStorage.setItem('lang', langCode);
    
    if (langCode === 'en') {
      body.className = 'lang-en';
    } else {
      body.className = 'lang-zh';
    }
    
    // Set HTML lang attribute for accessibility
    document.documentElement.lang = langCode === 'en' ? 'en' : 'zh-Hant';
  }

  // Initial Lang Load
  applyLanguage(state.lang);

  langToggle.addEventListener('click', () => {
    const newLang = state.lang === 'zh' ? 'en' : 'zh';
    applyLanguage(newLang);
  });

  // --- TIMELINE TOGGLER ---
  const toggleItems = document.querySelectorAll('.timeline-toggle-container .toggle-item');
  const timelineViews = document.querySelectorAll('.timeline-wrap .timeline-view');

  toggleItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all toggle items
      toggleItems.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked item
      item.classList.add('active');

      const targetId = item.getAttribute('data-target');
      
      // Hide all views and show target view
      timelineViews.forEach(view => {
        if (view.id === targetId) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });
    });
  });

  // --- PUBLICATIONS FILTER ---
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to current button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      pubCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          const cardType = card.getAttribute('data-type');
          if (cardType === filterValue) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // --- VENN DIAGRAM INTERACTIVITY ---
  const vennCog = document.getElementById('circle-cog');
  const vennKin = document.getElementById('circle-kin');
  const vennMed = document.getElementById('circle-med');
  
  const specCog = document.getElementById('spec-cog');
  const specKin = document.getElementById('spec-kin');
  const specMed = document.getElementById('spec-med');
  const allSpecs = [specCog, specKin, specMed];

  function highlightSpec(activeSpec) {
    allSpecs.forEach(spec => {
      if (spec) spec.classList.remove('active');
    });
    if (activeSpec) {
      activeSpec.classList.add('active');
      activeSpec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (vennCog && specCog) {
    vennCog.addEventListener('click', () => highlightSpec(specCog));
    vennCog.addEventListener('mouseenter', () => highlightSpec(specCog));
  }
  if (vennKin && specKin) {
    vennKin.addEventListener('click', () => highlightSpec(specKin));
    vennKin.addEventListener('mouseenter', () => highlightSpec(specKin));
  }
  if (vennMed && specMed) {
    vennMed.addEventListener('click', () => highlightSpec(specMed));
    vennMed.addEventListener('mouseenter', () => highlightSpec(specMed));
  }

  // --- SCROLL REVEAL ON SCROLL ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!window.IntersectionObserver) {
    // Fallback for older browsers or restricted webviews
    revealElements.forEach(el => el.classList.add('active'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Stop observing once animation triggers to keep page stable
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- COPY EMAIL FUNCTIONALITY ---
  const btnCopy = document.getElementById('btn-copy');
  const emailText = document.getElementById('email-address').textContent.trim();
  const toast = document.getElementById('toast');

  if (btnCopy && toast) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(emailText).then(() => {
        // Show Toast
        toast.classList.add('show');
        
        // Hide Toast after 2.5s
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // --- ACTIVE HEADER LINK HIGHLIGHTING ---
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksContainer.classList.toggle('show');
      const icon = menuToggle.querySelector('i');
      if (navLinksContainer.classList.contains('show')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinksContainer.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }
});
