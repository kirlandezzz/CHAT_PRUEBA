/* =========================================================
   LIMPILLA — script.js
   - Año dinámico, menú móvil, lightbox
   - Reveal on scroll
   - Escena 3D Three.js: tunera rotando en el hero
   ========================================================= */

(() => {
    'use strict';

    /* ---------- Año dinámico ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Menú móvil ---------- */
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                menu.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const revealTargets = document.querySelectorAll(
        '.section .container > h2, ' +
        '.section .container > .lead, ' +
        '.section .container > .eyebrow, ' +
        '.problema-grid__item, ' +
        '.planta, ' +
        '.metodo__pasos li, ' +
        '.metodo__media, ' +
        '.equipo__foto, ' +
        '.autores__list li, ' +
        '.material, ' +
        '.cta h2, .cta p'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
        revealTargets.forEach(el => io.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox?.querySelector('.lightbox__img');
    const lightboxCap = lightbox?.querySelector('.lightbox__caption');
    const lightboxClose = lightbox?.querySelector('.lightbox__close');

    const openLightbox = (src, caption) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = caption || '';
        if (lightboxCap) lightboxCap.textContent = caption || '';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.src = '';
    };

    const zoomable = document.querySelectorAll(
        '.problema-grid__item, .equipo__foto, .metodo__media'
    );
    zoomable.forEach(fig => {
        fig.addEventListener('click', () => {
            const img = fig.querySelector('img');
            const cap = fig.querySelector('figcaption');
            if (!img) return;
            openLightbox(img.src, cap ? cap.textContent.trim() : img.alt);
        });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox();
    });


    /* =========================================================
       Escena 3D — Tunera animada en el hero
       ========================================================= */
    const canvas = document.getElementById('bg3d');
    if (canvas && window.THREE) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 700px)').matches;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: !isMobile,
            powerPreference: 'low-power'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0.5, 13);

        // Luces — tonos cálidos canarios
        const ambient = new THREE.AmbientLight(0xfff1d0, 0.55);
        scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xffe9a8, 1.05);
        sun.position.set(4, 6, 5);
        scene.add(sun);
        const rim = new THREE.DirectionalLight(0x6b9a5e, 0.45);
        rim.position.set(-5, 2, -3);
        scene.add(rim);

        // Geometría de pala (esfera deformada)
        function makePadGeometry() {
            const g = new THREE.SphereGeometry(1, 28, 20);
            const pos = g.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
                // Achatar en Z (fina como una pala) y alargar en Y
                pos.setZ(i, z * 0.16);
                pos.setY(i, y * 1.45);
                // Pequeña deformación aleatoria para textura
                pos.setX(i, x + Math.sin(y * 6) * 0.015);
            }
            g.computeVertexNormals();
            return g;
        }

        const padGeo = makePadGeometry();
        const padMat = new THREE.MeshStandardMaterial({
            color: 0x7fa867,
            roughness: 0.78,
            metalness: 0.02,
            flatShading: false
        });

        // Areolas (puntos de espinas) — pequeños cilindros amarillentos
        const areolaGeo = new THREE.SphereGeometry(0.05, 8, 6);
        const areolaMat = new THREE.MeshStandardMaterial({
            color: 0xe8c97a,
            roughness: 0.6
        });

        function addAreolas(pad, count = 14) {
            for (let i = 0; i < count; i++) {
                const a = new THREE.Mesh(areolaGeo, areolaMat);
                // Distribuir sobre la cara frontal de la pala
                const u = (Math.random() - 0.5) * 1.6;
                const v = (Math.random() - 0.5) * 2.4;
                a.position.set(u, v, 0.18);
                pad.add(a);
                const a2 = a.clone();
                a2.position.z = -0.18;
                pad.add(a2);
            }
        }

        // Construir tunera con varias palas
        const cactus = new THREE.Group();

        function makePad(scale, position, rotZ = 0, rotY = 0, areolas = 14) {
            const pad = new THREE.Mesh(padGeo, padMat);
            pad.scale.setScalar(scale);
            pad.position.set(...position);
            pad.rotation.z = rotZ;
            pad.rotation.y = rotY;
            addAreolas(pad, areolas);
            cactus.add(pad);
            return pad;
        }

        // Estructura: una pala base, dos laterales y dos superiores
        makePad(1.5, [0, -0.8, 0], 0, 0, 18);
        makePad(1.0, [-1.3, 1.6, 0.4], 0.4, 0.1, 12);
        makePad(1.05, [1.4, 1.8, -0.2], -0.35, -0.15, 12);
        makePad(0.85, [-0.4, 3.6, 0.3], 0.15, 0.2, 10);
        makePad(0.75, [1.0, 3.9, -0.1], -0.2, -0.25, 9);
        makePad(0.6, [0.2, 5.3, 0], 0.05, 0.1, 7);

        cactus.position.y = -2.4;
        cactus.scale.setScalar(isMobile ? 0.78 : 0.95);
        scene.add(cactus);

        // Suelo volcánico (disco oscuro difuso)
        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(8, 48),
            new THREE.MeshBasicMaterial({ color: 0x14110d, transparent: true, opacity: 0.55 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -3.6;
        scene.add(ground);

        // Resize
        function resize() {
            const w = canvas.clientWidth || window.innerWidth;
            const h = canvas.clientHeight || window.innerHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Loop
        let raf;
        let running = true;
        const start = performance.now();
        function tick(now) {
            if (!running) return;
            const t = (now - start) / 1000;
            if (!reduceMotion) {
                cactus.rotation.y = Math.sin(t * 0.18) * 0.55 + t * 0.03;
                cactus.rotation.x = Math.sin(t * 0.12) * 0.06;
                cactus.position.y = -2.4 + Math.sin(t * 0.4) * 0.08;
            } else {
                cactus.rotation.y = 0.3;
            }
            renderer.render(scene, camera);
            raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);

        // Pausar cuando el hero no se ve (ahorra batería)
        if ('IntersectionObserver' in window) {
            const heroSection = document.querySelector('.hero');
            const heroIO = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !running) {
                        running = true;
                        raf = requestAnimationFrame(tick);
                    } else if (!entry.isIntersecting && running) {
                        running = false;
                        cancelAnimationFrame(raf);
                    }
                });
            }, { threshold: 0 });
            if (heroSection) heroIO.observe(heroSection);
        }
    }

})();
