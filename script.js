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
    loadTestimonials();
   
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
 * Contact Form — envío directo via EmailJS
 * Configurá tus IDs de EmailJS abajo.
 * Creá cuenta gratis en https://www.emailjs.com
 * Service ID, Template ID y Public Key se obtienen en el dashboard.
 */
const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';   // ← reemplazá
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';  // ← reemplazá
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';   // ← reemplazá

function initContactForm() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Enviando...';
        btn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Si EmailJS está configurado, usarlo
        if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'TU_SERVICE_ID') {
            try {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    from_name:    data.name,
                    from_email:   data.email,
                    subject:      data.subject,
                    message:      data.message,
                    to_email:     'editorialhanra@gmail.com',
                });
                btnText.textContent = '¡Mensaje enviado!';
                form.reset();
                setTimeout(() => {
                    btnText.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            } catch (err) {
                console.error('EmailJS error:', err);
                btnText.textContent = 'Error al enviar. Intentá de nuevo.';
                btn.disabled = false;
                setTimeout(() => { btnText.textContent = originalText; }, 3000);
            }
        } else {
            // Fallback: mailto (hasta que se configure EmailJS)
            const subject = encodeURIComponent(`[HAN-RA Web] ${data.subject}`);
            const body = encodeURIComponent(
                `Nombre: ${data.name}\nEmail: ${data.email}\nAsunto: ${data.subject}\n\nMensaje:\n${data.message}`
            );
            window.location.href = `mailto:editorialhanra@gmail.com?subject=${subject}&body=${body}`;
            btnText.textContent = originalText;
            btn.disabled = false;
        }
    });
}

/* ─────────────────────────────────────────
   SISTEMA DE TESTIMONIOS CON CÓDIGO DE AUTOR
   ───────────────────────────────────────── */

// Códigos válidos de autores: { código: { nombre, libro } }
// Podés agregar más acá cuando incorpores nuevos autores.
const AUTHOR_CODES = {
    'HANRA-001': { nombre: 'Monelli Silvana A.', libro: 'HAN Una argentina con alma y corazón coreano' },
    // Agregá más códigos acá:
    // 'HANRA-002': { nombre: 'Nombre Autor', libro: 'Título del libro' },
};

const STORAGE_KEY = 'hanra_testimonios';

let verifiedAuthor = null;

function loadTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (stored.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color: var(--text-muted, #aaa); padding: 2rem 0;">Todavía no hay testimonios. ¡Sé el primero en compartir tu experiencia!</p>';
        return;
    }
    grid.innerHTML = stored.map(t => `
        <article class="testimonial">
            <div class="testimonial-content">
                <svg class="testimonial-quote" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <blockquote>${t.texto}</blockquote>
            </div>
            <footer class="testimonial-author">
                <div class="testimonial-avatar">${t.nombre.charAt(0)}</div>
                <div class="testimonial-info">
                    <cite>${t.nombre}</cite>
                    <span>Autora/Autor de "${t.libro}"</span>
                </div>
            </footer>
        </article>
    `).join('');
}

function verifyAuthorCode() {
    const code = document.getElementById('authorCode').value.trim().toUpperCase();
    const author = AUTHOR_CODES[code];
    const errorEl = document.getElementById('codeError');

    if (author) {
        verifiedAuthor = author;
        errorEl.style.display = 'none';
        document.getElementById('testimonyStep1').style.display = 'none';
        document.getElementById('testimonyStep2').style.display = 'block';
        document.getElementById('authorWelcome').textContent =
            `¡Bienvenida/o, ${author.nombre}! Escribí tu experiencia con HAN-RA.`;
    } else {
        errorEl.style.display = 'block';
    }
}

function submitTestimony() {
    const texto = document.getElementById('testimonyText').value.trim();
    const successEl = document.getElementById('testimonySuccess');
    if (!texto || !verifiedAuthor) return;

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    stored.unshift({
        nombre: verifiedAuthor.nombre,
        libro:  verifiedAuthor.libro,
        texto,
        fecha:  new Date().toLocaleDateString('es-AR'),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    document.getElementById('testimonyText').value = '';
    successEl.style.display = 'block';
    loadTestimonials();

    setTimeout(() => {
        successEl.style.display = 'none';
        document.getElementById('testimonyStep2').style.display = 'none';
        document.getElementById('testimonyStep1').style.display = 'block';
        document.getElementById('authorCode').value = '';
        verifiedAuthor = null;
    }, 3000);
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
