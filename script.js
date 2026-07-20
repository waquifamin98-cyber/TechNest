/* ==========================================
   TechNest — Landing Page Scripts
   ========================================== */

(function () {
    'use strict';

    /* ---------- Sticky Navbar ---------- */
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* ---------- Mobile Hamburger ---------- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', function () {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    /* ---------- Hero Particles ---------- */
    var particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (var i = 0; i < 20; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDuration = (6 + Math.random() * 8) + 's';
            p.style.animationDelay = (Math.random() * 6) + 's';
            p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
            particlesContainer.appendChild(p);
        }
    }

    /* ---------- Countdown Timers ---------- */
    function updateCountdown(timerEl) {
        var endDate = new Date(timerEl.getAttribute('data-end')).getTime();
        var now = Date.now();
        var diff = endDate - now;

        if (diff <= 0) {
            timerEl.querySelectorAll('.deal-card__timer-num').forEach(function (el) {
                el.textContent = '00';
            });
            return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((diff % (1000 * 60)) / 1000);

        function pad(n) { return n < 10 ? '0' + n : n; }

        var daysEl = timerEl.querySelector('[data-unit="days"]');
        var hoursEl = timerEl.querySelector('[data-unit="hours"]');
        var minsEl = timerEl.querySelector('[data-unit="mins"]');
        var secsEl = timerEl.querySelector('[data-unit="secs"]');

        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(hours);
        if (minsEl) minsEl.textContent = pad(mins);
        if (secsEl) secsEl.textContent = pad(secs);
    }

    function initCountdowns() {
        var timers = document.querySelectorAll('.deal-card__timer');
        timers.forEach(function (timer) {
            updateCountdown(timer);
        });
    }

    initCountdowns();
    setInterval(initCountdowns, 1000);

    /* ---------- Reviews Carousel ---------- */
    var track = document.querySelector('.reviews__track');
    var prevBtn = document.querySelector('.reviews__btn--prev');
    var nextBtn = document.querySelector('.reviews__btn--next');

    if (track && prevBtn && nextBtn) {
        var currentIndex = 0;
        var cards = track.querySelectorAll('.review-card');
        var totalCards = cards.length;

        function getVisibleCards() {
            var w = window.innerWidth;
            if (w <= 768) return 1;
            if (w <= 1024) return 3;
            return 4;
        }

        function slideCarousel() {
            var visible = getVisibleCards();
            var maxIndex = totalCards - visible;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            var gap = 24;
            var cardWidth = cards[0].getBoundingClientRect().width;
            var offset = currentIndex * (cardWidth + gap);
            track.style.transform = 'translateX(-' + offset + 'px)';
        }

        nextBtn.addEventListener('click', function () {
            var visible = getVisibleCards();
            if (currentIndex < totalCards - visible) {
                currentIndex++;
                slideCarousel();
            }
        });

        prevBtn.addEventListener('click', function () {
            if (currentIndex > 0) {
                currentIndex--;
                slideCarousel();
            }
        });

        window.addEventListener('resize', slideCarousel);
    }

    /* ---------- Wishlist Toggle (handled by auth.js TN.toggleWishlist) ---------- */

    /* ---------- Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navHeight = document.getElementById('navbar').offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                window.scrollTo({ top: top, behavior: 'smooth' });
                history.pushState(null, '', href);
            }
        });
    });

    /* ---------- Active nav link on scroll ---------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar__link');

    function updateActiveNav() {
        var scrollPos = window.scrollY + 120;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('navbar__link--active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('navbar__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ---------- Intersection Observer for fade-in ---------- */
    var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    var fadeElements = document.querySelectorAll(
        '.product-card, .deal-card, .category-card, .category-page-card, .why__card, .review-card, .trust-bar__item, .stat-card, .about-mission__card, .contact-info-card, .contact-quick-link, .admin-stat-card, .faq-item, .profile-settings-card'
    );
    fadeElements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    /* ---------- Product Tabs ---------- */
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tabId = btn.getAttribute('data-tab');
            btn.closest('.container').querySelectorAll('.tab-btn').forEach(function (b) {
                b.classList.remove('tab-btn--active');
            });
            btn.classList.add('tab-btn--active');
            document.querySelectorAll('.tab-content').forEach(function (tc) {
                tc.classList.remove('tab-content--active');
            });
            var target = document.getElementById('tab-' + tabId);
            if (target) target.classList.add('tab-content--active');
        });
    });

    /* ---------- Quantity Selector ---------- */
    var qtyInput = document.getElementById('qtyInput');
    var qtyMinus = document.getElementById('qtyMinus');
    var qtyPlus = document.getElementById('qtyPlus');

    if (qtyInput && qtyMinus && qtyPlus) {
        qtyMinus.addEventListener('click', function () {
            var val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        });
        qtyPlus.addEventListener('click', function () {
            var val = parseInt(qtyInput.value) || 1;
            if (val < 10) qtyInput.value = val + 1;
        });
    }

    /* ---------- Product Thumbnail Gallery ---------- */
    var mainImage = document.querySelector('.product-detail__main-image img');
    var thumbs = document.querySelectorAll('.product-detail__thumb');
    if (mainImage && thumbs.length) {
        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                thumbs.forEach(function (t) { t.classList.remove('product-detail__thumb--active'); });
                thumb.classList.add('product-detail__thumb--active');
                var thumbImg = thumb.querySelector('img');
                if (thumbImg) {
                    mainImage.src = thumbImg.src;
                    mainImage.alt = thumbImg.alt;
                }
            });
        });
    }

    /* ---------- FAQ Accordion ---------- */
    document.querySelectorAll('.faq-item__question').forEach(function (q) {
        q.addEventListener('click', function () {
            var item = q.closest('.faq-item');
            var answer = item.querySelector('.faq-item__answer');
            var isOpen = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(function (fi) {
                fi.classList.remove('active');
                var a = fi.querySelector('.faq-item__answer');
                if (a) a.style.maxHeight = null;
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ---------- Contact Form Handler ---------- */
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = contactForm.querySelector('.btn');
            var origText = btn.textContent;
            btn.textContent = 'Message Sent!';
            btn.style.background = '#22c55e';
            btn.style.borderColor = '#22c55e';
            setTimeout(function () {
                btn.textContent = origText;
                btn.style.background = '';
                btn.style.borderColor = '';
                contactForm.reset();
            }, 3000);
        });
    }

    /* ---------- Newsletter Form Handler ---------- */
    document.querySelectorAll('.footer__form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('.btn');
            var origText = btn.textContent;
            btn.textContent = 'Subscribed!';
            setTimeout(function () {
                btn.textContent = origText;
                form.reset();
            }, 2000);
        });
    });

})();
