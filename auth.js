/* ==========================================
   TechNest — Authentication (Google + Local)
   ========================================== */

var TN = window.TN || {};

TN.auth = {
    _key: 'technest_user',

    getUser: function () {
        var stored = localStorage.getItem(this._key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        return null;
    },

    isLoggedIn: function () {
        return this.getUser() !== null;
    },

    setUser: function (user) {
        localStorage.setItem(this._key, JSON.stringify(user));
        this.updateUI();
        window.dispatchEvent(new Event('auth-updated'));
    },

    logout: function () {
        localStorage.removeItem(this._key);
        this.updateUI();
        window.dispatchEvent(new Event('auth-updated'));
    },

    /* ---------- Email/Password (Local) ---------- */
    login: function (email, password) {
        if (!email || !password || password.length < 6) {
            return { success: false, error: 'Invalid email or password (min 6 characters)' };
        }
        var users = this._getUsers();
        var user = users.find(function (u) { return u.email === email; });
        if (user) {
            if (user.password !== password) {
                return { success: false, error: 'Incorrect password' };
            }
        } else {
            user = { id: Date.now(), name: email.split('@')[0], email: email, password: password, avatar: null, provider: 'local' };
            users.push(user);
            localStorage.setItem('technest_users', JSON.stringify(users));
        }
        var safeUser = Object.assign({}, user);
        delete safeUser.password;
        this.setUser(safeUser);
        return { success: true };
    },

    signup: function (name, email, password) {
        if (!name || !email || !password) {
            return { success: false, error: 'All fields are required' };
        }
        if (password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
        }
        var users = this._getUsers();
        if (users.find(function (u) { return u.email === email; })) {
            return { success: false, error: 'Email already registered' };
        }
        var user = { id: Date.now(), name: name, email: email, password: password, avatar: null, provider: 'local' };
        users.push(user);
        localStorage.setItem('technest_users', JSON.stringify(users));
        var safeUser = Object.assign({}, user);
        delete safeUser.password;
        this.setUser(safeUser);
        return { success: true };
    },

    _getUsers: function () {
        var stored = localStorage.getItem('technest_users');
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        return [];
    },

    /* ---------- Mock Google Sign-In ---------- */
    googleSignIn: function () {
        var email = 'user@gmail.com';
        var name = 'Google User';
        var user = {
            id: 'google_' + Date.now(),
            name: name,
            email: email,
            avatar: null,
            provider: 'google'
        };
        this.setUser(user);
        var modal = document.getElementById('loginModal');
        if (modal) modal.classList.remove('open');
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    },

    /* ---------- UI Updates ---------- */
    updateUI: function () {
        var user = this.getUser();
        document.querySelectorAll('.auth-only').forEach(function (el) {
            el.style.display = user ? '' : 'none';
        });
        document.querySelectorAll('.guest-only').forEach(function (el) {
            el.style.display = user ? 'none' : '';
        });
        document.querySelectorAll('.user-name').forEach(function (el) {
            el.textContent = user ? user.name : '';
        });
        document.querySelectorAll('.user-email').forEach(function (el) {
            el.textContent = user ? user.email : '';
        });
        document.querySelectorAll('.user-avatar').forEach(function (el) {
            if (user && user.avatar) {
                el.innerHTML = '<img src="' + user.avatar + '" alt="' + user.name + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
            } else if (user) {
                el.textContent = user.name.charAt(0).toUpperCase();
            }
        });
    },

    requireAuth: function (callback) {
        if (this.isLoggedIn()) {
            callback();
        } else {
            TN.ui.showLoginPrompt(callback);
        }
    }
};

/* ---------- UI Helper ---------- */
TN.ui = {
    _pendingCallback: null,

    showLoginPrompt: function (onLogin) {
        var self = this;
        self._pendingCallback = onLogin;

        var modal = document.getElementById('loginModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'loginModal';
            modal.className = 'modal-overlay';
            modal.innerHTML = '<div class="modal">' +
                '<button class="modal__close" onclick="TN.ui.closeLoginPrompt()">&times;</button>' +
                '<h2 class="modal__title">Sign in to Continue</h2>' +
                '<p class="modal__text">You need to be signed in to add items to your cart and wishlist.</p>' +
                '<button class="btn btn--google" onclick="TN.auth.googleSignIn()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px;border:1px solid var(--gray-600);border-radius:var(--radius-sm);color:var(--white);font-weight:600;margin-bottom:16px;background:var(--navy-mid)">' +
                '<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#34A853" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>' +
                'Continue with Google' +
                '</button>' +
                '<div class="modal__divider"><span>or sign in with email</span></div>' +
                '<form id="modalLoginForm" class="modal__form">' +
                '<input type="email" placeholder="Email" required class="modal__input">' +
                '<input type="password" placeholder="Password (min 6 chars)" required minlength="6" class="modal__input">' +
                '<div id="modalLoginError" class="modal__error" style="display:none;color:var(--danger);font-size:0.85rem;margin-bottom:8px"></div>' +
                '<button type="submit" class="btn btn--primary btn--glow" style="width:100%">Sign In</button>' +
                '</form>' +
                '<p class="modal__footer" style="margin-top:16px;text-align:center;color:var(--gray-400);font-size:0.9rem">Don\'t have an account? <a href="login.html" style="color:var(--blue)">Sign Up</a></p>' +
                '</div>';
            document.body.appendChild(modal);

            document.getElementById('modalLoginForm').addEventListener('submit', function (e) {
                e.preventDefault();
                var email = this.querySelector('input[type="email"]').value;
                var password = this.querySelector('input[type="password"]').value;
                var errorEl = document.getElementById('modalLoginError');
                errorEl.style.display = 'none';
                var result = TN.auth.login(email, password);
                if (result.success) {
                    modal.classList.remove('open');
                    if (self._pendingCallback) {
                        self._pendingCallback();
                        self._pendingCallback = null;
                    }
                } else {
                    errorEl.textContent = result.error;
                    errorEl.style.display = 'block';
                }
            });

            modal.addEventListener('click', function (e) {
                if (e.target === modal) self.closeLoginPrompt();
            });
        }

        modal.classList.add('open');
    },

    closeLoginPrompt: function () {
        var modal = document.getElementById('loginModal');
        if (modal) modal.classList.remove('open');
    },

    /* ---------- Cart Sidebar ---------- */
    openCart: function () {
        var sidebar = document.getElementById('cartSidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'cartSidebar';
            sidebar.className = 'cart-sidebar';
            document.body.appendChild(sidebar);
        }
        this.renderCart();
        sidebar.classList.add('open');
    },

    closeCart: function () {
        var sidebar = document.getElementById('cartSidebar');
        if (sidebar) sidebar.classList.remove('open');
    },

    renderCart: function () {
        var sidebar = document.getElementById('cartSidebar');
        if (!sidebar) return;
        var items = TN.cart.getItems();
        var html = '<div class="cart-sidebar__header">' +
            '<h3>Your Cart (' + TN.cart.getCount() + ')</h3>' +
            '<button class="cart-sidebar__close" onclick="TN.ui.closeCart()">&times;</button>' +
            '</div>';

        if (items.length === 0) {
            html += '<div class="cart-sidebar__empty"><p>Your cart is empty</p><a href="shop.html" class="btn btn--primary btn--sm" style="margin-top:12px">Browse Products</a></div>';
        } else {
            html += '<div class="cart-sidebar__items">';
            items.forEach(function (item) {
                var p = TN.data.getProduct(item.id);
                if (!p) return;
                html += '<div class="cart-item">' +
                    '<img src="' + p.image + '" alt="' + p.name + '" class="cart-item__img" onerror="this.style.display=\'none\'">' +
                    '<div class="cart-item__info">' +
                    '<span class="cart-item__brand">' + p.brand + '</span>' +
                    '<span class="cart-item__name">' + p.name + '</span>' +
                    '<span class="cart-item__price">৳' + p.price.toLocaleString() + '</span>' +
                    '<div class="cart-item__qty">' +
                    '<button onclick="TN.ui.cartQty(' + p.id + ',-1)">−</button>' +
                    '<span>' + item.qty + '</span>' +
                    '<button onclick="TN.ui.cartQty(' + p.id + ',1)">+</button>' +
                    '</div>' +
                    '</div>' +
                    '<button class="cart-item__remove" onclick="TN.ui.cartRemove(' + p.id + ')">&times;</button>' +
                    '</div>';
            });
            html += '</div>';
            html += '<div class="cart-sidebar__footer">' +
                '<div class="cart-sidebar__total"><span>Total:</span><span>৳' + TN.cart.getTotal().toLocaleString() + '</span></div>' +
                '<button class="btn btn--primary btn--glow" style="width:100%" onclick="TN.ui.closeCart()">Proceed to Checkout</button>' +
                '</div>';
        }
        sidebar.innerHTML = html;
    },

    cartQty: function (id, delta) {
        var items = TN.cart.getItems();
        var item = items.find(function (i) { return i.id === id; });
        if (item) {
            TN.cart.updateQty(id, item.qty + delta);
            this.renderCart();
        }
    },

    cartRemove: function (id) {
        TN.cart.removeItem(id);
        this.renderCart();
    },

    /* ---------- Wishlist Sidebar ---------- */
    openWishlist: function () {
        var sidebar = document.getElementById('wishlistSidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'wishlistSidebar';
            sidebar.className = 'cart-sidebar';
            document.body.appendChild(sidebar);
        }
        this.renderWishlist();
        sidebar.classList.add('open');
    },

    closeWishlist: function () {
        var sidebar = document.getElementById('wishlistSidebar');
        if (sidebar) sidebar.classList.remove('open');
    },

    renderWishlist: function () {
        var sidebar = document.getElementById('wishlistSidebar');
        if (!sidebar) return;
        var ids = TN.wishlist.getItems();
        var html = '<div class="cart-sidebar__header">' +
            '<h3>Wishlist (' + ids.length + ')</h3>' +
            '<button class="cart-sidebar__close" onclick="TN.ui.closeWishlist()">&times;</button>' +
            '</div>';

        if (ids.length === 0) {
            html += '<div class="cart-sidebar__empty"><p>Your wishlist is empty</p><a href="shop.html" class="btn btn--primary btn--sm" style="margin-top:12px">Browse Products</a></div>';
        } else {
            html += '<div class="cart-sidebar__items">';
            ids.forEach(function (id) {
                var p = TN.data.getProduct(id);
                if (!p) return;
                html += '<div class="cart-item">' +
                    '<img src="' + p.image + '" alt="' + p.name + '" class="cart-item__img" onerror="this.style.display=\'none\'">' +
                    '<div class="cart-item__info">' +
                    '<span class="cart-item__brand">' + p.brand + '</span>' +
                    '<span class="cart-item__name">' + p.name + '</span>' +
                    '<span class="cart-item__price">৳' + p.price.toLocaleString() + '</span>' +
                    '</div>' +
                    '<div style="display:flex;flex-direction:column;gap:4px">' +
                    '<button class="btn btn--primary btn--sm" onclick="TN.ui.wishlistMoveToCart(' + p.id + ')">Add to Cart</button>' +
                    '<button class="cart-item__remove" onclick="TN.ui.wishlistRemove(' + p.id + ')">Remove</button>' +
                    '</div>' +
                    '</div>';
            });
            html += '</div>';
        }
        sidebar.innerHTML = html;
    },

    wishlistRemove: function (id) {
        TN.wishlist.toggle(id);
        this.renderWishlist();
        document.querySelectorAll('[data-wishlist-id="' + id + '"]').forEach(function (btn) {
            btn.classList.remove('active');
        });
    },

    wishlistMoveToCart: function (id) {
        TN.auth.requireAuth(function () {
            TN.cart.addItem(id, 1);
            TN.ui.openCart();
            TN.ui.closeWishlist();
        });
    },

    /* ---------- Search Modal ---------- */
    openSearch: function () {
        var modal = document.getElementById('searchModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'searchModal';
            modal.className = 'search-overlay';
            modal.innerHTML = '<div class="search-modal">' +
                '<div class="search-modal__inner">' +
                '<div class="search-modal__input-wrap">' +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
                '<input type="text" id="searchInput" placeholder="Search products, brands..." autofocus class="search-modal__input">' +
                '<button class="search-modal__close" onclick="TN.ui.closeSearch()">&times;</button>' +
                '</div>' +
                '<div id="searchResults" class="search-modal__results"></div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);

            var input = document.getElementById('searchInput');
            var results = document.getElementById('searchResults');
            var debounce;

            input.addEventListener('input', function () {
                clearTimeout(debounce);
                debounce = setTimeout(function () {
                    var q = input.value.trim();
                    if (q.length < 2) { results.innerHTML = ''; return; }
                    TN.search.add(q);
                    var products = TN.data.search(q).slice(0, 8);
                    if (products.length === 0) {
                        results.innerHTML = '<p style="color:var(--gray-400);padding:20px;text-align:center">No products found for "' + q + '"</p>';
                        return;
                    }
                    results.innerHTML = products.map(function (p) {
                        return '<a href="product.html?id=' + p.id + '" class="search-result">' +
                            '<img src="' + p.image + '" alt="' + p.name + '" class="search-result__img" onerror="this.style.display=\'none\'">' +
                            '<div class="search-result__info">' +
                            '<span class="search-result__brand">' + p.brand + '</span>' +
                            '<span class="search-result__name">' + p.name + '</span>' +
                            '<span class="search-result__price">৳' + p.price.toLocaleString() + '</span>' +
                            '</div></a>';
                    }).join('');
                }, 300);
            });

            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && input.value.trim()) {
                    window.location.href = 'shop.html?q=' + encodeURIComponent(input.value.trim());
                }
            });

            modal.addEventListener('click', function (e) {
                if (e.target === modal) TN.ui.closeSearch();
            });
        }
        modal.classList.add('open');
        setTimeout(function () {
            var input = document.getElementById('searchInput');
            if (input) { input.value = ''; input.focus(); }
            var results = document.getElementById('searchResults');
            if (results) results.innerHTML = '';
        }, 100);
    },

    closeSearch: function () {
        var modal = document.getElementById('searchModal');
        if (modal) modal.classList.remove('open');
    }
};

/* ---------- Add to Cart with Auth Check ---------- */
TN.addToCart = function (productId, qty) {
    qty = qty || 1;
    TN.auth.requireAuth(function () {
        TN.cart.addItem(productId, qty);
        TN.ui.openCart();
    });
};

TN.toggleWishlist = function (productId, btn) {
    TN.auth.requireAuth(function () {
        var added = TN.wishlist.toggle(productId);
        if (btn) {
            if (added) {
                btn.classList.add('active');
                var svg = btn.querySelector('svg');
                if (svg) svg.setAttribute('fill', '#ef4444');
            } else {
                btn.classList.remove('active');
                var svg2 = btn.querySelector('svg');
                if (svg2) svg2.setAttribute('fill', 'none');
            }
        }
    });
};

/* ---------- Init on DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', function () {
    TN.auth.updateUI();
    TN.cart.updateBadge();
    TN.wishlist.updateBadge();
});

window.TN = TN;
