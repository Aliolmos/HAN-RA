/**
 * HAN-RA Editorial - Enhanced JavaScript v2
 * Pure Vanilla JS - No dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initRevealAnimations();
    initCounterAnimation();
    initBookFilters();
    initContactForm();
   
});

/**
 * Loading Screen
 */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            animateHero();
        }, 1800);
    });
    
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            loader.classList.add('hidden');
            animateHero();
        }, 1800);
    }
}



/**
 * Animate Hero on Load
 */
function animateHero() {
    const elements = document.querySelectorAll('.hero [data-reveal]');
    elements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('revealed');
        }, i * 100);
    });
}

/**
 * Custom Cursor
 */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower || window.innerWidth < 1024) return;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    // Hover states
    const hoverElements = document.querySelectorAll('a, button, [data-magnetic]');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
    function animate() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower with delay
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animate);
    }
    animate();}

/**
 * Header Scroll Effect
 */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Active nav link on scroll
    updateActiveNav();
}

/**
 * Update Active Navigation
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

function verMas(){
    oculto = document.getElementById('monelli')
    oculto.classList.replace('oculto', 'visto')
    
    button = document.getElementById('verMas')
    button.remove()
}
/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Reveal Animations
 */
function initRevealAnimations() {
    const elements = document.querySelectorAll('[data-reveal]:not(.hero [data-reveal])');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateNumber(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateNumber(element, target) {
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * eased);
        
        element.textContent = current + (target > 10 ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Book Filters
 */
function initBookFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.book-card');
    
    if (!buttons.length || !cards.length) return;
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            cards.forEach((card, i) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;
                
                if (show) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.classList.add('hidden'), 300);
                }
            });
        });
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Create mailto link
        const subject = encodeURIComponent(`[HAN-RA Web] ${data.subject}`);
        const body = encodeURIComponent(
            `Nombre: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Asunto: ${data.subject}\n\n` +
            `Mensaje:\n${data.message}`
        );
        
        window.location.href = `mailto:contacto@han-ra.com?subject=${subject}&body=${body}`;
        
        // Button feedback
        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        btnText.textContent = 'Abriendo correo...';
        btn.disabled = true;
        
        setTimeout(() => {
            btnText.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    });
}


/**
//  * Parallax Effect (Optional - for images)
//  */
// function initParallax() {
//     const elements = document.querySelectorAll('[data-parallax]');
//     if (!elements.length || window.innerWidth < 768) return;
    
//     window.addEventListener('scroll', () => {
//         const scrollY = window.pageYOffset;
        
//         elements.forEach(el => {
//             const speed = parseFloat(el.dataset.parallax) || 0.1;
//             const rect = el.getBoundingClientRect();
//             const inView = rect.top < window.innerHeight && rect.bottom > 0;
            
//             if (inView) {
//                 const offset = (scrollY - el.offsetTop) * speed;
//                 el.style.transform = `translateY(${offset}px)`;
//             }
//         });
//     });
// }

// Initialize parallax if needed
// initParallax();
