// ===========================
// SMOOTH SCROLL NAVIGATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {

    // Handle all anchor links with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // "ENTER SYSTEM" button scrolls to dashboard
    const enterBtn = document.getElementById('enter-system-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ===========================
    // SECTION FADE-IN ON SCROLL
    // ===========================
    const fadeElements = document.querySelectorAll('.section-fade');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));

    // ===========================
    // SCROLL-REVEAL ANIMATIONS
    // ===========================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    // Tag all elements with animation classes FIRST (sets them to hidden)
    // Project cards — staggered slide up
    document.querySelectorAll('.pixel-card').forEach((card, i) => {
        card.classList.add('scroll-reveal', 'reveal-up');
        card.style.setProperty('--reveal-delay', `${i * 0.12}s`);
    });

    // Skills section panels (neon borders) — slide from sides
    const skillPanels = document.querySelectorAll('.neon-border-pink, .neon-border-cyan');
    skillPanels.forEach((panel, i) => {
        panel.classList.add('scroll-reveal');
        panel.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
        panel.style.setProperty('--reveal-delay', `${i * 0.1}s`);
    });

    // LED skill bars — scale in with stagger
    document.querySelectorAll('.led-segment').forEach((seg, i) => {
        seg.classList.add('scroll-reveal', 'reveal-scale');
        seg.style.setProperty('--reveal-delay', `${0.3 + i * 0.02}s`);
    });

    // Mission log entries — fade up staggered
    document.querySelectorAll('.neon-border-cyan .border-t').forEach((entry, i) => {
        entry.classList.add('scroll-reveal', 'reveal-up');
        entry.style.setProperty('--reveal-delay', `${i * 0.15}s`);
    });

    // Header — slide up on load
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('scroll-reveal', 'reveal-up');
        header.style.setProperty('--reveal-delay', '0.1s');
    }

    // Contact terminal — glow in
    const terminal = document.querySelector('.terminal-border');
    if (terminal) {
        terminal.classList.add('scroll-reveal', 'reveal-glow');
    }

    // Wait TWO frames so the browser paints the hidden state,
    // THEN start observing — this ensures elements already in
    // the viewport still animate instead of snapping visible.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.scroll-reveal').forEach(el => {
                revealObserver.observe(el);
            });
        });
    });

    // ===========================
    // ACTIVE NAV HIGHLIGHTING
    // ===========================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('bg-primary/20', 'border-primary', 'text-primary');
                    link.classList.add('bg-white/5', 'border-white/10', 'text-white/40');

                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('bg-primary/20', 'border-primary', 'text-primary');
                        link.classList.remove('bg-white/5', 'border-white/10', 'text-white/40');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => navObserver.observe(section));

    // ===========================
    // TYPEWRITER EFFECT (Hero subtitle)
    // ===========================
    const typewriterEl = document.getElementById('typewriter-text');
    if (typewriterEl) {
        const text = typewriterEl.textContent;
        typewriterEl.textContent = '';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                typewriterEl.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 40);
            }
        }
        setTimeout(typeChar, 800);
    }

    // ===========================
    // EMAILJS CONTACT FORM
    // ===========================
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('74UTwMFilKvu2q1wj');
    }

    // Rate limit: one email per address per 24 hours
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    function getSentEmails() {
        try {
            return JSON.parse(localStorage.getItem('sent_emails') || '[]');
        } catch { return []; }
    }

    function markEmailSent(email) {
        const sent = getSentEmails().filter(e => Date.now() - e.ts < ONE_DAY_MS);
        sent.push({ email: email.toLowerCase().trim(), ts: Date.now() });
        localStorage.setItem('sent_emails', JSON.stringify(sent));
    }

    function hasAlreadySent(email) {
        const key = email.toLowerCase().trim();
        return getSentEmails().some(e => e.email === key && Date.now() - e.ts < ONE_DAY_MS);
    }

    function getTimeRemaining(email) {
        const key = email.toLowerCase().trim();
        const entry = getSentEmails().find(e => e.email === key && Date.now() - e.ts < ONE_DAY_MS);
        if (!entry) return '';
        const remaining = ONE_DAY_MS - (Date.now() - entry.ts);
        const hrs = Math.floor(remaining / 3600000);
        const mins = Math.ceil((remaining % 3600000) / 60000);
        return hrs > 0 ? `${hrs}h ${mins}m remaining` : `${mins}m remaining`;
    }

    function showRateLimitDialog(email) {
        const dialog = document.getElementById('rate-limit-dialog');
        const remainingEl = document.getElementById('cooldown-remaining');
        if (dialog) {
            if (remainingEl) remainingEl.textContent = '> ' + getTimeRemaining(email);
            dialog.classList.remove('hidden');
        }
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const emailInput = contactForm.querySelector('#email');
            const emailValue = emailInput ? emailInput.value : '';

            // Check for duplicate email — show dialog
            if (hasAlreadySent(emailValue)) {
                showRateLimitDialog(emailValue);
                return;
            }

            // Show sending state
            btn.disabled = true;
            btn.innerHTML = `
                <span class="relative z-10 flex items-center justify-center gap-2">
                    TRANSMITTING...
                    <span class="material-icons text-base animate-spin">sync</span>
                </span>
            `;

            emailjs.sendForm('service_7n2dl0m', 'template_jpp2odd', contactForm)
                .then(() => {
                    // Success — mark this email so it can't send again
                    markEmailSent(emailValue);
                    btn.innerHTML = `
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            SIGNAL_SENT
                            <span class="material-icons text-base">check_circle</span>
                        </span>
                    `;
                    btn.classList.remove('bg-primary');
                    btn.classList.add('bg-green-500');

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.remove('bg-green-500');
                        btn.classList.add('bg-primary');
                        btn.disabled = false;
                        contactForm.reset();
                    }, 3000);
                })
                .catch((error) => {
                    // Error
                    console.error('EmailJS error:', error);
                    btn.innerHTML = `
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            TX_FAILED
                            <span class="material-icons text-base">error</span>
                        </span>
                    `;
                    btn.classList.remove('bg-primary');
                    btn.classList.add('bg-red-500');

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.remove('bg-red-500');
                        btn.classList.add('bg-primary');
                        btn.disabled = false;
                    }, 3000);
                });
        });
    }
});
