/* ==========================================================================
   script.js: Uzair-Dev-Coder portfolio (rebuilt after the 11-pillar audit)

   FIXED vs the old 1,817-line file:
   - No anime.js dependency and no fake loader (they cost ~2.5 s and broke every skill bar when the CDN failed).
   - Eight copy-pasted tilt functions became one createTilt(); no more per-scroll layout reads
     (scroll-spy and reveals use IntersectionObserver; the header uses one passive, rAF-throttled listener).
   - Nothing animates width/height/top/left. Effects write CSS custom properties or `translate`.
   - Every effect checks prefers-reduced-motion at the moment it runs, not just once at load.
   - The orbit and the cursor loop stop when they are off-screen or idle (no endless timers).
   - Language toggle validates the saved value, builds no HTML strings, and also translates aria-labels.
   - The contact form validates, sanitises, shows loading / success / error, and falls back cleanly
     when a popup is blocked. Nothing user-typed is ever inserted into the DOM as HTML.

   Contract with index.html / style.css: ids #siteHeader #menuToggle #navMenu #langToggle #contactForm
   #formStatus #waFallback #projectViewer; hooks [data-ar] [data-ar-label] [data-count] [data-tilt] [data-magnetic] [data-project-viewer] .reveal .orbit
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 0. CONFIGURATION: the only values you should need to edit -------------------------------- */
  var CONFIG = {
    whatsappNumber: '923259281031',   // international format, no "+"
    formEndpoint: '',                  // OPTIONAL: set to a Formspree/Web3Forms URL to send by POST instead of WhatsApp
    storageKey: 'udc-language',
    desktopQuery: '(min-width: 860px)'
  };

  /* ---- 1. SHARED HELPERS ------------------------------------------------------------------------ */
  var root = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  var desktopQuery = window.matchMedia(CONFIG.desktopQuery);

  function prefersReducedMotion() { return motionQuery.matches; }
  function canUsePointerEffects() { return finePointerQuery.matches && !prefersReducedMotion(); }
  function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }

  function readStoredLanguage() {
    try {
      var saved = window.localStorage.getItem(CONFIG.storageKey);
      return saved === 'ar' || saved === 'en' ? saved : 'en';   // FIXED: unknown values fall back to English
    } catch (error) { return 'en'; }                            // private mode / blocked storage
  }
  function storeLanguage(language) {
    try { window.localStorage.setItem(CONFIG.storageKey, language); } catch (error) { /* storage unavailable: ignore */ }
  }

  /* ---- 2. TRANSLATIONS FOR TEXT THAT SCRIPT CREATES (everything static uses data-ar in the HTML) --- */
  var messages = {
    en: {
      switchLabel: 'AR, switch to Arabic', switchText: 'AR',
      openMenu: 'Open navigation', closeMenu: 'Close navigation',
      nameRequired: 'Please enter your name.',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'That email address looks incomplete. Example: name@example.com',
      messageRequired: 'Please write a message.',
      messageShort: 'Please add a little more detail (at least 10 characters).',
      sending: 'Sending…',
      opening: 'Opening WhatsApp with your message…',
      sent: 'Thank you! Your message was sent.',
      failed: 'Something went wrong. Please use the WhatsApp button below.',
      fixErrors: 'Please fix the highlighted fields.'
    },
    ar: {
      switchLabel: 'EN، التبديل إلى الإنجليزية', switchText: 'EN',
      openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة',
      nameRequired: 'يرجى إدخال اسمك.',
      emailRequired: 'يرجى إدخال بريدك الإلكتروني.',
      emailInvalid: 'يبدو أن البريد غير مكتمل. مثال: name@example.com',
      messageRequired: 'يرجى كتابة رسالة.',
      messageShort: 'يرجى إضافة تفاصيل أكثر (10 أحرف على الأقل).',
      sending: 'جارٍ الإرسال…',
      opening: 'جارٍ فتح واتساب مع رسالتك…',
      sent: 'شكراً لك! تم إرسال رسالتك.',
      failed: 'حدث خطأ ما. يرجى استخدام زر واتساب أدناه.',
      fixErrors: 'يرجى تصحيح الحقول المحددة.'
    }
  };
  var currentLanguage = 'en';
  function t(key) { return messages[currentLanguage][key]; }

  /* ---- 3. LANGUAGE TOGGLE (EN / AR with RTL) ---------------------------------------------------- */
  var languageToggle = document.getElementById('langToggle');
  var menuToggle = document.getElementById('menuToggle');

  function applyLanguage(language) {
    currentLanguage = language;
    var isArabic = language === 'ar';
    root.lang = language;
    root.dir = isArabic ? 'rtl' : 'ltr';

    // Visible text: the English original is remembered the first time, so toggling is lossless.
    document.querySelectorAll('[data-ar]').forEach(function (element) {
      if (!('en' in element.dataset)) { element.dataset.en = element.textContent; }
      element.textContent = isArabic ? element.dataset.ar : element.dataset.en;
    });
    // Accessible names (aria-label) and placeholders, for elements that opt in.
    document.querySelectorAll('[data-ar-label]').forEach(function (element) {
      if (!('enLabel' in element.dataset)) { element.dataset.enLabel = element.getAttribute('aria-label') || ''; }
      element.setAttribute('aria-label', isArabic ? element.dataset.arLabel : element.dataset.enLabel);
    });
    document.querySelectorAll('[data-ar-placeholder]').forEach(function (element) {
      if (!('enPlaceholder' in element.dataset)) { element.dataset.enPlaceholder = element.getAttribute('placeholder') || ''; }
      element.setAttribute('placeholder', isArabic ? element.dataset.arPlaceholder : element.dataset.enPlaceholder);
    });

    // Toggle button: visible text is contained in its accessible name (WCAG 2.5.3).
    languageToggle.querySelector('.lang-text').textContent = t('switchText');
    languageToggle.setAttribute('aria-label', t('switchLabel'));
    setMenuState(menuToggle.getAttribute('aria-expanded') === 'true');
    requestAnimationFrame(updateNavIndicator);   // Arabic link widths differ, so re-measure the pill
  }

  languageToggle.addEventListener('click', function () {
    var nextLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    applyLanguage(nextLanguage);
    storeLanguage(nextLanguage);
  });

  /* ---- 4. HEADER: mobile menu, scrolled state, scroll-spy, sliding indicator ---------------------- */
  var siteHeader = document.getElementById('siteHeader');
  var navElement = document.getElementById('navMenu');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var navIndicator = navElement.querySelector('.nav__indicator');

  // A disclosure pattern (not a modal): closed links are hidden from tab order by CSS, Escape closes it.
  function setMenuState(isOpen) {
    siteHeader.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? t('closeMenu') : t('openMenu'));
  }
  menuToggle.addEventListener('click', function () {
    setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.forEach(function (link) { link.addEventListener('click', function () { setMenuState(false); }); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuState(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', function (event) {
    if (!siteHeader.contains(event.target)) { setMenuState(false); }   // tap outside closes
  });
  desktopQuery.addEventListener('change', function () { setMenuState(false); updateNavIndicator(); });

  // Pill position: measured with offsetLeft/offsetWidth (physical), which stays correct in RTL.
  function updateNavIndicator() {
    var activeLink = navElement.querySelector('.nav__link[aria-current="true"]');
    if (!activeLink || !desktopQuery.matches) { return; }
    navElement.style.setProperty('--indicator-x', activeLink.offsetLeft + 'px');
    navElement.style.setProperty('--indicator-width', activeLink.offsetWidth + 'px');
  }
  function setActiveSection(sectionId) {
    navLinks.forEach(function (link) {
      if (link.dataset.section === sectionId) { link.setAttribute('aria-current', 'true'); }
      else { link.removeAttribute('aria-current'); }
    });
    updateNavIndicator();
  }

  // Scroll-spy: a thin band across the middle of the viewport decides the active section. No scroll listener, no layout reads.
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) { setActiveSection(entry.target.id); } });
  }, { rootMargin: '-40% 0px -55% 0px' });
  navLinks.forEach(function (link) {
    var section = document.getElementById(link.dataset.section);
    if (section) { sectionObserver.observe(section); }
  });

  // Header gets a stronger background after the first few pixels. One passive listener, throttled with rAF.
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (scrollTicking) { return; }
    scrollTicking = true;
    requestAnimationFrame(function () {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
      scrollTicking = false;
    });
  }, { passive: true });

  if ('ResizeObserver' in window) { new ResizeObserver(updateNavIndicator).observe(navElement); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(updateNavIndicator); }

  /* ---- 5. SCROLL REVEAL + COUNT-UP (IntersectionObserver, runs once per element) -------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (element) { revealObserver.observe(element); });

  // Numbers already contain their real value in the HTML (so no-JS and reduced-motion users see it); this only adds the count-up.
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      countObserver.unobserve(entry.target);
      animateCount(entry.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (element) { countObserver.observe(element); });

  function animateCount(element) {
    var target = parseInt(element.dataset.count, 10);
    if (isNaN(target) || prefersReducedMotion()) { return; }
    var duration = 1100;
    var startTime = null;
    function step(timestamp) {
      if (startTime === null) { startTime = timestamp; }
      var progress = clamp((timestamp - startTime) / duration, 0, 1);
      var eased = 1 - Math.pow(1 - progress, 3);                  // ease-out cubic
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) { requestAnimationFrame(step); } else { element.textContent = String(target); }
    }
    requestAnimationFrame(step);
  }

  /* ---- 6. ORBIT: pause when off-screen or the tab is hidden --------------------------------------- */
  var orbitElement = document.querySelector('.orbit');
  if (orbitElement) {
    var orbitVisible = true;
    var syncOrbit = function () { orbitElement.classList.toggle('is-paused', !orbitVisible || document.hidden); };
    new IntersectionObserver(function (entries) { orbitVisible = entries[0].isIntersecting; syncOrbit(); }).observe(orbitElement);
    document.addEventListener('visibilitychange', syncOrbit);
  }

  /* ---- 7. CARD TILT: one factory replaces the old eight copies ------------------------------------- */
  function createTilt(card) {
    var maximumDegrees = 5;
    var frameRequested = false;
    var pointerX = 0, pointerY = 0;

    function paint() {
      frameRequested = false;
      var box = card.getBoundingClientRect();
      var horizontal = clamp((pointerX - box.left) / box.width, 0, 1);    // 0 to 1 across the card
      var vertical = clamp((pointerY - box.top) / box.height, 0, 1);      // 0 to 1 down the card
      card.style.setProperty('--tilt-x', ((0.5 - vertical) * maximumDegrees * 2).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', ((horizontal - 0.5) * maximumDegrees * 2).toFixed(2) + 'deg');
      card.style.setProperty('--glow-x', (horizontal * 100).toFixed(1) + '%');
      card.style.setProperty('--glow-y', (vertical * 100).toFixed(1) + '%');
    }
    card.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse' || !canUsePointerEffects()) { return; }
      pointerX = event.clientX; pointerY = event.clientY;
      card.classList.add('is-tilting');
      if (!frameRequested) { frameRequested = true; requestAnimationFrame(paint); }
    });
    card.addEventListener('pointerleave', function () {
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  }
  document.querySelectorAll('[data-tilt]').forEach(createTilt);

  /* ---- 8. MAGNETIC BUTTONS: pull toward the pointer by up to 10px, ease back on leave ---------------- */
  function createMagnet(button) {
    button.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse' || !canUsePointerEffects()) { return; }
      var box = button.getBoundingClientRect();
      var offsetX = event.clientX - (box.left + box.width / 2);
      var offsetY = event.clientY - (box.top + box.height / 2);
      button.style.setProperty('--mag-x', clamp(offsetX * 0.25, -10, 10).toFixed(1) + 'px');
      button.style.setProperty('--mag-y', clamp(offsetY * 0.25, -10, 10).toFixed(1) + 'px');
    });
    button.addEventListener('pointerleave', function () {
      button.style.setProperty('--mag-x', '0px');
      button.style.setProperty('--mag-y', '0px');
    });
  }
  document.querySelectorAll('[data-magnetic]').forEach(createMagnet);

  /* ---- 9. CUSTOM CURSOR: a trailing ring, only for fine pointers; the native cursor is never hidden ---- */
  if (canUsePointerEffects()) {
    var cursorElement = document.createElement('div');
    cursorElement.className = 'cursor';
    cursorElement.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorElement);

    var targetX = 0, targetY = 0, currentX = 0, currentY = 0, cursorFrame = 0;
    var followPointer = function () {
      currentX += (targetX - currentX) * 0.2;                     // linear interpolation gives the soft trailing feel
      currentY += (targetY - currentY) * 0.2;
      cursorElement.style.translate = currentX.toFixed(1) + 'px ' + currentY.toFixed(1) + 'px';
      var stillMoving = Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1;
      cursorFrame = stillMoving ? requestAnimationFrame(followPointer) : 0;   // loop sleeps when idle
    };
    document.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse') { return; }
      targetX = event.clientX; targetY = event.clientY;
      cursorElement.classList.add('is-visible');
      if (!cursorFrame) { cursorFrame = requestAnimationFrame(followPointer); }
    }, { passive: true });
    document.addEventListener('pointerover', function (event) {
      cursorElement.classList.toggle('is-hover', Boolean(event.target.closest('a, button, input, textarea, label')));
    });
    document.documentElement.addEventListener('mouseleave', function () { cursorElement.classList.remove('is-visible'); });
  }

  /* ---- 10. CONTACT FORM: validate, sanitise, then hand off to WhatsApp (or POST if configured) ---------- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  var whatsappFallback = document.getElementById('waFallback');
  var submitButton = contactForm.querySelector('button[type="submit"]');
  var pageOpenedAt = Date.now();

  // Removes control characters, trims, and caps length. Output is only ever used in encodeURIComponent / JSON, never innerHTML.
  function sanitise(value, maximumLength, keepLineBreaks) {
    var pattern = keepLineBreaks ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
    return String(value).replace(pattern, '').replace(/[ \t]{2,}/g, ' ').trim().slice(0, maximumLength);
  }
  function showFieldError(input, text) {
    var errorElement = document.getElementById(input.id + 'Error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
    errorElement.textContent = text;
    errorElement.hidden = false;
  }
  function clearFieldError(input) {
    var errorElement = document.getElementById(input.id + 'Error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    errorElement.hidden = true;
    errorElement.textContent = '';
  }
  function setStatus(state, text) { formStatus.dataset.state = state; formStatus.textContent = text; }

  contactForm.querySelectorAll('input, textarea').forEach(function (input) {
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid')) { clearFieldError(input); } });
  });

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var nameInput = contactForm.elements.name;
    var emailInput = contactForm.elements.email;
    var messageInput = contactForm.elements.message;
    var values = {
      name: sanitise(nameInput.value, 80, false),
      email: sanitise(emailInput.value, 120, false),
      message: sanitise(messageInput.value, 1000, true)
    };

    // Honeypot: real people never see this field. Pretend it worked so bots learn nothing.
    if (contactForm.elements.company.value) { setStatus('success', t('sent')); return; }

    [nameInput, emailInput, messageInput].forEach(clearFieldError);
    var firstInvalidInput = null;
    function invalidate(input, key) { showFieldError(input, t(key)); firstInvalidInput = firstInvalidInput || input; }

    if (!values.name) { invalidate(nameInput, 'nameRequired'); }
    if (!values.email) { invalidate(emailInput, 'emailRequired'); }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) { invalidate(emailInput, 'emailInvalid'); }
    if (!values.message) { invalidate(messageInput, 'messageRequired'); }
    else if (values.message.length < 10) { invalidate(messageInput, 'messageShort'); }

    if (firstInvalidInput) { setStatus('error', t('fixErrors')); firstInvalidInput.focus(); return; }

    var whatsappText = 'Hi Uzair, my name is ' + values.name + '.\n\n' + values.message + '\n\nReply to: ' + values.email;
    var whatsappUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(whatsappText);
    if (whatsappUrl.length > 1900) { whatsappUrl = whatsappUrl.slice(0, 1900).replace(/%[0-9A-F]?$/i, ''); }   // keep the link within URL limits
    whatsappFallback.href = whatsappUrl;

    if (CONFIG.formEndpoint) { sendByPost(values, whatsappUrl); } else { openWhatsApp(whatsappUrl); }
  });

  function openWhatsApp(whatsappUrl) {
    setStatus('loading', t('opening'));
    // FIXED: the "noopener" feature makes window.open() return null even on success, which looked like a blocked popup.
    // So open normally, detect a real block (null), then sever the opener link manually.
    var openedWindow = window.open(whatsappUrl, '_blank');
    whatsappFallback.hidden = false;                       // always offered: popup blockers and desktop WhatsApp vary
    if (openedWindow) { openedWindow.opener = null; } else { setStatus('error', t('failed')); }
  }

  function sendByPost(values, whatsappUrl) {
    var secondsSincePageOpened = (Date.now() - pageOpenedAt) / 1000;
    if (secondsSincePageOpened < 3) { setStatus('error', t('failed')); return; }   // humans take longer than 3 s to write a message
    submitButton.classList.add('is-loading');
    setStatus('loading', t('sending'));
    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(values)
    }).then(function (response) {
      if (!response.ok) { throw new Error('Request failed'); }
      setStatus('success', t('sent'));
      contactForm.reset();
    }).catch(function () {
      setStatus('error', t('failed'));
      whatsappFallback.hidden = false;
    }).then(function () { submitButton.classList.remove('is-loading'); });
  }

  /* ---- 10b. PROJECT VIEWER: projects open inside the portfolio (new) --------------------------------------
     The "View project" links are plain same-tab links (they work with JS off). With JS, a normal click opens the
     page in a full-screen <dialog> with an iframe. Ctrl/Cmd/Shift/middle-click keep the browser's own behaviour. */
  var projectViewer = document.getElementById('projectViewer');
  if (projectViewer && typeof projectViewer.showModal === 'function') {
    var viewerFrame = document.getElementById('viewerFrame');
    var viewerTitle = document.getElementById('viewerTitle');
    var viewerNewTab = document.getElementById('viewerNewTab');
    document.querySelectorAll('[data-project-viewer]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
        event.preventDefault();
        var projectUrl = link.getAttribute('href');
        viewerTitle.textContent = link.dataset.title;
        viewerFrame.title = link.dataset.title;
        viewerFrame.src = projectUrl;
        viewerNewTab.href = projectUrl;
        projectViewer.showModal();               // focus moves into the dialog and is trapped there
        root.classList.add('viewer-open');
      });
    });
    document.getElementById('viewerClose').addEventListener('click', function () { projectViewer.close(); });
    projectViewer.addEventListener('close', function () {   // fires for the Close button AND the Escape key
      viewerFrame.src = 'about:blank';           // stops the project (audio, timers) and frees memory
      root.classList.remove('viewer-open');      // focus returns to the card that opened it automatically
    });
  }

  /* ---- 11. START ------------------------------------------------------------------------------------ */
  applyLanguage(readStoredLanguage());
  setActiveSection('home');
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 16);
})();
