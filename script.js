// Is object mein website ki chalti hui yaad rakhi jati hai, jaise zaban aur theme.
// Yeh AppState naam ki jagah banata hai aur us mein value rakhta hai.
const AppState = {
    // currentLang batata hai ke abhi English ya Arabic dikh rahi hai.
    // Yeh object mein currentLang ki value batata hai.
    currentLang: 'en',
    // currentSection scroll par saamne aane wale section ka naam rakhta hai.
    // Yeh object mein currentSection ki value batata hai.
    currentSection: 'home',
    // isMenuOpen yaad rakhta hai ke mobile menu khula hai ya band.
    // Yeh object mein isMenuOpen ki value batata hai.
    isMenuOpen: false,
    // isLoaded batata hai ke pehli martaba setup mukammal hua ya nahi.
    // Yeh object mein isLoaded ki value batata hai.
    isLoaded: false
// Yeh pichla function ya code block band karta hai.
};

// Jab HTML tayyar ho jaye tab website ke buttons aur doosre controls chalao.
// Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
document.addEventListener('DOMContentLoaded', () => {
    // Yeh initializeApp naam ka kaam chalata hai.
    initializeApp();
// Yeh pichla function ya code block band karta hai.
});

// Website shuru karne ke liye preferences aur tamam interactive features tayyar karta hai.
// Yeh initializeApp naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initializeApp() {
    initializeSeoMetadata();
    // Pehle saved choices parho, phir har button aur scroll feature ko chalu karo.
    // Yeh loadPreferences naam ka kaam chalata hai.
    loadPreferences();
    // Yeh initLanguage naam ka kaam chalata hai.
    initLanguage();
    // Yeh initNavigation naam ka kaam chalata hai.
    initNavigation();
    // Yeh initScrollEffects naam ka kaam chalata hai.
    initScrollEffects();
    // Yeh initFormHandlers naam ka kaam chalata hai.
    initFormHandlers();
    // Yeh initMobileMenu naam ka kaam chalata hai.
    initMobileMenu();
    // Yeh initSkillOrbit naam ka kaam chalata hai.
    initSkillOrbit();
    // Yeh updateLanguageUI naam ka kaam chalata hai.
    updateLanguageUI();
    // Yeh AppState.isLoaded ki value update karta hai.
    AppState.isLoaded = true;
// Yeh pichla function ya code block band karta hai.
}

function initializeSeoMetadata() {
    if (!['http:', 'https:'].includes(window.location.protocol)) return;
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonicalUrl;
    const imageUrl = new URL('orbit-skills-business-card-dark.png', canonicalUrl).href;
    document.querySelector('meta[property="og:image"]').content = imageUrl;
    document.querySelector('meta[name="twitter:image"]').content = imageUrl;
    const personSchema = document.querySelector('script[type="application/ld+json"]');
    if (personSchema) {
        try {
            const person = JSON.parse(personSchema.textContent);
            person.url = canonicalUrl;
            personSchema.textContent = JSON.stringify(person);
        } catch { /* Keep the valid static schema if parsing fails. */ }
    }
}

// Skill chips ko label ki asal width ke hisaab se gol daire mein barabar faslay par rakhta hai.
// Yeh initSkillOrbit naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initSkillOrbit() {
    // Yeh orbit mein page se dhoonda gaya element rakhta hai.
    const orbit = document.querySelector('.skill-orbit');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (!orbit) return;

    // Yeh items mein page se dhoonda gaya element rakhta hai.
    const items = Array.from(orbit.querySelectorAll('.skill-orbit__item'));
    // Yeh gap naam ki jagah banata hai aur us mein value rakhta hai.
    const gap = 14;
    // Yeh resizeFrame naam ki jagah banata hai aur us mein value rakhta hai.
    let resizeFrame = 0;

    // Yeh layoutOrbit naam ki jagah banata hai aur us mein value rakhta hai.
    const layoutOrbit = () => {
        // Yeh cancelAnimationFrame ka kaam chalata hai.
        cancelAnimationFrame(resizeFrame);
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        resizeFrame = requestAnimationFrame(() => {
            // Yeh widths mein page se dhoonda gaya element rakhta hai.
            const widths = items.map(item => item.querySelector('.skill-orbit__chip')?.offsetWidth || 0);
            // Yeh circumference naam ki jagah banata hai aur us mein value rakhta hai.
            const circumference = widths.reduce((sum, width) => sum + width + gap, 0);
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (!circumference) return;

            // Yeh radius naam ki jagah banata hai aur us mein value rakhta hai.
            const radius = circumference / (2 * Math.PI);
            // Yeh distance naam ki jagah banata hai aur us mein value rakhta hai.
            let distance = 0;
            // Yeh orbit.style.setProperty naam ka kaam chalata hai.
            orbit.style.setProperty('--orbit-radius', `${radius}px`);

            // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
            items.forEach((item, index) => {
                // Yeh centerDistance naam ki list banata hai.
                const centerDistance = distance + widths[index] / 2;
                // Yeh item.style.setProperty naam ka kaam chalata hai.
                item.style.setProperty('--angle', `${(centerDistance / circumference) * 360}deg`);
                // Yeh is function ke aglay step ka code hai.
                distance += widths[index] + gap;
            // Yeh pichla function ya code block band karta hai.
            });
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    };

    // Yeh layoutOrbit naam ka kaam chalata hai.
    layoutOrbit();
    // Yeh click ya doosre event ka intezar karne wala listener lagata hai.
    window.addEventListener('resize', layoutOrbit, { passive: true });
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (document.fonts?.ready) document.fonts.ready.then(layoutOrbit);
// Yeh pichla function ya code block band karta hai.
}

// Browser ki memory se pehle chuni hui zaban aur rang wapas parhta hai.
// Yeh loadPreferences naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function readPreference(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}

function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Continue without persistence. */ }
}

function loadPreferences() {
    // Yeh savedLang naam ki jagah banata hai aur us mein value rakhta hai.
    const savedLang = readPreference('portfolio-lang');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (savedLang) AppState.currentLang = savedLang;
// Yeh pichla function ya code block band karta hai.
}

// Zaban badalne wale button ko click ke saath jorta hai aur pehli zaban lagata hai.
// Yeh initLanguage naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initLanguage() {
    // Yeh langToggle mein page se dhoonda gaya element rakhta hai.
    const langToggle = document.getElementById('langToggle');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (langToggle) {
        // Yeh click ya doosre event ka intezar karne wala listener lagata hai.
        langToggle.addEventListener('click', toggleLanguage);
    // Yeh pichla function ya code block band karta hai.
    }
    // Yeh setLanguage naam ka kaam chalata hai.
    setLanguage(AppState.currentLang);
// Yeh pichla function ya code block band karta hai.
}

// English aur Arabic ke darmiyan badalta hai aur nayi choice browser mein save karta hai.
// Yeh toggleLanguage naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function toggleLanguage() {
    // Yeh newLang naam ki jagah banata hai aur us mein value rakhta hai.
    const newLang = AppState.currentLang === 'en' ? 'ar' : 'en';
    // Yeh setLanguage naam ka kaam chalata hai.
    setLanguage(newLang);
    // Yeh localStorage.setItem naam ka kaam chalata hai.
    savePreference('portfolio-lang', newLang);
// Yeh pichla function ya code block band karta hai.
}

// Page ki zaban aur likhne ki simt set karke tamam tarjume wale text ko update karta hai.
// Yeh setLanguage naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function setLanguage(lang) {
    // Yeh AppState.currentLang ki value update karta hai.
    AppState.currentLang = lang;
    // Yeh html naam ki jagah banata hai aur us mein value rakhta hai.
    const html = document.documentElement;
    // Yeh body naam ki jagah banata hai aur us mein value rakhta hai.
    const body = document.body;
    
    // Arabic daein se baein likhi jati hai; English baein se daein.
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (lang === 'ar') {
        // Yeh html.setAttribute naam ka kaam chalata hai.
        html.setAttribute('lang', 'ar');
        // Yeh html.setAttribute naam ka kaam chalata hai.
        html.setAttribute('dir', 'rtl');
        // Yeh body.setAttribute naam ka kaam chalata hai.
        body.setAttribute('data-lang', 'ar');
        // Yeh body.setAttribute naam ka kaam chalata hai.
        body.setAttribute('data-dir', 'rtl');
    // Pehli condition ghalat ho to yeh doosra raasta shuru karta hai.
    } else {
        // Yeh html.setAttribute naam ka kaam chalata hai.
        html.setAttribute('lang', 'en');
        // Yeh html.setAttribute naam ka kaam chalata hai.
        html.setAttribute('dir', 'ltr');
        // Yeh body.setAttribute naam ka kaam chalata hai.
        body.setAttribute('data-lang', 'en');
        // Yeh body.setAttribute naam ka kaam chalata hai.
        body.setAttribute('data-dir', 'ltr');
    // Yeh pichla function ya code block band karta hai.
    }
    // Yeh updateLanguageUI naam ka kaam chalata hai.
    updateLanguageUI();
// Yeh pichla function ya code block band karta hai.
}

// data-text attributes se har label ka chuna hua zaban wala matn dikhata hai.
// Yeh updateLanguageUI naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function updateLanguageUI() {
    // Aise HTML elements dhoondo jin mein English ya Arabic ka matn diya gaya hai.
    // Yeh textElements mein page se dhoonda gaya element rakhta hai.
    const textElements = document.querySelectorAll('[data-text-en], [data-text-ar]');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    textElements.forEach(element => {
        // Yeh enText naam ki jagah banata hai aur us mein value rakhta hai.
        const enText = element.getAttribute('data-text-en');
        // Yeh arText naam ki jagah banata hai aur us mein value rakhta hai.
        const arText = element.getAttribute('data-text-ar');
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (AppState.currentLang === 'ar' && arText) {
            // Yeh element.textContent ki dikhne wali value ya style badalta hai.
            element.textContent = arText;
    // Pehli condition ghalat ho to yeh agli condition check karta hai.
        } else if (AppState.currentLang === 'en' && enText) {
            // Yeh element.textContent ki dikhne wali value ya style badalta hai.
            element.textContent = enText;
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    });
    
    // Form ke khali fields mein dikhne wali misaali hidayat bhi zaban ke saath badlo.
    // Yeh placeholderElements mein page se dhoonda gaya element rakhta hai.
    const placeholderElements = document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    placeholderElements.forEach(element => {
        // Yeh enPlaceholder naam ki jagah banata hai aur us mein value rakhta hai.
        const enPlaceholder = element.getAttribute('data-placeholder-en');
        // Yeh arPlaceholder naam ki jagah banata hai aur us mein value rakhta hai.
        const arPlaceholder = element.getAttribute('data-placeholder-ar');
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (AppState.currentLang === 'ar' && arPlaceholder) {
            // Yeh element.setAttribute naam ka kaam chalata hai.
            element.setAttribute('placeholder', arPlaceholder);
    // Pehli condition ghalat ho to yeh agli condition check karta hai.
        } else if (AppState.currentLang === 'en' && enPlaceholder) {
            // Yeh element.setAttribute naam ka kaam chalata hai.
            element.setAttribute('placeholder', enPlaceholder);
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    });
    
    // Yeh langToggle mein page se dhoonda gaya element rakhta hai.
    const langToggle = document.getElementById('langToggle');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (langToggle) {
        // Yeh langText mein page se dhoonda gaya element rakhta hai.
        const langText = langToggle.querySelector('.lang-text');
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (langText) {
            // Yeh langText.textContent ki dikhne wali value ya style badalta hai.
            langText.textContent = AppState.currentLang === 'en' ? 'AR' : 'EN';
            langToggle.setAttribute('aria-label', AppState.currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English');
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    }
// Yeh pichla function ya code block band karta hai.
}

// Navigation links par click aur page scroll ke listeners lagata hai.
// Yeh initNavigation naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initNavigation() {
    // Yeh navLinks mein page se dhoonda gaya element rakhta hai.
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    navLinks.forEach(link => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        link.addEventListener('click', (e) => {
            // Yeh e.preventDefault naam ka kaam chalata hai.
            e.preventDefault();
            // Yeh targetId naam ki jagah banata hai aur us mein value rakhta hai.
            const targetId = link.getAttribute('href');
            // Yeh targetSection mein page se dhoonda gaya element rakhta hai.
            const targetSection = document.querySelector(targetId);
            
            // Sirf tab scroll karo jab link ka section page par waqai mil jaye.
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (targetSection) {
                // Yeh headerHeight mein page se dhoonda gaya element rakhta hai.
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                // Yeh targetPosition naam ki jagah banata hai aur us mein value rakhta hai.
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Yeh window.scrollTo naam ka kaam chalata hai.
                window.scrollTo({
                    // Yeh object mein top ki value batata hai.
                    top: targetPosition,
                    // Yeh object mein behavior ki value batata hai.
                    behavior: 'smooth'
                // Yeh pichla function ya code block band karta hai.
                });
                
                // Yeh updateActiveNavLink naam ka kaam chalata hai.
                updateActiveNavLink(link);
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (AppState.isMenuOpen) {
                    // Yeh toggleMobileMenu naam ka kaam chalata hai.
                    toggleMobileMenu();
                // Yeh pichla function ya code block band karta hai.
                }
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    });
    
    // Yeh click ya doosre event ka intezar karne wala listener lagata hai.
    window.addEventListener('scroll', handleScroll);
    // Yeh click ya doosre event ka intezar karne wala listener lagata hai.
    window.addEventListener('scroll', updateHeaderOnScroll);
// Yeh pichla function ya code block band karta hai.
}

// Scroll ki jagah se pata karta hai kaunsa section saamne hai.
// Yeh handleScroll naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function handleScroll() {
    // Yeh sections mein page se dhoonda gaya element rakhta hai.
    const sections = document.querySelectorAll('section[id]');
    // Yeh scrollPosition naam ki jagah banata hai aur us mein value rakhta hai.
    const scrollPosition = window.scrollY + 100;
    
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    sections.forEach(section => {
        // Yeh sectionTop naam ki jagah banata hai aur us mein value rakhta hai.
        const sectionTop = section.offsetTop;
        // Yeh sectionHeight naam ki jagah banata hai aur us mein value rakhta hai.
        const sectionHeight = section.offsetHeight;
        // Yeh sectionId naam ki jagah banata hai aur us mein value rakhta hai.
        const sectionId = section.getAttribute('id');
        
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Yeh AppState.currentSection ki value update karta hai.
            AppState.currentSection = sectionId;
            // Yeh updateActiveNavLink naam ka kaam chalata hai.
            updateActiveNavLink(null, sectionId);
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Purana active nishan hata kar sahi section ke navigation link ko highlight karta hai.
// Yeh updateActiveNavLink naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function updateActiveNavLink(clickedLink, sectionId = null) {
    // Yeh navLinks mein page se dhoonda gaya element rakhta hai.
    const navLinks = document.querySelectorAll('.nav-link');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    navLinks.forEach(link => {
        // Yeh link.classList.remove naam ka kaam chalata hai.
        link.classList.remove('active');
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (clickedLink && link === clickedLink) {
            // Yeh link.classList.add naam ka kaam chalata hai.
            link.classList.add('active');
    // Pehli condition ghalat ho to yeh agli condition check karta hai.
        } else if (sectionId) {
            // Yeh linkSection naam ki jagah banata hai aur us mein value rakhta hai.
            const linkSection = link.getAttribute('data-section');
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (linkSection === sectionId) {
                // Yeh link.classList.add naam ka kaam chalata hai.
                link.classList.add('active');
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Page neeche scroll ho to header par extra style lagata hai, warna hata deta hai.
// Yeh updateHeaderOnScroll naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function updateHeaderOnScroll() {
    // Yeh header mein page se dhoonda gaya element rakhta hai.
    const header = document.querySelector('.main-header');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (window.scrollY > 50) {
        // Yeh header.classList.add naam ka kaam chalata hai.
        header.classList.add('scrolled');
    // Pehli condition ghalat ho to yeh doosra raasta shuru karta hai.
    } else {
        // Yeh header.classList.remove naam ka kaam chalata hai.
        header.classList.remove('scrolled');
    // Yeh pichla function ya code block band karta hai.
    }
// Yeh pichla function ya code block band karta hai.
}

// Jab section screen par aaye to us par visible class laga kar fade effect chalata hai.
// Yeh initScrollEffects naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initScrollEffects() {
    // Yeh observerOptions naam ki jagah banata hai aur us mein value rakhta hai.
    const observerOptions = {
        // Yeh object mein threshold ki value batata hai.
        threshold: 0.1,
        // Yeh object mein rootMargin ki value batata hai.
        rootMargin: '0px 0px -100px 0px'
    // Yeh pichla function ya code block band karta hai.
    };
    
    // Yeh observer naam ki jagah banata hai aur us mein value rakhta hai.
    const observer = new IntersectionObserver((entries) => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        entries.forEach(entry => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (entry.isIntersecting) {
                // Yeh entry.target.classList.add naam ka kaam chalata hai.
                entry.target.classList.add('visible');
                // Yeh observer.unobserve naam ka kaam chalata hai.
                observer.unobserve(entry.target);
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh is function ke aglay step ka code hai.
    }, observerOptions);
    
    // Yeh fadeElements mein page se dhoonda gaya element rakhta hai.
    const fadeElements = document.querySelectorAll('.fade-in');
    // Yeh element ki value update karta hai.
    fadeElements.forEach(element => observer.observe(element));
    
    // Yeh sections mein page se dhoonda gaya element rakhta hai.
    const sections = document.querySelectorAll('.section');
    // Yeh section ki value update karta hai.
    sections.forEach(section => observer.observe(section));
// Yeh pichla function ya code block band karta hai.
}

// Contact form maujood ho to submit hone par uska handler chalane ke liye jorta hai.
// Yeh initFormHandlers naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initFormHandlers() {
    // Yeh contactForm mein page se dhoonda gaya element rakhta hai.
    const contactForm = document.getElementById('contactForm');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (contactForm) {
        // Yeh click ya doosre event ka intezar karne wala listener lagata hai.
        contactForm.addEventListener('submit', handleFormSubmit);
    // Yeh pichla function ya code block band karta hai.
    }
// Yeh pichla function ya code block band karta hai.
}

// Form ke fields parhta hai aur demo message dikhata hai; yeh abhi email nahi bhejta.
// Yeh handleFormSubmit naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function handleFormSubmit(e) {
    // Yeh e.preventDefault naam ka kaam chalata hai.
    e.preventDefault();
    // Yeh formData naam ki jagah banata hai aur us mein value rakhta hai.
    const formData = new FormData(e.target);
    // Yeh data naam ki jagah banata hai aur us mein value rakhta hai.
    const data = Object.fromEntries(formData);
    const text = `Hi Uzair, I visited your portfolio and want to discuss a project.\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`;
    const chatUrl = `https://wa.me/923259281031?text=${encodeURIComponent(text)}`;
    const fallback = document.getElementById('contactWhatsAppFallback');
    const status = document.getElementById('contactFormStatus');
    fallback.href = chatUrl;
    fallback.hidden = false;
    status.textContent = AppState.currentLang === 'ar'
        ? 'يفتح واتساب برسالتك. اضغط إرسال هناك لإرسالها.'
        : 'WhatsApp is opening with your message. Press Send there to deliver it.';
    window.open(chatUrl, '_blank', 'noopener,noreferrer');
// Yeh pichla function ya code block band karta hai.
}

// Mobile menu button aur menu ke bahar click ko sun kar menu kholta/band karta hai.
// Yeh initMobileMenu naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initMobileMenu() {
    // Yeh menuToggle mein page se dhoonda gaya element rakhta hai.
    const menuToggle = document.getElementById('menuToggle');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (menuToggle) {
        // Yeh click ya doosre event ka intezar karne wala listener lagata hai.
        menuToggle.addEventListener('click', toggleMobileMenu);
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    document.addEventListener('click', (e) => {
        // Yeh navMenu mein page se dhoonda gaya element rakhta hai.
        const navMenu = document.getElementById('navMenu');
        // Yeh menuToggle mein page se dhoonda gaya element rakhta hai.
        const menuToggle = document.getElementById('menuToggle');
        
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (AppState.isMenuOpen && 
            // Yeh is function ke aglay step ka code hai.
            !navMenu.contains(e.target) && 
            // Yeh is function ke aglay step ka code hai.
            !menuToggle.contains(e.target)) {
            // Yeh toggleMobileMenu naam ka kaam chalata hai.
            toggleMobileMenu();
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isMenuOpen) {
            toggleMobileMenu();
            document.getElementById('menuToggle')?.focus();
        }
    });
// Yeh pichla function ya code block band karta hai.
}

// Menu khula hai ya band, yeh yaad karke menu aur button ki classes badalta hai.
// Yeh toggleMobileMenu naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function toggleMobileMenu() {
    // Yeh AppState.isMenuOpen ki value update karta hai.
    AppState.isMenuOpen = !AppState.isMenuOpen;
    // Yeh navMenu mein page se dhoonda gaya element rakhta hai.
    const navMenu = document.getElementById('navMenu');
    // Yeh menuToggle mein page se dhoonda gaya element rakhta hai.
    const menuToggle = document.getElementById('menuToggle');
    
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (navMenu) {
        // Yeh navMenu.classList.toggle naam ka kaam chalata hai.
        navMenu.classList.toggle('active', AppState.isMenuOpen);
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (menuToggle) {
        // Yeh menuToggle.classList.toggle naam ka kaam chalata hai.
        menuToggle.classList.toggle('active', AppState.isMenuOpen);
        menuToggle.setAttribute('aria-expanded', String(AppState.isMenuOpen));
        menuToggle.setAttribute('aria-label', AppState.isMenuOpen ? 'Close navigation' : 'Open navigation');
    // Yeh pichla function ya code block band karta hai.
    }
// Yeh pichla function ya code block band karta hai.
}

// Hero ke background mein random code symbols bana kar tairne ke liye rakhta hai.
// Yeh generateParticles naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function generateParticles() {
    // Yeh particlesContainer mein page se dhoonda gaya element rakhta hai.
    const particlesContainer = document.getElementById('particles');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (!particlesContainer) return;
    
    // Yeh codeSymbols naam ki list banata hai.
    const codeSymbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', '+', '-', ';', ':', '&', '|', '%', '$', '#', '@'];
    // Yeh particleCount naam ki jagah banata hai aur us mein value rakhta hai.
    const particleCount = 20;
    
    // Yeh har item ke liye andar ka kaam dobara karta hai.
    for (let i = 0; i < particleCount; i++) {
        // Yeh particle naam ki jagah banata hai aur us mein value rakhta hai.
        const particle = document.createElement('div');
        // Yeh particle.className ki dikhne wali value ya style badalta hai.
        particle.className = 'particle';
        // Yeh particle.textContent ki dikhne wali value ya style badalta hai.
        particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        // Yeh particle.style.left ki dikhne wali value ya style badalta hai.
        particle.style.left = Math.random() * 100 + '%';
        // Yeh particle.style.animationDelay ki dikhne wali value ya style badalta hai.
        particle.style.animationDelay = Math.random() * 15 + 's';
        // Yeh particle.style.animationDuration ki dikhne wali value ya style badalta hai.
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        // Yeh particlesContainer.appendChild naam ka kaam chalata hai.
        particlesContainer.appendChild(particle);
    // Yeh pichla function ya code block band karta hai.
    }
// Yeh pichla function ya code block band karta hai.
}

// HTML tayyar hote hi hero ke decorative symbols banao.
// Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
document.addEventListener('DOMContentLoaded', () => {
    // Yeh generateParticles naam ka kaam chalata hai.
    generateParticles();
// Yeh pichla function ya code block band karta hai.
});



// Neeche ke functions screen par aane wale elements aur page animations sambhalte hain.
// Animation helpers aur page ke motion effects
// Element screen par aaye to callback chalao; one-time dekhna default hai.
// Yeh inView naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function inView(element, callback, options = {}) {
    // Yeh observer naam ki jagah banata hai aur us mein value rakhta hai.
    const observer = new IntersectionObserver((entries) => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        entries.forEach(entry => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (entry.isIntersecting) {
                // Yeh callback naam ka kaam chalata hai.
                callback(entry);
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (options.once !== false) {
                    // Yeh observer.unobserve naam ka kaam chalata hai.
                    observer.unobserve(entry.target);
                // Yeh pichla function ya code block band karta hai.
                }
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh is function ke aglay step ka code hai.
    }, {
        // Yeh object mein threshold ki value batata hai.
        threshold: options.amount || 0.1,
        // Yeh object mein rootMargin ki value batata hai.
        rootMargin: options.rootMargin || '0px'
    // Yeh pichla function ya code block band karta hai.
    });
    // Yeh observer.observe naam ka kaam chalata hai.
    observer.observe(element);
    // Yeh function se natija wapas deta hai.
    return () => observer.unobserve(element);
// Yeh pichla function ya code block band karta hai.
}

// Anime.js maujood ho to diye gaye element par aam animation chalata hai.
// Yeh animateElement naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function animateElement(element, props, options = {}) {
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (typeof anime === 'undefined') return;
    // Yeh animeProps naam ki jagah banata hai aur us mein value rakhta hai.
    const animeProps = {};
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (props.opacity) animeProps.opacity = props.opacity;
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (props.x !== undefined) animeProps.translateX = props.x;
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (props.y !== undefined) animeProps.translateY = props.y;
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (props.scale) animeProps.scale = props.scale;
    // Yeh function se natija wapas deta hai.
    return anime({
        // Yeh object mein targets ki value batata hai.
        targets: element,
        // Yeh  se mutaliq kaam karta hai.
        ...animeProps,
        // Yeh object mein duration ki value batata hai.
        duration: (options.duration || 0.8) * 1000,
        // Yeh object mein delay ki value batata hai.
        delay: (options.delay || 0) * 1000,
        // Yeh object mein easing ki value batata hai.
        easing: options.easing || 'easeOutExpo'
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Taswiren aur doosri files load hone ke baad loading animation shuru karo.
// Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
window.addEventListener('load', () => {
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    setTimeout(() => {
        // Yeh initLoaderAnimation naam ka kaam chalata hai.
        initLoaderAnimation();
    // Yeh is function ke aglay step ka code hai.
    }, 100);
// Yeh pichla function ya code block band karta hai.
});

// Loading percentage barhata hai, phir loading parda hata kar baqi animations shuru karta hai.
// Yeh initLoaderAnimation naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initLoaderAnimation() {
    // Yeh loader mein page se dhoonda gaya element rakhta hai.
    const loader = document.getElementById('loader');
    // Yeh loaderPercent mein page se dhoonda gaya element rakhta hai.
    const loaderPercent = document.getElementById('loaderPercent');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (!loader || !loaderPercent) return;
    
    // Progress ko thora thora barhao taake loading parde par chalti hui lage.
    // Yeh progress naam ki jagah banata hai aur us mein value rakhta hai.
    let progress = 0;
    // Yeh progressInterval naam ki jagah banata hai aur us mein value rakhta hai.
    const progressInterval = setInterval(() => {
        // Yeh is function ke aglay step ka code hai.
        progress += Math.random() * 15;
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (progress >= 100) {
            // Yeh progress ki value update karta hai.
            progress = 100;
            // Yeh clearInterval naam ka kaam chalata hai.
            clearInterval(progressInterval);
            // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
            setTimeout(() => {
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (typeof anime !== 'undefined') {
                    // Yeh anime naam ka kaam chalata hai.
                    anime({
                        // Yeh object mein targets ki value batata hai.
                        targets: loader,
                        // Yeh object mein opacity ki value batata hai.
                        opacity: [1, 0],
                        // Yeh object mein duration ki value batata hai.
                        duration: 500,
                        // Yeh object mein easing ki value batata hai.
                        easing: 'easeInOutQuad',
                        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
                        complete: () => {
                            // Yeh loader.classList.add naam ka kaam chalata hai.
                            loader.classList.add('hidden');
                            // Yeh initPageAnimations naam ka kaam chalata hai.
                            initPageAnimations();
                        // Yeh pichla function ya code block band karta hai.
                        }
                    // Yeh pichla function ya code block band karta hai.
                    });
    // Pehli condition ghalat ho to yeh doosra raasta shuru karta hai.
                } else {
                    // Yeh loader.classList.add naam ka kaam chalata hai.
                    loader.classList.add('hidden');
                    // Yeh initPageAnimations naam ka kaam chalata hai.
                    initPageAnimations();
                // Yeh pichla function ya code block band karta hai.
                }
            // Yeh is function ke aglay step ka code hai.
            }, 300);
        // Yeh pichla function ya code block band karta hai.
        }
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (loaderPercent) {
            // Yeh loaderPercent.textContent ki dikhne wali value ya style badalta hai.
            loaderPercent.textContent = Math.floor(progress) + '%';
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh is function ke aglay step ka code hai.
    }, 100);
// Yeh pichla function ya code block band karta hai.
}

// Loading khatam hone ke baad har section ki animation ko aik chhoti dair se shuru karta hai.
// Yeh initPageAnimations naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initPageAnimations() {
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    setTimeout(() => {
        // Yeh initHeroAnimations naam ka kaam chalata hai.
        initHeroAnimations();
        // Yeh initSkillAnimations naam ka kaam chalata hai.
        initSkillAnimations();
        // Yeh initTimelineAnimations naam ka kaam chalata hai.
        initTimelineAnimations();
        // Yeh initProjectAnimations naam ka kaam chalata hai.
        initProjectAnimations();
        // Yeh initScrollAnimations naam ka kaam chalata hai.
        initScrollAnimations();
        // Yeh initContactAnimations naam ka kaam chalata hai.
        initContactAnimations();
        // Yeh animateStats naam ka kaam chalata hai.
        animateStats();
        // Yeh initParallax naam ka kaam chalata hai.
        initParallax();
    // Yeh is function ke aglay step ka code hai.
    }, 300);
// Yeh pichla function ya code block band karta hai.
}

// Hero ke naam, heading, buttons, icons, taswir aur badges ko animate karta hai.
// Yeh initHeroAnimations naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initHeroAnimations() {
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (typeof anime === 'undefined') return;
    
    // Yeh heroName mein page se dhoonda gaya element rakhta hai.
    const heroName = document.getElementById('heroName');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (heroName) {
        // Yeh nameValue mein page se dhoonda gaya element rakhta hai.
        const nameValue = heroName.querySelector('.name-value');
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (nameValue) {
            // Naam ko pehle sambhalo, phir har frame mein uska thora hissa dikhana hai.
            // Yeh originalText naam ki jagah banata hai aur us mein value rakhta hai.
            const originalText = nameValue.textContent;
            // Yeh nameValue.textContent ki dikhne wali value ya style badalta hai.
            nameValue.textContent = '';
            // Yeh anime naam ka kaam chalata hai.
            anime({
                // Yeh object mein targets ki value batata hai.
                targets: { value: 0 },
                // Yeh object mein value ki value batata hai.
                value: originalText.length,
                // Yeh object mein duration ki value batata hai.
                duration: 1500,
                // Yeh object mein delay ki value batata hai.
                delay: 500,
                // Yeh object mein easing ki value batata hai.
                easing: 'easeInOutQuad',
                // Yeh object mein update ki value batata hai.
                update: function(anim) {
                    // Yeh length naam ki list banata hai.
                    const length = Math.floor(anim.animatables[0].target.value);
                    // Yeh nameValue.textContent ki dikhne wali value ya style badalta hai.
                    nameValue.textContent = originalText.substring(0, length);
                // Yeh pichla function ya code block band karta hai.
                },
                // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
                complete: () => {
                    // Yeh cursor naam ki jagah banata hai aur us mein value rakhta hai.
                    const cursor = document.createElement('span');
                    // Yeh cursor.className ki dikhne wali value ya style badalta hai.
                    cursor.className = 'name-cursor';
                    // Yeh cursor.textContent ki dikhne wali value ya style badalta hai.
                    cursor.textContent = '|';
                    // Yeh cursor.style.animation ki dikhne wali value ya style badalta hai.
                    cursor.style.animation = 'blink 1s infinite';
                    // Yeh nameValue.appendChild naam ka kaam chalata hai.
                    nameValue.appendChild(cursor);
                    // Yeh setTimeout ka kaam chalata hai.
                    setTimeout(() => cursor.remove(), 2000);
                // Yeh pichla function ya code block band karta hai.
                }
            // Yeh pichla function ya code block band karta hai.
            });
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh heroTitle mein page se dhoonda gaya element rakhta hai.
    const heroTitle = document.querySelector('.hero-title');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (heroTitle) {
        // Yeh anime naam ka kaam chalata hai.
        anime({
            // Yeh object mein targets ki value batata hai.
            targets: heroTitle,
            // Yeh object mein opacity ki value batata hai.
            opacity: [0, 1],
            // Yeh object mein translateX ki value batata hai.
            translateX: [-30, 0],
            // Yeh object mein delay ki value batata hai.
            delay: 800,
            // Yeh object mein duration ki value batata hai.
            duration: 1000,
            // Yeh object mein easing ki value batata hai.
            easing: 'easeOutExpo'
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh heroDescription mein page se dhoonda gaya element rakhta hai.
    const heroDescription = document.querySelector('.hero-description');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (heroDescription) {
        // Yeh anime naam ka kaam chalata hai.
        anime({
            // Yeh object mein targets ki value batata hai.
            targets: heroDescription,
            // Yeh object mein opacity ki value batata hai.
            opacity: [0, 1],
            // Yeh object mein translateY ki value batata hai.
            translateY: [20, 0],
            // Yeh object mein delay ki value batata hai.
            delay: 1200,
            // Yeh object mein duration ki value batata hai.
            duration: 1000,
            // Yeh object mein easing ki value batata hai.
            easing: 'easeOutExpo'
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh heroButtons mein page se dhoonda gaya element rakhta hai.
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (heroButtons.length > 0) {
        // Yeh anime naam ka kaam chalata hai.
        anime({
            // Yeh object mein targets ki value batata hai.
            targets: heroButtons,
            // Yeh object mein opacity ki value batata hai.
            opacity: [0, 1],
            // Yeh object mein scale ki value batata hai.
            scale: [0.8, 1],
            // Yeh object mein delay ki value batata hai.
            delay: anime.stagger(100, {start: 1500}),
            // Yeh object mein duration ki value batata hai.
            duration: 800,
            // Yeh object mein easing ki value batata hai.
            easing: 'easeOutBack'
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh socialIcons mein page se dhoonda gaya element rakhta hai.
    const socialIcons = document.querySelectorAll('.hero-social .social-icon');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (socialIcons.length > 0) {
        // Yeh anime naam ka kaam chalata hai.
        anime({
            // Yeh object mein targets ki value batata hai.
            targets: socialIcons,
            // Yeh object mein opacity ki value batata hai.
            opacity: [0, 1],
            // Yeh object mein scale ki value batata hai.
            scale: [0, 1],
            // Yeh object mein rotate ki value batata hai.
            rotate: [180, 0],
            // Yeh object mein delay ki value batata hai.
            delay: anime.stagger(100, {start: 2000}),
            // Yeh object mein duration ki value batata hai.
            duration: 800,
            // Yeh object mein easing ki value batata hai.
            easing: 'easeOutBack'
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh profileImage mein page se dhoonda gaya element rakhta hai.
    const profileImage = document.getElementById('profileImage');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (profileImage) {
        // Yeh anime naam ka kaam chalata hai.
        anime({
            // Yeh object mein targets ki value batata hai.
            targets: profileImage,
            // Yeh object mein opacity ki value batata hai.
            opacity: [0, 1],
            // Yeh object mein scale ki value batata hai.
            scale: [0.8, 1],
            // Yeh object mein rotate ki value batata hai.
            rotate: [180, 0],
            // Yeh object mein delay ki value batata hai.
            delay: 1000,
            // Yeh object mein duration ki value batata hai.
            duration: 1500,
            // Yeh object mein easing ki value batata hai.
            easing: 'easeOutElastic(1, .8)'
        // Yeh pichla function ya code block band karta hai.
        });
        
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        profileImage.addEventListener('mouseenter', () => {
            // Yeh anime naam ka kaam chalata hai.
            anime({
                // Yeh object mein targets ki value batata hai.
                targets: profileImage,
                // Yeh object mein scale ki value batata hai.
                scale: [1, 1.1],
                // Yeh object mein rotate ki value batata hai.
                rotate: [0, 5],
                // Yeh object mein duration ki value batata hai.
                duration: 500,
                // Yeh object mein easing ki value batata hai.
                easing: 'easeOutElastic(1, .8)'
            // Yeh pichla function ya code block band karta hai.
            });
        // Yeh pichla function ya code block band karta hai.
        });
        
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        profileImage.addEventListener('mouseleave', () => {
            // Yeh anime naam ka kaam chalata hai.
            anime({
                // Yeh object mein targets ki value batata hai.
                targets: profileImage,
                // Yeh object mein scale ki value batata hai.
                scale: [1.1, 1],
                // Yeh object mein rotate ki value batata hai.
                rotate: [5, 0],
                // Yeh object mein duration ki value batata hai.
                duration: 500,
                // Yeh object mein easing ki value batata hai.
                easing: 'easeOutElastic(1, .8)'
            // Yeh pichla function ya code block band karta hai.
            });
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    }
    
    // Yeh badges mein page se dhoonda gaya element rakhta hai.
    const badges = document.querySelectorAll('.floating-badge');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (badges.length > 0) {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        badges.forEach((badge, index) => {
            // Yeh anime naam ka kaam chalata hai.
            anime({
                // Yeh object mein targets ki value batata hai.
                targets: badge,
                // Yeh object mein opacity ki value batata hai.
                opacity: [0, 1],
                // Yeh object mein scale ki value batata hai.
                scale: [0, 1],
                // Yeh object mein delay ki value batata hai.
                delay: 1500 + (index * 200),
                // Yeh object mein duration ki value batata hai.
                duration: 800,
                // Yeh object mein easing ki value batata hai.
                easing: 'easeOutBack'
            // Yeh pichla function ya code block band karta hai.
            });
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    }
// Yeh pichla function ya code block band karta hai.
}

// Skill screen par aaye to uski progress line aur percentage ko animate karta hai.
// Yeh initSkillAnimations naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initSkillAnimations() {
    // Yeh skillsSection mein page se dhoonda gaya element rakhta hai.
    const skillsSection = document.getElementById('skills');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (!skillsSection) return;
    
    // Yeh skillItems mein page se dhoonda gaya element rakhta hai.
    const skillItems = skillsSection.querySelectorAll('.skill-item');
    // Yeh observer naam ki jagah banata hai aur us mein value rakhta hai.
    const observer = new IntersectionObserver((entries) => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        entries.forEach(entry => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (entry.isIntersecting) {
                // Yeh skillItem naam ki jagah banata hai aur us mein value rakhta hai.
                const skillItem = entry.target;
                // Yeh progressBar mein page se dhoonda gaya element rakhta hai.
                const progressBar = skillItem.querySelector('.skill-progress');
                // Yeh percentElement mein page se dhoonda gaya element rakhta hai.
                const percentElement = skillItem.querySelector('.skill-percent');
                // Yeh percent naam ki jagah banata hai aur us mein value rakhta hai.
                const percent = parseInt(skillItem.getAttribute('data-percent') || 0);
                
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (progressBar && typeof anime !== 'undefined') {
                    // Yeh anime naam ka kaam chalata hai.
                    anime({
                        // Yeh object mein targets ki value batata hai.
                        targets: progressBar,
                        // Yeh object mein width ki value batata hai.
                        width: ['0%', percent + '%'],
                        // Yeh object mein duration ki value batata hai.
                        duration: 2000,
                        // Yeh object mein easing ki value batata hai.
                        easing: 'easeOutExpo',
                        // Yeh object mein delay ki value batata hai.
                        delay: 300
                    // Yeh pichla function ya code block band karta hai.
                    });
                    
                    // Yeh anime naam ka kaam chalata hai.
                    anime({
                        // Yeh object mein targets ki value batata hai.
                        targets: { value: 0 },
                        // Yeh object mein value ki value batata hai.
                        value: percent,
                        // Yeh object mein duration ki value batata hai.
                        duration: 2000,
                        // Yeh object mein easing ki value batata hai.
                        easing: 'easeOutExpo',
                        // Yeh object mein delay ki value batata hai.
                        delay: 300,
                        // Yeh object mein update ki value batata hai.
                        update: function(anim) {
                            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                            if (percentElement) {
                                // Yeh percentElement.textContent ki dikhne wali value ya style badalta hai.
                                percentElement.textContent = Math.floor(anim.animatables[0].target.value) + '%';
                            // Yeh pichla function ya code block band karta hai.
                            }
                        // Yeh pichla function ya code block band karta hai.
                        }
                    // Yeh pichla function ya code block band karta hai.
                    });
                // Yeh pichla function ya code block band karta hai.
                }
                // Yeh observer.unobserve naam ka kaam chalata hai.
                observer.unobserve(skillItem);
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh is function ke aglay step ka code hai.
    }, { threshold: 0.5 });
    
    // Yeh item ki value update karta hai.
    skillItems.forEach(item => observer.observe(item));
// Yeh pichla function ya code block band karta hai.
}

// Har experience item nazar aane par usay side se aahista laata hai.
// Yeh initTimelineAnimations naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initTimelineAnimations() {
    // Yeh timelineItems mein page se dhoonda gaya element rakhta hai.
    const timelineItems = document.querySelectorAll('.timeline-item');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    timelineItems.forEach((item, index) => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        inView(item, () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({
                    // Yeh object mein targets ki value batata hai.
                    targets: item,
                    // Yeh object mein opacity ki value batata hai.
                    opacity: [0, 1],
                    // Yeh object mein translateX ki value batata hai.
                    translateX: [-50, 0],
                    // Yeh object mein delay ki value batata hai.
                    delay: index * 150,
                    // Yeh object mein duration ki value batata hai.
                    duration: 1000,
                    // Yeh object mein easing ki value batata hai.
                    easing: 'easeOutExpo'
                // Yeh pichla function ya code block band karta hai.
                });
    // Pehli condition ghalat ho to yeh doosra raasta shuru karta hai.
            } else {
                // Yeh animateElement naam ka kaam chalata hai.
                animateElement(item, { opacity: [0, 1], x: [-50, 0] }, { duration: 0.8, delay: index * 0.1 });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh is function ke aglay step ka code hai.
        }, { amount: 0.3 });
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Project cards screen par aane par dikhata aur mouse le jane par halka bara karta hai.
// Yeh initProjectAnimations naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initProjectAnimations() {
    // Yeh projectCards mein page se dhoonda gaya element rakhta hai.
    const projectCards = document.querySelectorAll('.project-card');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    projectCards.forEach((card, index) => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        inView(card, () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({
                    // Yeh object mein targets ki value batata hai.
                    targets: card,
                    // Yeh object mein opacity ki value batata hai.
                    opacity: [0, 1],
                    // Yeh object mein translateY ki value batata hai.
                    translateY: [50, 0],
                    // Yeh object mein scale ki value batata hai.
                    scale: [0.9, 1],
                    // Yeh object mein delay ki value batata hai.
                    delay: index * 100,
                    // Yeh object mein duration ki value batata hai.
                    duration: 1000,
                    // Yeh object mein easing ki value batata hai.
                    easing: 'easeOutExpo'
                // Yeh pichla function ya code block band karta hai.
                });
    // Pehli condition ghalat ho to yeh doosra raasta shuru karta hai.
            } else {
                // Yeh animateElement naam ka kaam chalata hai.
                animateElement(card, { opacity: [0, 1], y: [50, 0], scale: [0.9, 1] }, { duration: 0.8, delay: index * 0.1 });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh is function ke aglay step ka code hai.
        }, { amount: 0.2 });
        
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        card.addEventListener('mouseenter', () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({ targets: card, scale: [1, 1.02], duration: 300, easing: 'easeOutQuad' });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
        
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        card.addEventListener('mouseleave', () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({ targets: card, scale: [1.02, 1], duration: 300, easing: 'easeOutQuad' });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Sections ke headings aur cards ko screen par aane par dikhane ki animation deta hai.
// Yeh initScrollAnimations naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initScrollAnimations() {
    // Yeh sections mein page se dhoonda gaya element rakhta hai.
    const sections = document.querySelectorAll('.section');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    sections.forEach(section => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        inView(section, () => {
            // Yeh sectionHeader mein page se dhoonda gaya element rakhta hai.
            const sectionHeader = section.querySelector('.section-header');
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (sectionHeader && typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({
                    // Yeh object mein targets ki value batata hai.
                    targets: sectionHeader,
                    // Yeh object mein opacity ki value batata hai.
                    opacity: [0, 1],
                    // Yeh object mein translateY ki value batata hai.
                    translateY: [-20, 0],
                    // Yeh object mein duration ki value batata hai.
                    duration: 600,
                    // Yeh object mein easing ki value batata hai.
                    easing: 'easeOutExpo'
                // Yeh pichla function ya code block band karta hai.
                });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh is function ke aglay step ka code hai.
        }, { amount: 0.2 });
    // Yeh pichla function ya code block band karta hai.
    });
    
    // Yeh cards mein page se dhoonda gaya element rakhta hai.
    const cards = document.querySelectorAll('.card, .project-card, .contact-item');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    cards.forEach((card, index) => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        inView(card, () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({
                    // Yeh object mein targets ki value batata hai.
                    targets: card,
                    // Yeh object mein opacity ki value batata hai.
                    opacity: [0, 1],
                    // Yeh object mein translateY ki value batata hai.
                    translateY: [30, 0],
                    // Yeh object mein delay ki value batata hai.
                    delay: index * 30,
                    // Yeh object mein duration ki value batata hai.
                    duration: 500,
                    // Yeh object mein easing ki value batata hai.
                    easing: 'easeOutExpo'
                // Yeh pichla function ya code block band karta hai.
                });
    // Pehli condition ghalat ho to yeh doosra raasta shuru karta hai.
            } else {
                // Yeh animateElement naam ka kaam chalata hai.
                animateElement(card, { opacity: [0, 1], y: [50, 0] }, { duration: 0.6, delay: index * 0.05 });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh is function ke aglay step ka code hai.
        }, { amount: 0.2 });
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// About section ke numbers ko zero se unke muqarrar number tak gin kar dikhata hai.
// Yeh animateStats naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function animateStats() {
    // Yeh statNumbers mein page se dhoonda gaya element rakhta hai.
    const statNumbers = document.querySelectorAll('.stat-number');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    statNumbers.forEach(stat => {
        // Yeh target naam ki jagah banata hai aur us mein value rakhta hai.
        const target = parseInt(stat.getAttribute('data-count') || 0);
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        inView(stat, () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({
                    // Yeh object mein targets ki value batata hai.
                    targets: { value: 0 },
                    // Yeh object mein value ki value batata hai.
                    value: target,
                    // Yeh object mein duration ki value batata hai.
                    duration: 2000,
                    // Yeh object mein easing ki value batata hai.
                    easing: 'easeOutExpo',
                    // Yeh object mein update ki value batata hai.
                    update: function(anim) {
                        // Yeh stat.textContent ki dikhne wali value ya style badalta hai.
                        stat.textContent = Math.floor(anim.animatables[0].target.value);
                    // Yeh pichla function ya code block band karta hai.
                    }
                // Yeh pichla function ya code block band karta hai.
                });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh is function ke aglay step ka code hai.
        }, { amount: 0.5 });
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Contact details par mouse aane par halka sa bara hone ka effect deta hai.
// Yeh initContactAnimations naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initContactAnimations() {
    // Yeh contactItems mein page se dhoonda gaya element rakhta hai.
    const contactItems = document.querySelectorAll('.contact-item');
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    contactItems.forEach(item => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        item.addEventListener('mouseenter', () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({ targets: item, scale: [1, 1.02], duration: 200, easing: 'easeOutQuad' });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        item.addEventListener('mouseleave', () => {
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (typeof anime !== 'undefined') {
                // Yeh anime naam ka kaam chalata hai.
                anime({ targets: item, scale: [1.02, 1], duration: 200, easing: 'easeOutQuad' });
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Scroll ke waqt profile aur background grid ko mukhtalif raftaar se hila kar gehrai dikhata hai.
// Yeh initParallax naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initParallax() {
    // Yeh profileImage mein page se dhoonda gaya element rakhta hai.
    const profileImage = document.getElementById('profileImage');
    // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
    if (!profileImage) return;
    
    // Ticking aik nishan hai jo aik waqt mein sirf aik scroll frame chalne deta hai.
    // Yeh ticking naam ki jagah banata hai aur us mein value rakhta hai.
    let ticking = false;
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    window.addEventListener('scroll', () => {
        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
        if (!ticking) {
            // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
            window.requestAnimationFrame(() => {
                // Yeh scrolled naam ki jagah banata hai aur us mein value rakhta hai.
                const scrolled = window.pageYOffset;
                // Yeh parallaxSpeed naam ki jagah banata hai aur us mein value rakhta hai.
                const parallaxSpeed = 0.3;
                // Yeh maxOffset naam ki jagah banata hai aur us mein value rakhta hai.
                const maxOffset = 100;
                // Yeh offset naam ki jagah banata hai aur us mein value rakhta hai.
                const offset = Math.min(scrolled * parallaxSpeed, maxOffset);
                
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (profileImage) {
                    // Yeh profileImage.style.transform ki dikhne wali value ya style badalta hai.
                    profileImage.style.transform = `translateY(${offset}px)`;
                // Yeh pichla function ya code block band karta hai.
                }
                
                // Yeh gridBg mein page se dhoonda gaya element rakhta hai.
                const gridBg = document.querySelector('.code-grid-bg');
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (gridBg) {
                    // Yeh gridBg.style.transform ki dikhne wali value ya style badalta hai.
                    gridBg.style.transform = `translateY(${scrolled * 0.2}px)`;
                // Yeh pichla function ya code block band karta hai.
                }
                
                // Yeh ticking ki value update karta hai.
                ticking = false;
            // Yeh pichla function ya code block band karta hai.
            });
            // Yeh ticking ki value update karta hai.
            ticking = true;
        // Yeh pichla function ya code block band karta hai.
        }
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Yeh optional smooth-scroll helper hai jo public Animations object mein share hota hai.
// Aam navigation ka click pehle se initNavigation function sambhalta hai.
// Yeh initSmoothScroll naam ka function shuru karta hai; function ek kaam karne wala code ka hissa hota hai.
function initSmoothScroll() {
    // Yeh sections mein page se dhoonda gaya element rakhta hai.
    const sections = document.querySelectorAll('section[id]');
    // Yeh navLinks mein page se dhoonda gaya element rakhta hai.
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    navLinks.forEach(link => {
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        link.addEventListener('click', (e) => {
            // Yeh e.preventDefault naam ka kaam chalata hai.
            e.preventDefault();
            // Yeh targetId naam ki jagah banata hai aur us mein value rakhta hai.
            const targetId = link.getAttribute('href');
            // Yeh targetSection mein page se dhoonda gaya element rakhta hai.
            const targetSection = document.querySelector(targetId);
            
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (targetSection) {
                // Yeh headerHeight mein page se dhoonda gaya element rakhta hai.
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                // Yeh targetPosition naam ki jagah banata hai aur us mein value rakhta hai.
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (typeof anime !== 'undefined') {
                    // Yeh anime naam ka kaam chalata hai.
                    anime({
                        // Yeh object mein targets ki value batata hai.
                        targets: window,
                        // Yeh object mein scrollTop ki value batata hai.
                        scrollTop: targetPosition,
                        // Yeh object mein duration ki value batata hai.
                        duration: 800,
                        // Yeh object mein easing ki value batata hai.
                        easing: 'easeInOutQuad'
                    // Yeh pichla function ya code block band karta hai.
                    });
    // Pehli condition ghalat ho to yeh doosra raasta shuru karta hai.
                } else {
                    // Yeh window.scrollTo naam ka kaam chalata hai.
                    window.scrollTo({
                        // Yeh object mein top ki value batata hai.
                        top: targetPosition,
                        // Yeh object mein behavior ki value batata hai.
                        behavior: 'smooth'
                    // Yeh pichla function ya code block band karta hai.
                    });
                // Yeh pichla function ya code block band karta hai.
                }
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    });
    
    // Yeh currentSection naam ki jagah banata hai aur us mein value rakhta hai.
    let currentSection = '';
    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
    window.addEventListener('scroll', () => {
        // Yeh scrollPos naam ki jagah banata hai aur us mein value rakhta hai.
        const scrollPos = window.scrollY + 150;
        
        // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
        sections.forEach(section => {
            // Yeh sectionTop naam ki jagah banata hai aur us mein value rakhta hai.
            const sectionTop = section.offsetTop;
            // Yeh sectionHeight naam ki jagah banata hai aur us mein value rakhta hai.
            const sectionHeight = section.offsetHeight;
            // Yeh sectionId naam ki jagah banata hai aur us mein value rakhta hai.
            const sectionId = section.getAttribute('id');
            
            // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                if (currentSection !== sectionId) {
                    // Yeh currentSection ki value update karta hai.
                    currentSection = sectionId;
                    // Yeh event ya list ke liye chalne wala chhota function shuru karta hai.
                    navLinks.forEach(link => {
                        // Yeh link.classList.remove naam ka kaam chalata hai.
                        link.classList.remove('active');
                        // Yeh condition check karke faisla karta hai ke agla code chalana hai ya nahi.
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            // Yeh link.classList.add naam ka kaam chalata hai.
                            link.classList.add('active');
                        // Yeh pichla function ya code block band karta hai.
                        }
                    // Yeh pichla function ya code block band karta hai.
                    });
                // Yeh pichla function ya code block band karta hai.
                }
            // Yeh pichla function ya code block band karta hai.
            }
        // Yeh pichla function ya code block band karta hai.
        });
    // Yeh pichla function ya code block band karta hai.
    });
// Yeh pichla function ya code block band karta hai.
}

// Yeh window.Animations ki value update karta hai.
window.Animations = {
    // In helpers ko browser console ya doosre page scripts se istemal kiya ja sakta hai.
    // Yeh is function ke aglay step ka code hai.
    initParallax,
    // Yeh is function ke aglay step ka code hai.
    initSmoothScroll
// Yeh pichla function ya code block band karta hai.
};
