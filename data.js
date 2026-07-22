/* ==========================================
   TechNest — Data Layer (localStorage)
   ========================================== */

var TN = window.TN || {};

/* ---------- Image Fallback ---------- */
TN.productPlaceholder = function (name, brand) {
    var n = (name || 'Product').substring(0, 30);
    var b = brand || '';
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 450'%3E" +
        "%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E" +
        "%3Cstop offset='0%25' stop-color='%230A1628'/%3E" +
        "%3Cstop offset='100%25' stop-color='%23132240'/%3E%3C/linearGradient%3E%3C/defs%3E" +
        "%3Crect fill='url(%23g)' width='600' height='450'/%3E" +
        "%3Ccircle cx='300' cy='180' r='60' fill='none' stroke='%233B82F6' stroke-width='2' opacity='0.3'/%3E" +
        "%3Cpath d='M280 200 L300 140 L320 200 M290 185 H310' fill='none' stroke='%233B82F6' stroke-width='2.5' stroke-linecap='round' opacity='0.5'/%3E" +
        "%3Ctext x='300' y='280' fill='white' font-size='16' text-anchor='middle' font-family='sans-serif' font-weight='600'%3E" + encodeURIComponent(n) + "%3C/text%3E" +
        "%3Ctext x='300' y='310' fill='%233B82F6' font-size='13' text-anchor='middle' font-family='sans-serif'%3E" + encodeURIComponent(b) + "%3C/text%3E" +
        "%3C/svg%3E";
};

TN.DEFAULT_PRODUCTS = [
    {
        id: 1, name: "8BitDo Ultimate 2C Wireless Controller", brand: "8BitDo",
        category: "controllers", price: 5490, originalPrice: null,
        image: "https://s.pacn.ws/1/p/1ej/909781.4.jpg",
        badge: "New", rating: 4.8, reviews: 124, stock: "in",
        desc: "Premium wireless gaming controller with Hall Effect joysticks for zero deadzone and lasting durability. Customizable buttons, 1000Hz polling rate, tri-mode connectivity.",
        specs: { "Connectivity": "Bluetooth 5.0 / 2.4GHz / USB-C", "Joysticks": "Hall Effect (zero deadzone)", "Polling Rate": "1000Hz", "Battery": "1000mAh, ~25 hours", "Compatibility": "PC, Switch, Android", "Warranty": "1 Year Official" }
    },
    {
        id: 2, name: "HAVIT Gaming Headphone HV-H2037d", brand: "HAVIT",
        category: "audio", price: 2490, originalPrice: 3100,
        image: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h2037d/h2037d-03-500x500.webp",
        badge: "-20%", rating: 4.6, reviews: 89, stock: "in",
        desc: "7.1 surround sound gaming headphone with noise-cancelling microphone. Comfortable ear cushions for long gaming sessions.",
        specs: { "Driver": "50mm", "Frequency": "20Hz-20kHz", "Impedance": "32 Ohm", "Mic": "Noise-cancelling, flexible", "Cable": "2.2m braided", "Warranty": "1 Year" }
    },
    {
        id: 3, name: "DeepCool AK400 CPU Cooler", brand: "DeepCool",
        category: "components", price: 2190, originalPrice: null,
        image: "https://media.box.co.uk/product/8/3/83374000ee33a8433073936476d87eea.jpg",
        badge: null, rating: 4.7, reviews: 67, stock: "in",
        desc: "High-performance tower CPU cooler with 4 direct-touch heat pipes. Compact design with excellent thermal performance.",
        specs: { "Heat Pipes": "4 x 6mm direct-touch", "Fan": "120mm FK120", "Noise": "≤28 dBA", "TDP": "220W", "Socket": "Intel LGA1700/1200, AMD AM4/AM5", "Warranty": "3 Years" }
    },
    {
        id: 4, name: "Havit MS1036 Gaming Mouse", brand: "Havit",
        category: "accessories", price: 890, originalPrice: 1050,
        image: "https://www.startech.com.bd/image/cache/catalog/mouse/havit/ms1036/ms1036-01-500x500.webp",
        badge: "-15%", rating: 4.5, reviews: 156, stock: "in",
        desc: "Ergonomic gaming mouse with 6 programmable buttons and adjustable DPI up to 12400. RGB lighting with multiple effects.",
        specs: { "DPI": "Up to 12400", "Buttons": "6 programmable", "Polling Rate": "1000Hz", "Lighting": "RGB customizable", "Weight": "85g", "Warranty": "1 Year" }
    },
    {
        id: 5, name: "Razer DeathAdder V3", brand: "Razer",
        category: "accessories", price: 6490, originalPrice: 9990,
        image: "https://dl.razerzone.com/src2/6128/6128-1-en-v2.png",
        badge: "-35%", rating: 4.9, reviews: 203, stock: "in",
        desc: "Ultra-lightweight ergonomic gaming mouse with Focus Pro 30K sensor. 90-hour battery life, 63g design.",
        specs: { "Sensor": "Focus Pro 30K", "DPI": "Up to 30000", "Weight": "63g", "Battery": "90 hours", "Switches": "90M click durability", "Warranty": "2 Years" }
    },
    {
        id: 6, name: "Logitech G PRO X Headset", brand: "Logitech",
        category: "audio", price: 8990, originalPrice: 12490,
        image: "https://resource.logitechg.com/content/dam/gaming/en/products/pro-x/pro-headset-gallery-1.png",
        badge: "-28%", rating: 4.7, reviews: 156, stock: "in",
        desc: "Professional gaming headset with DTS:X 2.0 surround sound. Blue VO!CE mic technology for crystal-clear communication.",
        specs: { "Driver": "50mm Pro-G", "Surround": "DTS:X 2.0", "Mic": "Blue VO!CE", "Weight": "320g", "Connection": "3.5mm / USB", "Warranty": "2 Years" }
    },
    {
        id: 7, name: "Corsair K70 RGB Mechanical Keyboard", brand: "Corsair",
        category: "accessories", price: 7190, originalPrice: 11990,
        image: "https://c1.neweggimages.com/productimage/nb640/23-816-119-V13.jpg",
        badge: "-40%", rating: 4.8, reviews: 189, stock: "in",
        desc: "Mechanical gaming keyboard with CHERRY MX switches. Dynamic RGB per-key lighting, aircraft-grade aluminum frame.",
        specs: { "Switches": "CHERRY MX Red", "Lighting": "Per-key RGB", "Frame": "Aircraft-grade aluminum", "Polling Rate": "1000Hz", "Keycaps": "PBT double-shot", "Warranty": "2 Years" }
    },
    {
        id: 8, name: "HyperX Cloud II Gaming Headset", brand: "HyperX",
        category: "audio", price: 4990, originalPrice: 6990,
        image: "https://hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1763563198",
        badge: "-29%", rating: 4.6, reviews: 112, stock: "in",
        desc: "Legendary gaming headset with 7.1 virtual surround sound. Durable aluminum frame with memory foam ear cushions.",
        specs: { "Driver": "53mm", "Surround": "7.1 Virtual", "Frequency": "15Hz-25kHz", "Weight": "309g", "Mic": "Detachable noise-cancelling", "Warranty": "2 Years" }
    },
    {
        id: 9, name: "SteelSeries Rival 5 Gaming Mouse", brand: "SteelSeries",
        category: "accessories", price: 3990, originalPrice: 5990,
        image: "https://images.ctfassets.net/hmm5mo4qf4mf/4csGDZSusZa2hwhSlijszd/1125aaded0bf6964b93b21052a52d497/imgbuy_rival5_001.jpg",
        badge: "-33%", rating: 4.7, reviews: 94, stock: "in",
        desc: "Lightweight multi-genre gaming mouse with TrueMove Air sensor. 9 programmable buttons for ultimate versatility.",
        specs: { "Sensor": "TrueMove Air", "DPI": "Up to 18000", "Weight": "85g", "Buttons": "9 programmable", "Switches": "80M clicks", "Warranty": "1 Year" }
    },
    {
        id: 10, name: "Razer BlackWidow V3 Mechanical Keyboard", brand: "Razer",
        category: "accessories", price: 8490, originalPrice: 13990,
        image: "https://dl.razerzone.com/src/3828-1-EN-v1.png",
        badge: "-39%", rating: 4.8, reviews: 143, stock: "in",
        desc: "Full-size mechanical gaming keyboard with Razer Green switches. Doubleshot ABS keycaps, wrist rest included.",
        specs: { "Switches": "Razer Green", "Keycaps": "Doubleshot ABS", "Lighting": "Razer Chroma RGB", "Wrist Rest": "Included", "USB Passthrough": "Yes", "Warranty": "2 Years" }
    },
    {
        id: 11, name: "Logitech G502 HERO Gaming Mouse", brand: "Logitech",
        category: "accessories", price: 4490, originalPrice: 5990,
        image: "https://resource.logitechg.com/content/dam/gaming/en/non-braid/hyjal-g502-hero/2025/g502-hero-mouse-top-angle-gallery-1.png",
        badge: "-25%", rating: 4.8, reviews: 312, stock: "in",
        desc: "HERO 25K sensor gaming mouse with adjustable weights. 11 programmable buttons, LIGHTSYNC RGB.",
        specs: { "Sensor": "HERO 25K", "DPI": "Up to 25600", "Weight": "121g (adjustable)", "Buttons": "11 programmable", "Battery": "Wired", "Warranty": "2 Years" }
    },
    {
        id: 12, name: "AMD Ryzen 5 5600X Processor", brand: "AMD",
        category: "components", price: 14990, originalPrice: 17990,
        image: "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-5-5600x.jpg",
        badge: "-17%", rating: 4.9, reviews: 456, stock: "in",
        desc: "6-core 12-thread desktop processor with excellent gaming performance. 3.7GHz base, 4.6GHz boost clock.",
        specs: { "Cores/Threads": "6 / 12", "Base Clock": "3.7 GHz", "Boost Clock": "4.6 GHz", "Cache": "35MB", "TDP": "65W", "Warranty": "3 Years" }
    }
];

/* ---------- Global Image Error Handler ---------- */
document.addEventListener('error', function (e) {
    if (e.target.tagName === 'IMG' && !e.target.dataset.fallback) {
        e.target.dataset.fallback = '1';
        var name = e.target.alt || 'Product';
        var brand = '';
        var card = e.target.closest('.product-card');
        if (card) {
            var brandEl = card.querySelector('.product-card__brand');
            if (brandEl) brand = brandEl.textContent;
        }
        e.target.src = TN.productPlaceholder(name, brand);
    }
}, true);

TN.data = {
    _key: 'technest_products',

    getProducts: function () {
        var stored = localStorage.getItem(this._key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        this.saveProducts(TN.DEFAULT_PRODUCTS);
        return TN.DEFAULT_PRODUCTS.slice();
    },

    saveProducts: function (products) {
        localStorage.setItem(this._key, JSON.stringify(products));
    },

    getProduct: function (id) {
        id = parseInt(id);
        return this.getProducts().find(function (p) { return p.id == id; });
    },

    addProduct: function (product) {
        var products = this.getProducts();
        product.id = Date.now();
        products.push(product);
        this.saveProducts(products);
        return product;
    },

    updateProduct: function (id, updates) {
        id = parseInt(id);
        var products = this.getProducts();
        var idx = products.findIndex(function (p) { return p.id == id; });
        if (idx !== -1) {
            products[idx] = Object.assign({}, products[idx], updates);
            this.saveProducts(products);
            return products[idx];
        }
        return null;
    },

    deleteProduct: function (id) {
        id = parseInt(id);
        var products = this.getProducts().filter(function (p) { return p.id != id; });
        this.saveProducts(products);
    },

    search: function (query) {
        var q = query.toLowerCase();
        return this.getProducts().filter(function (p) {
            return p.name.toLowerCase().includes(q) ||
                   p.brand.toLowerCase().includes(q) ||
                   p.category.toLowerCase().includes(q) ||
                   (p.desc && p.desc.toLowerCase().includes(q));
        });
    },

    filter: function (opts) {
        var products = this.getProducts();
        if (opts.category && opts.category !== 'all') {
            products = products.filter(function (p) { return p.category === opts.category; });
        }
        if (opts.brand && opts.brand !== 'all') {
            products = products.filter(function (p) { return p.brand === opts.brand; });
        }
        if (opts.priceMin !== undefined) {
            products = products.filter(function (p) { return p.price >= opts.priceMin; });
        }
        if (opts.priceMax !== undefined) {
            products = products.filter(function (p) { return p.price <= opts.priceMax; });
        }
        if (opts.query) {
            var q = opts.query.toLowerCase();
            products = products.filter(function (p) {
                return p.name.toLowerCase().includes(q) ||
                       p.brand.toLowerCase().includes(q) ||
                       p.category.toLowerCase().includes(q);
            });
        }
        return products;
    },

    sort: function (products, sortBy) {
        var arr = products.slice();
        switch (sortBy) {
            case 'price-low': arr.sort(function (a, b) { return a.price - b.price; }); break;
            case 'price-high': arr.sort(function (a, b) { return b.price - a.price; }); break;
            case 'newest': arr.sort(function (a, b) { return b.id - a.id; }); break;
            case 'rating': arr.sort(function (a, b) { return b.rating - a.rating; }); break;
            default: break;
        }
        return arr;
    },

    getBrands: function () {
        var brands = {};
        this.getProducts().forEach(function (p) { brands[p.brand] = true; });
        return Object.keys(brands).sort();
    },

    getCategories: function () {
        return ['gaming', 'components', 'accessories', 'audio', 'controllers'];
    }
};

TN.cart = {
    _key: 'technest_cart',

    getItems: function () {
        var stored = localStorage.getItem(this._key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        return [];
    },

    saveItems: function (items) {
        localStorage.setItem(this._key, JSON.stringify(items));
        this.updateBadge();
        window.dispatchEvent(new Event('cart-updated'));
    },

    addItem: function (productId, qty) {
        qty = qty || 1;
        var items = this.getItems();
        var existing = items.find(function (i) { return i.id === productId; });
        if (existing) {
            existing.qty = Math.min(existing.qty + qty, 10);
        } else {
            items.push({ id: productId, qty: qty });
        }
        this.saveItems(items);
    },

    removeItem: function (productId) {
        var items = this.getItems().filter(function (i) { return i.id !== productId; });
        this.saveItems(items);
    },

    updateQty: function (productId, qty) {
        var items = this.getItems();
        var item = items.find(function (i) { return i.id === productId; });
        if (item) {
            item.qty = Math.max(1, Math.min(qty, 10));
            this.saveItems(items);
        }
    },

    getTotal: function () {
        return this.getItems().reduce(function (sum, item) {
            var product = TN.data.getProduct(item.id);
            return sum + (product ? product.price * item.qty : 0);
        }, 0);
    },

    getCount: function () {
        return this.getItems().reduce(function (sum, i) { return sum + i.qty; }, 0);
    },

    updateBadge: function () {
        var count = this.getCount();
        document.querySelectorAll('.navbar__badge--cart').forEach(function (b) {
            b.textContent = count;
            b.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    clear: function () {
        this.saveItems([]);
    }
};

TN.wishlist = {
    _key: 'technest_wishlist',

    getItems: function () {
        var stored = localStorage.getItem(this._key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        return [];
    },

    saveItems: function (items) {
        localStorage.setItem(this._key, JSON.stringify(items));
        this.updateBadge();
        window.dispatchEvent(new Event('wishlist-updated'));
    },

    toggle: function (productId) {
        var items = this.getItems();
        var idx = items.indexOf(productId);
        if (idx === -1) {
            items.push(productId);
        } else {
            items.splice(idx, 1);
        }
        this.saveItems(items);
        return idx === -1;
    },

    has: function (productId) {
        return this.getItems().indexOf(productId) !== -1;
    },

    updateBadge: function () {
        var count = this.getItems().length;
        document.querySelectorAll('.navbar__badge--wishlist').forEach(function (b) {
            b.textContent = count;
            b.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

TN.messages = {
    _key: 'technest_messages',

    getMessages: function () {
        var stored = localStorage.getItem(this._key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        return [];
    },

    addMessage: function (msg) {
        var messages = this.getMessages();
        msg.id = Date.now();
        msg.date = new Date().toISOString();
        msg.read = false;
        messages.unshift(msg);
        localStorage.setItem(this._key, JSON.stringify(messages));
        return msg;
    },

    markRead: function (id) {
        var messages = this.getMessages();
        var msg = messages.find(function (m) { return m.id === id; });
        if (msg) {
            msg.read = true;
            localStorage.setItem(this._key, JSON.stringify(messages));
        }
    },

    deleteMessage: function (id) {
        var messages = this.getMessages().filter(function (m) { return m.id !== id; });
        localStorage.setItem(this._key, JSON.stringify(messages));
    },

    getUnreadCount: function () {
        return this.getMessages().filter(function (m) { return !m.read; }).length;
    }
};

TN.orders = {
    _key: 'technest_orders',

    getOrders: function () {
        var stored = localStorage.getItem(this._key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        return [];
    },

    addOrder: function (order) {
        var orders = this.getOrders();
        order.id = Date.now();
        order.date = new Date().toISOString();
        order.status = 'pending';
        orders.unshift(order);
        localStorage.setItem(this._key, JSON.stringify(orders));
        return order;
    },

    getRevenue: function () {
        return this.getOrders().reduce(function (sum, o) { return sum + (o.total || 0); }, 0);
    },

    getMonthlyData: function () {
        var orders = this.getOrders();
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var data = [];
        var now = new Date();
        for (var i = 5; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            var month = d.getMonth();
            var year = d.getFullYear();
            var total = orders.filter(function (o) {
                var od = new Date(o.date);
                return od.getMonth() === month && od.getFullYear() === year;
            }).reduce(function (sum, o) { return sum + (o.total || 0); }, 0);
            data.push({ label: months[month], revenue: total });
        }
        return data;
    }
};

TN.search = {
    _key: 'technest_search_history',

    getHistory: function () {
        var stored = localStorage.getItem(this._key);
        if (stored) { try { return JSON.parse(stored); } catch (e) { /* ignore */ } }
        return [];
    },

    add: function (query) {
        if (!query.trim()) return;
        var history = this.getHistory().filter(function (q) { return q !== query; });
        history.unshift(query);
        if (history.length > 10) history = history.slice(0, 10);
        localStorage.setItem(this._key, JSON.stringify(history));
    }
};

window.TN = TN;
