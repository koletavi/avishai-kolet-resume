/**
 * Avishai Kolet — Elegant Resume Website
 * All client-side interactivity (vanilla JS)
 * Features: theme toggle, copy-to-clipboard, active nav, skills filter, toasts, print
 */

// ==================== THEME (Dark / Light) ====================
const THEME_KEY = 'ak-theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  // Default to dark (elegant engineering aesthetic)
  return 'dark';
}

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'light') {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
  } else {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  }
  // Update toggle button icon if present
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  // Desktop icon
  const iconContainer = document.getElementById('theme-icon');
  if (iconContainer) {
    if (theme === 'light') {
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      `;
    } else {
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      `;
    }
  }

  // Mobile icon (if present in the menu)
  const mobileIcon = document.getElementById('theme-icon-mobile');
  if (mobileIcon) {
    if (theme === 'light') {
      mobileIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      `;
    } else {
      mobileIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      `;
    }
  }
}

function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);

  // Attach listeners to all theme toggle buttons (desktop + mobile)
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });
}

// ==================== TOAST NOTIFICATIONS ====================
let toastTimeout = null;

function showToast(message, duration = 2200) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden', 'opacity-0');
  toast.classList.add('flex', 'opacity-100');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      toast.classList.remove('flex', 'opacity-100');
      toast.classList.add('hidden');
    }, 200);
  }, duration);
}

// ==================== COPY TO CLIPBOARD ====================
async function copyToClipboard(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`);
  } catch (err) {
    // Fallback for older browsers / insecure contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`${label} copied to clipboard`);
    } catch (e) {
      showToast('Unable to copy — please copy manually');
    }
    document.body.removeChild(ta);
  }
}

function initCopyButtons() {
  // Desktop / main contact row
  const phoneBtn = document.getElementById('copy-phone');
  const emailBtn = document.getElementById('copy-email');
  const linkedinBtn = document.getElementById('copy-linkedin');

  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => copyToClipboard('052-5611384', 'Phone number'));
  }
  if (emailBtn) {
    emailBtn.addEventListener('click', () => copyToClipboard('koletavi@gmail.com', 'Email address'));
  }
  if (linkedinBtn) {
    linkedinBtn.addEventListener('click', () => 
      copyToClipboard('https://www.linkedin.com/in/avishai-kolet', 'LinkedIn URL')
    );
  }

  // Mobile menu contacts (if present)
  const phoneBtnM = document.getElementById('copy-phone-mobile');
  const emailBtnM = document.getElementById('copy-email-mobile');
  if (phoneBtnM) phoneBtnM.addEventListener('click', () => copyToClipboard('052-5611384', 'Phone number'));
  if (emailBtnM) emailBtnM.addEventListener('click', () => copyToClipboard('koletavi@gmail.com', 'Email address'));
}

// ==================== ACTIVE NAV + SMOOTH SCROLL ====================
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  if (!sections.length) return;

  let isNavClickInProgress = false;

  // Helper: pick the single best visible section
  function getBestVisibleSection() {
    let best = null;
    let bestScore = -Infinity;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      // Score = how much of the section is visible + bias toward sections higher on screen
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      const ratio = visibleHeight / Math.max(1, rect.height);
      // Extra points for sections whose top is near the top of the viewport (after nav)
      const topBonus = rect.top > -80 && rect.top < 300 ? 0.4 : 0;
      const score = ratio + topBonus;

      if (score > bestScore) {
        bestScore = score;
        best = section;
      }
    });
    return best;
  }

  const observer = new IntersectionObserver(
    () => {
      // Ignore observer updates right after a nav click (prevents race during smooth scroll)
      if (isNavClickInProgress) return;

      const best = getBestVisibleSection();
      if (!best) return;

      const id = best.id;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'page' : 'false');
      });
    },
    {
      rootMargin: '-70px 0px -35% 0px',
      threshold: [0.1, 0.25, 0.5, 0.75] // more granular thresholds
    }
  );

  sections.forEach(section => observer.observe(section));

  // Smooth scroll + immediate active state + guard against observer fighting the choice
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // 1. Immediately activate the clicked link (user's explicit choice wins)
        navLinks.forEach(l => {
          const isThisOne = l === link;
          l.classList.toggle('active', isThisOne);
          l.setAttribute('aria-current', isThisOne ? 'page' : 'false');
        });

        // 2. Block the observer from overriding during the scroll animation
        isNavClickInProgress = true;
        setTimeout(() => {
          isNavClickInProgress = false;
        }, 950); // slightly longer than typical smooth scroll duration

        // 3. Scroll
        const y = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: 'smooth' });

        // 4. Close mobile menu
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
}

// ==================== SKILLS FILTER (live + category chips) ====================
function initSkillsFilter() {
  const input = document.getElementById('skills-filter');
  const pills = Array.from(document.querySelectorAll('#skills-grid .skill-pill'));
  const categoryChips = Array.from(document.querySelectorAll('.filter-chip'));

  if (!input || !pills.length) return;

  let activeCategory = null; // e.g. "Digital", "FPGA", etc.

  function applyFilter() {
    const query = (input.value || '').toLowerCase().trim();

    pills.forEach(pill => {
      const text = pill.textContent.toLowerCase();
      const group = pill.dataset.group || '';

      const matchesText = !query || text.includes(query);
      const matchesCategory = !activeCategory || group.toLowerCase().includes(activeCategory.toLowerCase());

      if (matchesText && matchesCategory) {
        pill.style.display = '';
      } else {
        pill.style.display = 'none';
      }
    });
  }

  // Live text filter
  input.addEventListener('input', applyFilter);

  // Category filter chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.category;

      if (activeCategory === cat) {
        // Toggle off
        activeCategory = null;
        categoryChips.forEach(c => c.classList.remove('active'));
      } else {
        activeCategory = cat;
        categoryChips.forEach(c => c.classList.toggle('active', c.dataset.category === cat));
      }
      applyFilter();
    });
  });

  // Optional: clear filters button (if exists)
  const clearBtn = document.getElementById('skills-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      activeCategory = null;
      categoryChips.forEach(c => c.classList.remove('active'));
      applyFilter();
    });
  }

  // Keyboard hint: pressing / focuses the filter
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName === 'BODY') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      menu.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('hidden') && 
        !menu.contains(e.target) && 
        !toggle.contains(e.target)) {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==================== PRINT HANDLER ====================
function initPrintButton() {
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Also support keyboard shortcut hint (Ctrl/Cmd+P is native)
}

// ==================== CONTACT REVEAL (Anti-scraping) ====================
function initContactReveal() {
  const btn = document.getElementById('reveal-contact-btn');
  const details = document.getElementById('contact-details');

  if (!btn || !details) return;

  const phoneEl = document.getElementById('contact-phone');
  const emailEl = document.getElementById('contact-email');
  const linkedinEl = document.getElementById('contact-linkedin');

  let isRevealed = false;

  btn.addEventListener('click', () => {
    if (!isRevealed) {
      // Reveal: populate values from data attributes (anti-scraping)
      const phone = btn.dataset.phone;
      const email = btn.dataset.email;
      const linkedin = btn.dataset.linkedin;

      if (phoneEl) phoneEl.textContent = phone;
      if (emailEl) emailEl.textContent = email;
      if (linkedinEl) {
        linkedinEl.textContent = 'linkedin.com/in/avishai-kolet';
        linkedinEl.href = linkedin;
      }

      // Show the details with fade
      details.classList.remove('hidden', 'opacity-0');
      details.classList.add('opacity-100');

      // Change button to "Hide"
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        Hide Contact Information
      `;

      isRevealed = true;

      // Re-attach copy listeners in case (they were already attached at load, but safe)
      // The elements existed from the start, so listeners are already there.
    } else {
      // Hide again
      details.classList.add('hidden', 'opacity-0');
      details.classList.remove('opacity-100');

      // Restore original button text
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Show Contact Information
      `;

      isRevealed = false;
    }
  });
}

// ==================== INITIALIZATION ====================
function init() {
  initTheme();
  initCopyButtons();
  initActiveNav();
  initSkillsFilter();
  initMobileMenu();
  initPrintButton();
  initContactReveal();

  // Accessibility: announce filter usage
  const filterInput = document.getElementById('skills-filter');
  if (filterInput) {
    filterInput.setAttribute('aria-label', 'Filter technical skills by keyword');
  }
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
