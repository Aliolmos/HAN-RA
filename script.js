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
    initBookModal();
    initShippingForm();   // ← agregado
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
        }, 1200);
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

        // Ignorar el botón Comprar del modal
        if (anchor.id === 'bookModalBuyBtn') return;

        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorar enlaces vacíos
            if (href === '#') return;

            const target = document.querySelector(href);

            if (!target) return;

            e.preventDefault();

            const headerHeight = 80;
            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
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
 * Book Purchase Modal (Mercado Pago)
 */
function initBookModal() {
    const modal      = document.getElementById('bookModal');
    const overlay    = document.getElementById('bookModalOverlay');
    const closeBtn   = document.getElementById('bookModalClose');
    const cards      = document.querySelectorAll('.book-card');
    const paidBtn    = document.getElementById('bookModalPaidBtn');
    const shipWrap   = document.getElementById('shippingFormWrap');

    if (!modal || !cards.length) return;

    const els = {
        img:      document.getElementById('bookModalImg'),
        category: document.getElementById('bookModalCategory'),
        title:    document.getElementById('bookModalTitle'),
        author:   document.getElementById('bookModalAuthor'),
        desc:     document.getElementById('bookModalDesc'),
        pages:    document.getElementById('bookModalPages'),
        year:     document.getElementById('bookModalYear'),
        price:    document.getElementById('bookModalPrice'),
        buyBtn:   document.getElementById('bookModalBuyBtn')
    };

    // Datos del libro actualmente abierto en el modal (usados al enviar el envío)
    window.currentBookData = null;

    function openModal(card) {
        const data = card.dataset;

        els.img.src        = data.bookCover || '';
        els.img.alt         = data.bookTitle || '';
        els.category.textContent = card.dataset.category || '';
        els.title.textContent    = data.bookTitle || '';
        els.author.textContent   = data.bookAuthor || '';
        els.desc.textContent     = data.bookDesc || '';
        els.pages.textContent    = data.bookPages || '';
        els.year.textContent     = data.bookYear || '';
        els.price.textContent    = data.bookPrice || '';
        els.buyBtn.href          = data.bookLink || '#';

        window.currentBookData = {
            titulo:  data.bookTitle  || '',
            autor:   data.bookAuthor || '',
            precio:  data.bookPrice  || '',
            cantidad: 1,
            link:    data.bookLink   || ''
        };

        // Reset del formulario de envío cada vez que se abre un libro nuevo
        resetShippingForm();

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.filter-btn')) return;
            openModal(card);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Mostrar el formulario de envío al presionar "Ya realicé el pago"
    if (paidBtn && shipWrap) {
        paidBtn.addEventListener('click', () => {
            shipWrap.classList.add('open');
            paidBtn.style.display = 'none';
            setTimeout(() => {
                shipWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 200);
        });
    }

    // Expuesto para poder resetear desde submitShippingForm()
    window.closeBookModal = closeModal;
}

function resetShippingForm() {
    const shipWrap  = document.getElementById('shippingFormWrap');
    const paidBtn   = document.getElementById('bookModalPaidBtn');
    const form      = document.getElementById('shippingForm');
    const errorEl   = document.getElementById('shippingError');
    const successEl = document.getElementById('shippingSuccess');

    if (shipWrap) shipWrap.classList.remove('open');
    if (paidBtn) paidBtn.style.display = 'block';
    if (form) {
        form.reset();
        form.style.display = 'block';
    }
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';

    document.querySelectorAll('.shipping-group input, .shipping-group textarea')
        .forEach(el => el.classList.remove('invalid'));
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
// Valida cualquier código HANRA-001 a HANRA-1000
function isValidCode(code) {
    const match = code.match(/^HANRA-(\d{3,4})$/);
    if (!match) return false;
    const num = parseInt(match[1]);
    return num >= 1 && num <= 1000;
}

let verifiedAuthor = null;

async function loadTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:2rem;">Cargando testimonios...</p>';

    try {
        const testimonios = await window.cargarTestimonios();
        if (!testimonios || testimonios.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:2rem;">Todavía no hay testimonios.</p>';
            return;
        }
        grid.innerHTML = testimonios.map(t => `
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
    } catch(e) {
        console.error(e);
        grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:2rem;">Error al cargar testimonios.</p>';
    }
}

function verifyAuthorCode() {
    const code = document.getElementById('authorCode').value.trim().toUpperCase();
    const errorEl = document.getElementById('codeError');

    if (isValidCode(code)) {
        verifiedAuthor = { codigo: code };
        errorEl.style.display = 'none';
        document.getElementById('testimonyStep1').style.display = 'none';
        document.getElementById('testimonyStep2').style.display = 'block';
    } else {
        errorEl.style.display = 'block';
    }
}

async function submitTestimony() {
    const nombre    = document.getElementById('authorName').value.trim();
    const libro     = document.getElementById('authorBook').value.trim();
    const texto     = document.getElementById('testimonyText').value.trim();
    const successEl = document.getElementById('testimonySuccess');
    const btn       = document.querySelector('#testimonyStep2 .btn-primary');

    if (!nombre || !libro || !texto || !verifiedAuthor) return;

    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Publicando...';

    try {
        await window.guardarTestimonio({ nombre, libro, texto });

        document.getElementById('authorName').value    = '';
        document.getElementById('authorBook').value    = '';
        document.getElementById('testimonyText').value = '';
        successEl.style.display = 'block';
        loadTestimonials();

        setTimeout(() => {
            successEl.style.display = 'none';
            document.getElementById('testimonyStep2').style.display = 'none';
            document.getElementById('testimonyStep1').style.display = 'block';
            document.getElementById('authorCode').value = '';
            verifiedAuthor = null;
            btn.disabled = false;
            btn.querySelector('.btn-text').textContent = 'Publicar testimonio';
        }, 3000);
    } catch(e) {
        console.error(e);
        btn.querySelector('.btn-text').textContent = 'Error, intentá de nuevo';
        btn.disabled = false;
    }
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
/**
 * Pétalos cayendo con efecto de ceniza dorada delicada
 */
(function initPetals() {
    const canvas = document.getElementById('petalsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W;
        canvas.height = H;
    });

    const PETAL_COUNT  = 18;
    const petals       = [];
    const ashParticles = [];

    // La disolución empieza en el 65% de la pantalla
    const DISSOLVE_START = 0.65;

    // Detecta el Y (absoluto en página) donde empieza la sección clara
    let lightSectionY = Infinity;
    function updateLightSectionY() {
        const s = document.querySelector('.about');
        if (s) lightSectionY = s.getBoundingClientRect().top + window.scrollY;
    }
    updateLightSectionY();
    window.addEventListener('resize', updateLightSectionY);
    window.addEventListener('scroll', updateLightSectionY);

    // true si una partícula (coordenada Y en pantalla) está sobre fondo claro
    function isOverLight(screenY) {
        return (screenY + window.scrollY) >= lightSectionY;
    }

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    // ── Pétalo ──
    function drawPetal(x, y, size, angle, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size*0.5,-size*0.5, size,-size*0.2, size*0.8, size*0.4);
        ctx.bezierCurveTo(size*0.6, size*0.9, size*0.1, size*0.7, 0, 0);

        const grad = ctx.createRadialGradient(size*0.3, 0, 0, size*0.3, 0, size);
        grad.addColorStop(0,   'rgba(255, 192, 203, 1)');
        grad.addColorStop(0.5, 'rgba(255, 160, 180, 0.85)');
        grad.addColorStop(1,   'rgba(220, 120, 150, 0.4)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }

    // ── Partícula de ceniza dorada — color según fondo ──
    function drawAsh(a) {
        ctx.save();
        ctx.globalAlpha = a.opacity;
        ctx.translate(a.x, a.y);

        const onLight = isOverLight(a.y);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, a.r);

        if (onLight) {
            // Sobre fondo claro: cobre/ámbar oscuro para contrastar
            grad.addColorStop(0,   'rgba(160,  90,  10, 1)');
            grad.addColorStop(0.5, 'rgba(130,  70,   5, 0.6)');
            grad.addColorStop(1,   'rgba(100,  50,   0, 0)');
        } else {
            // Sobre fondo oscuro: dorado luminoso
            grad.addColorStop(0,   'rgba(255, 235, 150, 1)');
            grad.addColorStop(0.5, 'rgba(220, 180,  60, 0.5)');
            grad.addColorStop(1,   'rgba(200, 150,  20, 0)');
        }

        ctx.beginPath();
        ctx.arc(0, 0, a.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }

    function spawnAsh(x, y, size, count) {
        for (let i = 0; i < count; i++) {
            ashParticles.push({
                x:       x + randomBetween(-size * 0.8, size * 0.8),
                y:       y + randomBetween(-size * 0.5, size * 0.3),
                
            });
        }
    }

    function createPetal() {
        const base = randomBetween(0.5, 0.85);
        return {
            x:           randomBetween(0, W),
            y:           randomBetween(-200, -10),
            size:        randomBetween(10, 20),
            speedY:      randomBetween(0.4, 1.1),
            speedX:      randomBetween(-0.4, 0.4),
            angle:       randomBetween(0, Math.PI * 2),
            spin:        randomBetween(-0.012, 0.012),
            sway:        randomBetween(0.3, 0.9),
            swaySpeed:   randomBetween(0.005, 0.015),
            swayTime:    randomBetween(0, Math.PI * 2),
            baseOpacity: base,
            ashSpawned:  false,
        };
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
        const p = createPetal();
        p.y = randomBetween(-H, H);
        petals.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);

        // ── Pétalos ──
        petals.forEach(p => {
            p.swayTime += p.swaySpeed;
            p.x += p.speedX + Math.sin(p.swayTime) * p.sway;
            p.y += p.speedY;
            p.angle += p.spin;

            const t = Math.max(0, Math.min(1,
                (p.y / H - DISSOLVE_START) / (1 - DISSOLVE_START)
            ));

            const currentOpacity = p.baseOpacity * (1 - t);

            // Ceniza progresiva — cuantas más avanza, más suelta
            if (t > 0.05 && t < 0.99 && Math.random() < t * 0.5) {
                spawnAsh(p.x, p.y, p.size, Math.random() < 0.4 ? 2 : 1);
            }
            // Explosión visible al inicio de la disolución
            if (t > 0.08 && !p.ashSpawned) {
                spawnAsh(p.x, p.y, p.size, 14);
                p.ashSpawned = true;
            }

            if (currentOpacity > 0.01) {
                drawPetal(p.x, p.y, p.size, p.angle, currentOpacity);
            }

            if (p.y > H + 10 || p.x < -60 || p.x > W + 60) {
                Object.assign(p, createPetal());
                p.y = -20;
            }
        });

        // ── Ceniza dorada ──
        for (let i = ashParticles.length - 1; i >= 0; i--) {
            const a = ashParticles[i];
            a.vy      += a.gravity;
            a.x       += a.vx;
            a.y       += a.vy;
            a.opacity -= a.fade;

            if (a.opacity > 0) {
                drawAsh(a);
            } else {
                ashParticles.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
/* ─────────────────────────────────────────
   ENVÍO DE DATOS DE ENVÍO (post-pago) — EmailJS
   ───────────────────────────────────────── */
function initShippingForm() {
    const form = document.getElementById('shippingForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fields = {
            shipName:     document.getElementById('shipName'),
            shipEmail:    document.getElementById('shipEmail'),
            shipPhone:    document.getElementById('shipPhone'),
            shipProvince: document.getElementById('shipProvince'),
            shipCity:     document.getElementById('shipCity'),
            shipZip:      document.getElementById('shipZip'),
            shipAddress:  document.getElementById('shipAddress'),
        };
        const shipApt   = document.getElementById('shipApt');
        const shipNotes = document.getElementById('shipNotes');
        const shipConfirm = document.getElementById('shipConfirm');
        const errorEl   = document.getElementById('shippingError');
        const successEl = document.getElementById('shippingSuccess');
        const submitBtn = document.getElementById('shippingSubmitBtn');
        const btnText   = submitBtn.querySelector('.btn-text');

        // Reset visual de errores
        errorEl.style.display = 'none';
        Object.values(fields).forEach(el => el.classList.remove('invalid'));

        // Validación
        let firstInvalid = null;
        Object.values(fields).forEach(el => {
            if (!el.value.trim()) {
                el.classList.add('invalid');
                if (!firstInvalid) firstInvalid = el;
            }
        });

        if (fields.shipEmail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.shipEmail.value.trim())) {
            fields.shipEmail.classList.add('invalid');
            if (!firstInvalid) firstInvalid = fields.shipEmail;
        }

        if (!shipConfirm.checked) {
            if (!firstInvalid) firstInvalid = shipConfirm;
        }

        if (firstInvalid) {
            errorEl.textContent = 'Por favor completá todos los campos obligatorios y confirmá tus datos.';
            errorEl.style.display = 'block';
            firstInvalid.focus();
            return;
        }

        if (!window.currentBookData) {
            errorEl.textContent = 'No se encontró información del libro. Cerrá el modal y volvé a intentarlo.';
            errorEl.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';

        const book = window.currentBookData;

        const mensaje =
`NUEVO PEDIDO

==============================
LIBRO

Título: ${book.titulo}
Autor: ${book.autor}
Precio: ${book.precio}
Cantidad: ${book.cantidad}
${book.link ? 'Link del libro: ' + book.link : ''}

==============================
CLIENTE

Nombre: ${fields.shipName.value.trim()}
Correo: ${fields.shipEmail.value.trim()}
Teléfono: ${fields.shipPhone.value.trim()}
Provincia: ${fields.shipProvince.value.trim()}
Ciudad: ${fields.shipCity.value.trim()}
Código Postal: ${fields.shipZip.value.trim()}
Dirección: ${fields.shipAddress.value.trim()}
Departamento: ${shipApt.value.trim() || '-'}
Observaciones: ${shipNotes.value.trim() || '-'}

==============================
Estado informado por el cliente:
✔ El comprador indicó que ya realizó el pago en Mercado Pago.

IMPORTANTE:
Verificar manualmente el pago en Mercado Pago antes de realizar el envío.`;

        try {
            if (typeof emailjs === 'undefined' || EMAILJS_SERVICE_ID === 'TU_SERVICE_ID') {
                throw new Error('EmailJS no está configurado todavía.');
            }

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name:  fields.shipName.value.trim(),
                from_email: fields.shipEmail.value.trim(),
                subject:    `Nuevo pedido - ${book.titulo}`,
                message:    mensaje,
                to_email:   'editorialhanra@gmail.com',
            });

            form.style.display = 'none';
            successEl.style.display = 'block';

            setTimeout(() => {
                if (window.closeBookModal) window.closeBookModal();
                resetShippingForm();
            }, 4000);

        } catch (err) {
            console.error('Error al enviar datos de envío:', err);
            errorEl.textContent = 'Ocurrió un error al enviar tus datos. Por favor, intentá de nuevo.';
            errorEl.style.display = 'block';
            submitBtn.disabled = false;
            btnText.textContent = 'Enviar datos de envío';
        }
    });
}
