(function () {
  function money(value, currency) {
    return Number(value || 0).toLocaleString("es-MX", { style: "currency", currency: currency || "MXN" });
  }

  function safe(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
    });
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function mount(target, config) {
    var root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) throw new Error("GotoEcommerce target not found");

    var tenant = config.tenantId || "store";
    var state = {
      cart: JSON.parse(localStorage.getItem(tenant + "_cart") || "[]"),
      purchases: JSON.parse(localStorage.getItem(tenant + "_purchases") || "[]"),
      tickets: JSON.parse(localStorage.getItem(tenant + "_tickets") || "[]"),
      account: localStorage.getItem(tenant + "_account") || "",
      category: config.initialCategory || "all",
      page: 1,
    };

    var products = config.products || [];
    var categories = config.categories || [];
    var perPage = config.perPage || 30;
    var loadedFontFaces = {};

    function save() {
      localStorage.setItem(tenant + "_cart", JSON.stringify(state.cart));
      localStorage.setItem(tenant + "_purchases", JSON.stringify(state.purchases));
      localStorage.setItem(tenant + "_tickets", JSON.stringify(state.tickets));
      localStorage.setItem(tenant + "_account", state.account);
    }

    function filteredProducts() {
      var query = (byId(tenant + "-search") || {}).value || "";
      var normalized = query.trim().toLowerCase();
      var sort = (byId(tenant + "-sort") || {}).value || "recommended";
      var items = products.filter(function (product) {
        return state.category === "all" || product.category === state.category;
      });

      if (normalized) {
        items = items.filter(function (product) {
          return (product.title + " " + product.description + " " + product.tag).toLowerCase().indexOf(normalized) >= 0;
        });
      }

      if (sort === "price-asc") items.sort(function (a, b) { return a.price - b.price; });
      if (sort === "price-desc") items.sort(function (a, b) { return b.price - a.price; });
      if (sort === "new") items = items.slice().reverse();
      return items;
    }

    function pageProducts(items) {
      var totalPages = Math.max(1, Math.ceil(items.length / perPage));
      if (state.page > totalPages) state.page = totalPages;
      var start = (state.page - 1) * perPage;
      return { items: items.slice(start, start + perPage), totalPages: totalPages };
    }

    function injectFontFaces() {
      var styleId = tenant + "-fontfaces";
      var existing = byId(styleId);
      if (existing) existing.remove();
      var css = "";
      if (config.displayFontUrl) {
        css += '@font-face{font-family:"' + (config.displayFontFamily || "GBstock Display") + '";src:url("' + config.displayFontUrl + '") format("woff2");font-display:swap;}';
      }
      var style = document.createElement("style");
      style.id = styleId;
      style.textContent = css;
      document.head.appendChild(style);
    }

    function ensureFontFace(product) {
      if (!product || product.category !== "fonts" || !product.previewWoff2 || loadedFontFaces[product.id]) return;
      loadedFontFaces[product.id] = true;
      var style = byId(tenant + "-fontfaces");
      if (!style) {
        injectFontFaces();
        style = byId(tenant + "-fontfaces");
      }
      style.textContent += '@font-face{font-family:"' + product.id + '";src:url("' + product.previewWoff2 + '") format("woff2");font-display:swap;}';
    }

    function renderShell() {
      root.innerHTML = [
        '<section class="ge-store" style="--ge-ink:' + safe(config.theme.ink) + ';--ge-accent-dark:' + safe(config.theme.accentDark) + ';--ge-line:' + safe(config.theme.line) + ';--ge-muted:' + safe(config.theme.muted) + ';--ge-logo-bg:' + safe(config.theme.logoBg) + ';--ge-feature-bg:' + safe(config.theme.featureBg) + ';--ge-hero-bg:' + safe(config.theme.heroBg) + '">',
        '<div class="ge-shell">',
        '<div class="ge-topbar"><span>GBstock digital foundry</span><strong>1046 activos listos para licenciar</strong><span>OTF / TTF / WOFF2 / ZIP</span></div>',
        '<header class="ge-header">',
        '<a class="ge-brand" href="' + safe(config.basePath || "./") + '"><span class="ge-logo">' + safe(config.logoText || "GB") + '</span><span><strong>' + safe(config.brandName) + '</strong><small>' + safe(config.brandMeta) + '</small></span></a>',
        '<nav class="ge-nav">' + categories.map(function (cat) { return '<a href="' + safe(cat.href) + '" data-ge-category="' + safe(cat.id) + '">' + safe(cat.label) + '</a>'; }).join("") + '</nav>',
        '<div class="ge-actions"><button class="ge-secondary" data-ge-account>Cuenta</button><button data-ge-cart>Carrito <span id="' + tenant + '-cart-count">0</span></button></div>',
        '</header>',
        '<section class="ge-hero"><div class="ge-hero-copy"><p class="ge-eyebrow">' + safe(config.eyebrow) + '</p><div class="ge-hero-type" style="font-family:' + safe(config.displayFontFamily || "GBstock Display") + ', Inter, sans-serif;">GBstock</div><h1>' + safe(config.headline) + '</h1><p class="ge-muted">' + safe(config.subhead) + '</p><div class="ge-search"><input id="' + tenant + '-search" type="search" placeholder="' + safe(config.searchPlaceholder) + '"><button data-ge-search>Buscar</button></div><div class="ge-stats"><span><strong>1000</strong> business fonts</span><span><strong>30</strong> por pagina</span><span><strong>3</strong> licencias</span></div></div>',
        '<aside class="ge-hero-card"><span class="ge-tag">Featured release</span><div class="ge-hero-specimen" style="font-family:' + safe(config.displayFontFamily || "GBstock Display") + ', Inter, sans-serif;">Adebayo</div><strong>' + safe(config.featuredTitle) + '</strong><p>' + safe(config.featuredDescription) + '</p><button data-ge-buy="' + safe(config.featuredProductId) + '">Comprar ahora</button></aside></section>',
        '<section class="ge-categories">' + categories.map(function (cat) { return '<a class="ge-category" href="' + safe(cat.href) + '" data-ge-category="' + safe(cat.id) + '"><span class="ge-thumb">' + safe(cat.short) + '</span><strong>' + safe(cat.label) + '</strong><small>' + safe(cat.title) + '</small></a>'; }).join("") + '</section>',
        '<section class="ge-editorial"><div><p class="ge-eyebrow">Curated for commerce</p><h2>Fuentes para tiendas, hoteles, restaurantes, publicidad y marcas que necesitan verse reales.</h2></div><p>El catalogo combina familias sans, serif, display y rounded con paquetes finales listos para descarga. Cada ficha mantiene prueba tipografica, licencia personal/comercial/extendida y entrega digital inmediata en cuenta.</p></section>',
        '<section><div class="ge-section-head"><div><p class="ge-eyebrow">Recomendados</p><h2>Productos nuevos para vender hoy</h2></div><a href="./tipografias.html" data-ge-category="fonts">Ver tipografias</a></div><div id="' + tenant + '-featured" class="ge-featured"></div></section>',
        '<section class="ge-layout"><aside class="ge-filter"><h2>Catalogo</h2><label>Orden<select id="' + tenant + '-sort"><option value="recommended">Recomendados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="new">Nuevos</option></select></label><label>Licencia<select id="' + tenant + '-license"><option value="personal">Personal</option><option value="commercial">Comercial</option><option value="extended">Extendida</option></select></label><button class="ge-secondary" data-ge-docs>Solicitar documentacion impresa</button><div class="ge-filter-note">Stripe, Mercado Pago, carrito, cuenta, historial de compras, tickets y descargas quedan listos para conectar a produccion.</div></aside><div><div class="ge-section-head"><div><p class="ge-eyebrow" id="' + tenant + '-category-label">Todo el stock</p><h2 id="' + tenant + '-catalog-title">Activos digitales</h2></div><span class="ge-count">' + products.length + ' productos</span></div><div id="' + tenant + '-list" class="ge-list"></div><div id="' + tenant + '-pagination" class="ge-pagination"></div></div></section>',
        '</div>',
        '<aside id="' + tenant + '-account" class="ge-drawer"><div class="ge-drawer-head"><h2>Cuenta ' + safe(config.brandName) + '</h2><button class="ge-secondary" data-ge-close="' + tenant + '-account">Cerrar</button></div><input id="' + tenant + '-email" type="email" placeholder="correo@dominio.com"><button data-ge-login>Crear cuenta / Entrar</button><div class="ge-actions"><button class="ge-secondary">Google</button><button class="ge-secondary">Meta</button><button class="ge-secondary">iCloud</button></div><small class="ge-muted">OAuth preparado para conectar proveedores en produccion.</small><h3>Mis compras y descargas</h3><div id="' + tenant + '-purchases" class="ge-mini-list"></div><h3>Soporte</h3><textarea id="' + tenant + '-support" rows="3" placeholder="Describe tu ticket"></textarea><button data-ge-ticket>Levantar ticket</button><div id="' + tenant + '-tickets" class="ge-mini-list"></div></aside>',
        '<aside id="' + tenant + '-cart" class="ge-drawer"><div class="ge-drawer-head"><h2>Carrito</h2><button class="ge-secondary" data-ge-close="' + tenant + '-cart">Cerrar</button></div><div id="' + tenant + '-cart-items" class="ge-mini-list"></div><label><input id="' + tenant + '-docs" type="checkbox"> Agregar documentacion legal impresa</label><select id="' + tenant + '-shipping"><option value="300">Envio nacional documentos $300</option><option value="450">Envio nacional protegido $450</option><option value="600">Envio nacional express $600</option></select><p class="ge-muted">' + safe(config.legalDocsText) + '</p><div class="ge-total"><span>Total</span><strong id="' + tenant + '-total">$0 MXN</strong></div><button data-ge-checkout>Finalizar checkout</button></aside>',
        '<div id="' + tenant + '-modal" class="ge-modal"></div>',
        '</section>',
      ].join("");
    }

    function renderFeatured() {
      byId(tenant + "-featured").innerHTML = products.filter(function (p) { return p.featured; }).map(function (product) {
        return '<article class="ge-feature"><span class="ge-thumb">' + safe(product.tag) + '</span><h3>' + safe(product.title) + '</h3><p class="ge-muted">' + safe(product.description) + '</p><strong>' + money(product.price, config.currency) + '</strong><button data-ge-buy="' + safe(product.id) + '">Agregar a carrito</button></article>';
      }).join("");
    }

    function renderProducts() {
      var filtered = filteredProducts();
      var paged = pageProducts(filtered);
      byId(tenant + "-list").innerHTML = paged.items.map(function (product) {
        if (product.category === "fonts") return renderFontRow(product);
        return '<article class="ge-row"><span class="ge-thumb">' + safe(product.tag) + '</span><div><h3>' + safe(product.title) + '</h3><p class="ge-muted">' + safe(product.description) + '</p><strong>' + money(product.price, config.currency) + '</strong></div><div class="ge-row-actions"><button data-ge-buy="' + safe(product.id) + '">Comprar</button><button class="ge-secondary" data-ge-add="' + safe(product.id) + '">Agregar</button><button class="ge-secondary" data-ge-view="' + safe(product.id) + '">Ver</button></div></article>';
      }).join("");
      byId(tenant + "-pagination").innerHTML = '<span>' + filtered.length + ' productos · pagina ' + state.page + ' de ' + paged.totalPages + '</span><div><button class="ge-secondary" data-ge-page="prev">Anterior</button><button class="ge-secondary" data-ge-page="next">Siguiente</button></div>';
    }

    function renderFontRow(product) {
      ensureFontFace(product);
      var fontStyle = product.previewWoff2 ? ' style="font-family:' + safe(product.id) + ', Inter, sans-serif;"' : "";
      return '<article class="ge-font-row" data-ge-view="' + safe(product.id) + '"><div class="ge-font-mini"' + fontStyle + '>' + safe(product.title.replace(/\\s+(Sans|Serif)$/i, "")) + '</div><div><div class="ge-font-title"><h3>' + safe(product.title) + '</h3><span>' + safe(product.tag) + '</span></div><p class="ge-muted">' + safe(product.description) + '</p><p class="ge-credit">Designed by ' + safe(product.designer || "GB Family Type") + '</p><p class="ge-formats">' + safe((product.finalFormats || ["OTF", "TTF", "WOFF2"]).join(" / ")) + '</p></div><div class="ge-row-actions"><strong>' + money(product.price, config.currency) + '</strong><button data-ge-buy="' + safe(product.id) + '">Comprar</button><button class="ge-secondary" data-ge-add="' + safe(product.id) + '">Agregar</button></div></article>';
    }

    function renderCart() {
      var cartProducts = state.cart.map(function (id) { return products.find(function (p) { return p.id === id; }); }).filter(Boolean);
      byId(tenant + "-cart-count").textContent = state.cart.length;
      byId(tenant + "-cart-items").innerHTML = cartProducts.length ? cartProducts.map(function (product) {
        return '<div class="ge-mini-item"><strong>' + safe(product.title) + '</strong><br>' + money(product.price, config.currency) + '</div>';
      }).join("") : '<div class="ge-mini-item">Tu carrito esta vacio.</div>';
      var docs = byId(tenant + "-docs") && byId(tenant + "-docs").checked ? Number(byId(tenant + "-shipping").value) : 0;
      var total = cartProducts.reduce(function (sum, product) { return sum + product.price; }, 0) + docs;
      byId(tenant + "-total").textContent = money(total, config.currency);
    }

    function renderAccount() {
      byId(tenant + "-email").value = state.account;
      byId(tenant + "-purchases").innerHTML = state.purchases.length ? state.purchases.map(function (id) {
        var product = products.find(function (p) { return p.id === id; });
        return product ? '<div class="ge-mini-item"><strong>' + safe(product.title) + '</strong><br><a href="' + safe(product.file) + '" download>Descargar producto</a></div>' : "";
      }).join("") : '<div class="ge-mini-item">Tus compras apareceran aqui despues del checkout exitoso.</div>';
      byId(tenant + "-tickets").innerHTML = state.tickets.map(function (ticket) { return '<div class="ge-mini-item">' + safe(ticket) + '</div>'; }).join("");
    }

    function render() {
      var active = categories.find(function (cat) { return cat.id === state.category; });
      byId(tenant + "-category-label").textContent = active ? active.label : "Todo el stock";
      byId(tenant + "-catalog-title").textContent = active ? active.title : "Activos digitales";
      renderFeatured();
      renderProducts();
      renderCart();
      renderAccount();
    }

    function openDrawer(id) {
      byId(id).classList.add("ge-open");
    }

    function closeDrawer(id) {
      byId(id).classList.remove("ge-open");
    }

    function addToCart(id, open) {
      state.cart.push(id);
      save();
      render();
      if (open) openDrawer(tenant + "-cart");
    }

    function showProduct(id) {
      var product = products.find(function (p) { return p.id === id; });
      if (!product) return;
      ensureFontFace(product);
      var modal = byId(tenant + "-modal");
      if (product.category === "fonts") modal.innerHTML = renderFontDetail(product);
      else modal.innerHTML = '<article class="ge-modal-card"><button class="ge-secondary" data-ge-modal-close>Cerrar</button><span class="ge-thumb">' + safe(product.tag) + '</span><h2>' + safe(product.title) + '</h2><p>' + safe(product.description) + '</p><p class="ge-muted">Descarga disponible en cuenta despues de pago confirmado por webhook.</p><strong>' + money(product.price, config.currency) + '</strong><button data-ge-buy="' + safe(product.id) + '">Comprar</button></article>';
      modal.classList.add("ge-open");
    }

    function renderFontDetail(product) {
      var fontStyle = product.previewWoff2 ? ' style="font-family:' + safe(product.id) + ', Inter, sans-serif;"' : "";
      var tiers = product.licenseTiers || {};
      return '<article class="ge-modal-card ge-font-detail"><button class="ge-secondary" data-ge-modal-close>Cerrar</button><p class="ge-eyebrow">Ficha de fuente</p><h2>' + safe(product.title) + '</h2><p class="ge-credit">Designed by ' + safe(product.designer || "GB Family Type") + '</p><div class="ge-font-specimen"' + fontStyle + '>' + safe(product.sampleText || "GBstock crea, licencia y descarga recursos digitales.") + '</div><label>Prueba la fuente<input data-ge-font-test="' + safe(product.id) + '" value="' + safe(product.sampleText || product.title) + '"></label><div class="ge-font-tester"' + fontStyle + ' id="' + tenant + '-tester-' + safe(product.id) + '">' + safe(product.sampleText || product.title) + '</div><p>' + safe(product.description) + '</p><div class="ge-license-grid"><span>Personal ' + money(tiers.personal || product.price, config.currency) + '</span><span>Comercial ' + money(tiers.commercial || product.price * 3, config.currency) + '</span><span>Extendida ' + money(tiers.extended || product.price * 9, config.currency) + '</span></div><p class="ge-formats">Final formats: ' + safe((product.finalFormats || ["OTF", "TTF", "WOFF2"]).join(" / ")) + '</p><p class="ge-muted">Descarga disponible en cuenta despues de pago confirmado por webhook.</p><button data-ge-buy="' + safe(product.id) + '">Comprar</button></article>';
    }

    injectFontFaces();
    renderShell();
    render();

    root.addEventListener("click", function (event) {
      var category = event.target.closest("[data-ge-category]");
      var buy = event.target.closest("[data-ge-buy]");
      var add = event.target.closest("[data-ge-add]");
      var view = event.target.closest("[data-ge-view]");
      var close = event.target.closest("[data-ge-close]");
      if (category) {
        event.preventDefault();
        state.category = category.getAttribute("data-ge-category");
        state.page = 1;
        render();
      }
      if (buy) {
        event.stopPropagation();
        addToCart(buy.getAttribute("data-ge-buy"), true);
      }
      if (add) {
        event.stopPropagation();
        addToCart(add.getAttribute("data-ge-add"), false);
      }
      if (view) showProduct(view.getAttribute("data-ge-view"));
      if (close) closeDrawer(close.getAttribute("data-ge-close"));
      if (event.target.closest("[data-ge-account]")) openDrawer(tenant + "-account");
      if (event.target.closest("[data-ge-cart]")) openDrawer(tenant + "-cart");
      if (event.target.closest("[data-ge-docs]")) openDrawer(tenant + "-cart");
      if (event.target.closest("[data-ge-modal-close]")) byId(tenant + "-modal").classList.remove("ge-open");
      if (event.target.closest("[data-ge-page]")) {
        var direction = event.target.closest("[data-ge-page]").getAttribute("data-ge-page");
        var totalPages = Math.max(1, Math.ceil(filteredProducts().length / perPage));
        if (direction === "prev") state.page = Math.max(1, state.page - 1);
        if (direction === "next") state.page = Math.min(totalPages, state.page + 1);
        renderProducts();
      }
      if (event.target.closest("[data-ge-login]")) {
        state.account = byId(tenant + "-email").value.trim();
        save();
        renderAccount();
      }
      if (event.target.closest("[data-ge-ticket]")) {
        var text = byId(tenant + "-support").value.trim();
        if (text) {
          state.tickets.unshift("Ticket " + new Date().toLocaleString("es-MX") + ": " + text);
          byId(tenant + "-support").value = "";
          save();
          renderAccount();
        }
      }
      if (event.target.closest("[data-ge-checkout]")) {
        if (!state.account) {
          openDrawer(tenant + "-account");
          return;
        }
        state.purchases = Array.from(new Set(state.purchases.concat(state.cart)));
        state.cart = [];
        save();
        render();
        closeDrawer(tenant + "-cart");
        openDrawer(tenant + "-account");
      }
    });

    root.addEventListener("input", function (event) {
      if (event.target.id === tenant + "-search") {
        state.page = 1;
        renderProducts();
      }
      if (event.target.getAttribute("data-ge-font-test")) {
        var testerId = tenant + "-tester-" + event.target.getAttribute("data-ge-font-test");
        if (byId(testerId)) byId(testerId).textContent = event.target.value;
      }
    });

    root.addEventListener("change", function (event) {
      if (event.target.id === tenant + "-sort") {
        state.page = 1;
        renderProducts();
      }
      if (event.target.id === tenant + "-docs" || event.target.id === tenant + "-shipping") renderCart();
    });
  }

  window.GotoEcommerce = { mount: mount };
})();
