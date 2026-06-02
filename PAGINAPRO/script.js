document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       0. NUEVO: SISTEMA DE AUTENTICACIÓN (LOGIN)
       ========================================================================== */
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const openLoginBtn = document.getElementById('open-login');
    const closeLoginBtn = document.getElementById('close-login');
    let usuarioLogueado = false;

    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            if (usuarioLogueado) {
                alert("Modo Edición: Perfil cargado.");
            } else {
                loginOverlay.style.display = 'flex';
            }
        });
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => loginOverlay.style.display = 'none');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const pass = document.getElementById('password').value;

            if (!email.includes('@')) {
                alert("El correo debe incluir un '@'");
                return;
            }

            const regex = /^[A-Z][a-zA-Z0-9]{5,11}$/;
            if (!regex.test(pass)) {
                alert("Error: La contraseña debe tener entre 6 y 12 caracteres y empezar con Mayúscula.");
                return;
            }

            alert("¡Sesión iniciada correctamente!");
            usuarioLogueado = true;
            loginOverlay.style.display = 'none';
        });
    }

    /* ==========================================================================
       1. SISTEMA DE ANIMACIONES (SCROLL REVEAL)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const checkScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < windowHeight - 150) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll();

    /* ==========================================================================
       2. REPRODUCTOR INTERACTIVO 3D
       ========================================================================== */
    document.querySelectorAll('.interactive-media').forEach(container => {
        const video = container.querySelector('.hover-video');
        const volumeBtn = container.querySelector('.volume-btn');
        let videoTimeout;

        container.addEventListener('mouseenter', () => {
            videoTimeout = setTimeout(() => {
                container.classList.add('video-active');
                if (video) video.play().catch(e => console.log(e));
            }, 300);
        });

        container.addEventListener('mouseleave', () => {
            clearTimeout(videoTimeout);
            container.classList.remove('video-active');
            if (video) { video.pause(); video.currentTime = 0; }
        });

        if (volumeBtn && video) {
            volumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                volumeBtn.textContent = video.muted ? '🔇' : '🔊';
            });
        }
    });

    /* ==========================================================================
       3. PANEL LATERAL WISHLIST (MANTENIDO)
       ========================================================================== */
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const wishlistContent = document.getElementById('wishlist-content');
    const openWishlistBtn = document.getElementById('open-wishlist');
    const closeWishlistBtn = document.getElementById('close-wishlist');
    const wishlistSidebar = document.getElementById('wishlist-sidebar');
    const wishlistOverlay = document.getElementById('wishlist-overlay');
    const wishlistFooter = document.getElementById('wishlist-footer');
    const totalPriceElement = document.getElementById('wishlist-total-price');
    const buyAllBtn = document.getElementById('buy-all-wishlist');

    let wishlistData = [];

    const closeSidebar = () => {
        wishlistSidebar.classList.remove('active');
        wishlistOverlay.classList.remove('active');
    };

    openWishlistBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        wishlistSidebar.classList.add('active');
        wishlistSidebar.classList.add('active');
        wishlistOverlay.classList.add('active');
    });

    closeWishlistBtn?.addEventListener('click', closeSidebar);
    wishlistOverlay?.addEventListener('click', closeSidebar);

    function parsePriceToNumber(p) { return parseInt(p.replace(/[^0-9]/g, ''), 10) || 0; }
    function formatNumberToCLP(n) { return '$' + n.toLocaleString('es-CL') + ' CLP'; }

    function updateWishlistUI() {
        if (!wishlistContent) return;
        if (wishlistData.length === 0) {
            wishlistContent.innerHTML = '<p class="empty-msg">Aún no tienes juegos en tu lista.</p>';
            wishlistFooter?.classList.remove('active');
            return;
        }

        wishlistContent.innerHTML = '';
        let currentTotal = 0;
        wishlistData.forEach(item => {
            currentTotal += parsePriceToNumber(item.price);
            const div = document.createElement('div');
            div.className = 'wishlist-item';
            div.innerHTML = `<div class="wishlist-item-img" style="background-image: ${item.bgImage};"></div>
                             <div class="wishlist-item-info"><h4>${item.title}</h4><p>${item.price}</p></div>
                             <button class="remove-item">🗑️</button>`;
            div.querySelector('.remove-item').onclick = () => {
                wishlistData = wishlistData.filter(w => w.title !== item.title);
                item.btnRef.classList.remove('active');
                item.btnRef.textContent = '🤍';
                updateWishlistUI();
            };
            wishlistContent.appendChild(div);
        });
        if (totalPriceElement) totalPriceElement.innerText = formatNumberToCLP(currentTotal);
        wishlistFooter?.classList.add('active');
    }

    wishlistBtns.forEach(btn => {
        btn.onclick = () => {
            const sec = btn.closest('.product-section');
            const title = sec.querySelector('h2').innerText;
            const price = sec.querySelector('.price-current').innerText;
            const bgImage = sec.querySelector('.front-img').style.backgroundImage;
            
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                btn.textContent = '❤️';
                wishlistData.push({ title, price, bgImage, btnRef: btn });
            } else {
                btn.textContent = '🤍';
                wishlistData = wishlistData.filter(i => i.title !== title);
            }
            updateWishlistUI();
        };
    });

    buyAllBtn?.addEventListener('click', () => {
        const finalTotal = wishlistData.reduce((s, i) => s + parsePriceToNumber(i.price), 0);
        alert(`🛒 ¡Compra exitosa!\nTotal: ${formatNumberToCLP(finalTotal)}`);
    });
});