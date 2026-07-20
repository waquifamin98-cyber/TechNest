/* ==========================================
   TechNest — Authentication (Google + Local)
   ========================================== */

var TN = window.TN || {};

TN.auth = {
    _key: 'technest_user',

    /* ---------- User State ---------- */
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
        // Sign out from Google if available
        if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
    },

    /* ---------- Google Sign-In ---------- */
    // To use real Google Sign-In:
    // 1. Go to https://console.cloud.google.com
    // 2. Create OAuth 2.0 Client ID (Web application)
    // 3. Add authorized JavaScript origins (your domain)
    // 4. Replace the client ID below
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',

    initGoogle: function () {
        var self = this;
        if (typeof google === 'undefined' || !google.accounts) {
            // Google script not loaded, skip
            return;
        }
        google.accounts.id.initialize({
            client_id: self.CLIENT_ID,
            callback: self._handleGoogleResponse.bind(self)
        });
    },

    _handleGoogleResponse: function (response) {
        var payload = JSON.parse(atob(response.credential.split('.')[1]));
        var user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            avatar: payload.picture,
            provider: 'google'
        };
        this.setUser(user);
        // Close login modal if open
        var modal = document.getElementById('loginModal');
        if (modal) modal.classList.remove('open');
        // Redirect if on login page
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    },

    renderGoogleButton: function (containerId) {
        var self = this;
        if (typeof google === 'undefined' || !google.accounts) {
            // Fallback: show message
            var el = document.getElementById(containerId);
            if (el) el.innerHTML = '<p style="color:var(--gray-400);font-size:0.9rem;">Google Sign-In requires a valid Client ID. Use email/password below.</p>';
            return;
        }
        google.accounts.id.initialize({
            client_id: self.CLIENT_ID,
            callback: self._handleGoogleResponse.bind(self)
        });
        google.accounts.id.renderButton(
            document.getElementById(containerId),
            { theme: 'filled_blue', size: 'large', width: 300, text: 'signin_with' }
        );
    },

    /* ---------- Email/Password (Local Mock) ---------- */
    login: function (email, password) {
        // In production, this would be an API call
        // For demo, we accept any valid email + password >= 6 chars
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
            // Auto-register
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

    /* ---------- Require Auth ---------- */
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
    showLoginPrompt: function (onLogin) {
        // Create modal if not exists
        var modal = document.getElementById('loginModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'loginModal';
            modal.className = 'modal-overlay';
            modal.innerHTML = '<div class="modal">' +
                '<button class="modal__close" onclick="TN.ui.closeLoginPrompt()">&times;</button>' +
                '<h2 class="modal__title">Sign in to Continue</h2>' +
                '<p class="modal__text">You need to be signed in to add items to your cart.</p>' +
                '<div id="googleSignInBtn" style="display:flex;justify-content:center;margin-bottom:16px"></div>' +
                '<div class="modal__divider"><span>or</span></div>' +
                '<form id="modalLoginForm" class="modal__form">' +
                '<input type="email" placeholder="Email" required class="modal__input">' +
                '<input type="password" placeholder="Password (min 6 chars)" required minlength="6" class="modal__input">' +
                '<button type="submit" class="btn btn--primary btn--glow" style="width:100%">Sign In</button>' +
                '</form>' +
                '<p class="modal__footer">Don\'t have an account? <a href="login.html" style="color:var(--blue)">Sign Up</a></p>' +
                '</div>';
            document.body.appendChild(modal);

            // Handle form submit
            document.getElementById('modalLoginForm').addEventListener('submit', function (e) {
                e.preventDefault();
                var email = this.querySelector('input[type="email"]').value;
                var password = this.querySelector('input[type="password"]').value;
                var result = TN.auth.login(email, password);
                if (result.success) {
                    modal.classList.remove('open');
                    if (onLogin) onLogin();
                } else {
                    alert(result.error);
                }
            });

            // Init Google button
            setTimeout(function () {
                TN.auth.renderGoogleButton('googleSignInBtn');
            }, 100);
        }

        // Store callback
        modal._onLogin = onLogin;
        modal.classList.add('open');

        // Re-init Google button each time
        setTimeout(function () {
            TN.auth.renderGoogleButton('googleSignInBtn');
        }, 200);
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
            html += '<div class="cart-sidebar__empty"><p>Your cart is empty</p><a href="shop.html" class="btn btn--primary btn--sm">Browse Products</a></div>';
        } else {
            html += '<div class="cart-sidebar__items">';
            items.forEach(function (item) {
                var p = TN.data.getProduct(item.id);
                if (!p) return;
                html += '<div class="cart-item">' +
                    '<img src="' + p.image + '" alt="' + p.name + '" class="cart-item__img" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%230f1d32%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 fill=%22%233B82F6%22 font-size=%2210%22 text-anchor=%22middle%22%3E' + encodeURIComponent(p.name.substring(0, 15)) + '%3C/text%3E%3C/svg%3E\'">' +
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
                '<button class="btn btn--primary btn--glow" style="width:100%">Proceed to Checkout</button>' +
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
            html += '<div class="cart-sidebar__empty"><p>Your wishlist is empty</p><a href="shop.html" class="btn btn--primary btn--sm">Browse Products</a></div>';
        } else {
            html += '<div class="cart-sidebar__items">';
            ids.forEach(function (id) {
                var p = TN.data.getProduct(id);
                if (!p) return;
                html += '<div class="cart-item">' +
                    '<img src="' + p.image + '" alt="' + p.name + '" class="cart-item__img" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%230f1d32%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 fill=%22%233B82F6%22 font-size=%2210%22 text-anchor=%22middle%22%3E' + encodeURIComponent(p.name.substring(0, 15)) + '%3C/text%3E%3C/svg%3E\'">' +
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
        // Update heart icons on page
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
                btn.querySelector('svg').setAttribute('fill', '#ef4444');
            } else {
                btn.classList.remove('active');
                btn.querySelector('svg').setAttribute('fill', 'none');
            }
        }
    });
};

window.TN = TN;
