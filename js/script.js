/**
 * Pawar's Jersey Hub - Main JavaScript
 * Handles: product data, cart (localStorage), auth, leads, GA4-friendly attributes
 */

// ========== Google Sheet Order Log (optional) ==========
// Paste your Web App URL from Google Apps Script deployment to log orders to a Sheet.
// Leave empty to skip logging. See google-sheets/README.md for setup.
const ORDER_LOG_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxFi-EQoopfJJjt580unKbFioHP75dHpnOniXTlKTmgGLsWoz0fWIOMFOdTixodEkzk/exec';

// ========== Product Data (reusable across pages) – GA4-friendly ==========
const PRODUCTS = [
  {
    product_id: 'P001',
    team: 'Chennai Super Kings',
    product_name: 'CSK 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2499,
    original_price: 2999,
    image: 'https://placehold.co/400x500/FFD700/000?text=CSK+2025',
    description: 'Official Chennai Super Kings 2025 fan jersey. Iconic yellow with premium breathable fabric. Lightweight and durable for match day.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    in_stock: true
  },
  {
    product_id: 'P002',
    team: 'Mumbai Indians',
    product_name: 'MI 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2499,
    original_price: 2999,
    image: 'https://placehold.co/400x500/004c93/fff?text=MI+2025',
    description: 'Official Mumbai Indians 2025 home jersey. Premium blue fabric, breathable and comfortable. Wear your pride.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    in_stock: true
  },
  {
    product_id: 'P003',
    team: 'Royal Challengers Bengaluru',
    product_name: 'RCB 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2399,
    original_price: 2799,
    image: 'https://placehold.co/400x500/EC1C24/fff?text=RCB+2025',
    description: 'Official Royal Challengers Bengaluru 2025 jersey. Bold red design for bold fans. Official replica quality.',
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true
  },
  {
    product_id: 'P004',
    team: 'Kolkata Knight Riders',
    product_name: 'KKR 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2299,
    original_price: 2699,
    image: 'https://placehold.co/400x500/3D195B/fff?text=KKR+2025',
    description: 'Official Kolkata Knight Riders 2025 purple and gold jersey. Premium fit for the stands or the ground.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    in_stock: true
  },
  {
    product_id: 'P005',
    team: 'Rajasthan Royals',
    product_name: 'RR 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2299,
    original_price: 2699,
    image: 'https://placehold.co/400x500/E91E8C/fff?text=RR+2025',
    description: 'Official Rajasthan Royals 2025 pink jersey. Stand out in the stands with this comfortable, stylish replica.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    in_stock: true
  },
  {
    product_id: 'P006',
    team: 'Sunrisers Hyderabad',
    product_name: 'SRH 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2399,
    original_price: 2799,
    image: 'https://placehold.co/400x500/FF6600/000?text=SRH+2025',
    description: 'Official Sunrisers Hyderabad 2025 orange and black jersey. Comfortable, breathable, and built for fans.',
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true
  },
  {
    product_id: 'P007',
    team: 'Delhi Capitals',
    product_name: 'DC 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2399,
    original_price: 2799,
    image: 'https://placehold.co/400x500/0078D4/fff?text=DC+2025',
    description: 'Official Delhi Capitals 2025 blue home jersey. Official replica with premium fabric and modern fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true
  },
  {
    product_id: 'P008',
    team: 'Punjab Kings',
    product_name: 'PBKS 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2299,
    original_price: 2699,
    image: 'https://placehold.co/400x500/ED1C24/fff?text=PBKS+2025',
    description: 'Official Punjab Kings 2025 red jersey. For the loyal fan base. Durable and stylish.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    in_stock: true
  },
  {
    product_id: 'P009',
    team: 'Gujarat Titans',
    product_name: 'GT 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2499,
    original_price: 2999,
    image: 'https://placehold.co/400x500/0C2340/fff?text=GT+2025',
    description: 'Official Gujarat Titans 2025 navy blue jersey. New era, new style. Premium replica for every Titans fan.',
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true
  },
  {
    product_id: 'P010',
    team: 'Lucknow Super Giants',
    product_name: 'LSG 2025 Official Fan Jersey',
    category: 'IPL Jersey',
    price: 2399,
    original_price: 2799,
    image: 'https://placehold.co/400x500/00A651/fff?text=LSG+2025',
    description: 'Official Lucknow Super Giants 2025 green and blue jersey. Fresh and fierce. Official fan wear.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    in_stock: true
  }
];

// ========== Storage Keys ==========
const STORAGE_KEYS = {
  CART: 'pawar_jersey_cart',
  USERS: 'pawar_jersey_users',
  CURRENT_USER: 'pawar_jersey_current_user',
  LEADS: 'pawar_jersey_leads',
  ORDER_ID: 'pawar_jersey_last_order_id'
};

// ========== Cart (localStorage) ==========
/**
 * Get cart from localStorage. Returns array of { product_id, quantity, size, ...product }
 */
function getCart() {
  try {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

/**
 * Add item to cart. Merges with existing product+size line.
 */
function addToCart(productId, quantity = 1, size = 'M') {
  const product = PRODUCTS.find(p => p.product_id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.product_id === productId && item.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity, size });
  }
  saveCart(cart);
  updateCartCountInHeader();
}

/**
 * Remove item from cart by index
 */
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCountInHeader();
}

/**
 * Update quantity for cart item at index
 */
function updateCartQuantity(index, quantity) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = Math.max(1, parseInt(quantity, 10) || 1);
    saveCart(cart);
  }
  updateCartCountInHeader();
}

/**
 * Get total cart count (sum of quantities)
 */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Get cart subtotal
 */
function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Update cart count badge in header (call after DOM ready)
 */
function updateCartCountInHeader() {
  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }
}

// ========== Auth (localStorage) ==========
/**
 * Generate unique ID for user or lead
 */
function generateId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

/**
 * Get all users from localStorage
 */
function getUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Save users array
 */
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Sign up: create user with unique user_id, store in localStorage
 */
function signUp(email, password, name) {
  const users = getUsers();
  if (users.some(u => u.email === email)) {
    return { success: false, message: 'Email already registered.' };
  }
  const user = {
    user_id: generateId('user'),
    email,
    password,
    name: name || ''
  };
  users.push(user);
  saveUsers(users);
  return { success: true, user };
}

/**
 * Sign in: check email/password, set current user in localStorage
 */
function signIn(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: 'Invalid email or password.' };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return { success: true, user };
}

/**
 * Get current logged-in user
 */
function getCurrentUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Sign out
 */
function signOut() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// ========== Leads / Contact (localStorage) ==========
/**
 * Get all leads
 */
function getLeads() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Submit contact form: create lead with unique lead_id
 */
function submitLead(name, email, subject, message) {
  const lead = {
    lead_id: generateId('lead'),
    name,
    email,
    subject: subject || '',
    message,
    created_at: new Date().toISOString()
  };
  const leads = getLeads();
  leads.push(lead);
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  return { success: true, lead_id: lead.lead_id };
}

// ========== Order ID (for Thank You page) ==========
function setLastOrderId(orderId) {
  localStorage.setItem(STORAGE_KEYS.ORDER_ID, orderId);
}

function getLastOrderId() {
  return localStorage.getItem(STORAGE_KEYS.ORDER_ID) || '';
}

/**
 * Clear cart after successful order
 */
function clearCart() {
  saveCart([]);
  updateCartCountInHeader();
}

// ========== Helpers for rendering product cards (GA4-friendly) ==========
/**
 * Format price for display
 */
function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

/**
 * Get product by ID
 */
function getProductById(productId) {
  return PRODUCTS.find(p => p.product_id === productId) || null;
}

/**
 * Build product card HTML with data attributes for GA4 (homepage/featured - single CTA)
 */
function getProductCardHTML(product, ctaText = 'View Details') {
  const url = `product-detail.html?id=${encodeURIComponent(product.product_id)}`;
  return `
    <article class="product-card" data-product_id="${product.product_id}" data-product_name="${product.product_name}" data-price="${product.price}">
      <a href="${url}" data-cta="product_card_click">
        <img class="product-card-image" src="${product.image}" alt="${product.product_name}" loading="lazy" />
      </a>
      <div class="product-card-body">
        <a href="${url}" data-cta="product_card_click">
          <h3 class="product-card-title">${product.product_name}</h3>
        </a>
        <p class="product-card-team">${product.team}</p>
        <p class="product-card-price" data-price="${product.price}">${formatPrice(product.price)}</p>
        <a href="${url}" class="btn btn-primary" data-cta="view_product">${ctaText}</a>
      </div>
    </article>
  `;
}

/**
 * Build product listing page card: image, name, team, price, View Product + Add to Cart (tracking-friendly)
 */
function getProductListingCardHTML(product) {
  const url = `product-detail.html?id=${encodeURIComponent(product.product_id)}`;
  return `
    <article class="product-card product-listing-card" data-product_id="${product.product_id}" data-product_name="${product.product_name}" data-price="${product.price}" data-team="${product.team}" role="listitem">
      <a href="${url}" class="product-card-image-link" data-cta="view_product">
        <img class="product-card-image" src="${product.image}" alt="${product.product_name}" loading="lazy" />
      </a>
      <div class="product-card-body">
        <a href="${url}" class="product-card-title-link" data-cta="view_product">
          <h3 class="product-card-title">${product.product_name}</h3>
        </a>
        <p class="product-card-team" data-team="${product.team}">${product.team}</p>
        <p class="product-card-price" data-price="${product.price}">${formatPrice(product.price)}</p>
        <div class="product-card-actions">
          <a href="${url}" class="btn btn-primary btn-view-product" data-cta="view_product" data-product_id="${product.product_id}">View Product</a>
          <button type="button" class="btn btn-secondary btn-add-cart" data-cta="add_to_cart" data-product_id="${product.product_id}" data-product_name="${product.product_name}" data-price="${product.price}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Get unique team names from PRODUCTS (sorted) for filter dropdown
 */
function getUniqueTeams() {
  const teams = [...new Set(PRODUCTS.map(p => p.team))];
  return teams.sort();
}

/**
 * Apply sort and filter to product list
 */
function getFilteredAndSortedProducts(sortValue, teamFilter) {
  let list = teamFilter ? PRODUCTS.filter(p => p.team === teamFilter) : PRODUCTS.slice();
  if (sortValue === 'price_asc') list = list.slice().sort((a, b) => a.price - b.price);
  if (sortValue === 'price_desc') list = list.slice().sort((a, b) => b.price - a.price);
  return list;
}

/**
 * Render product listing grid and bind events (filter, sort, add to cart)
 */
function initProductListingPage() {
  const grid = document.getElementById('product-list-grid');
  const sortSelect = document.getElementById('sort-select');
  const filterSelect = document.getElementById('filter-team');
  const emptyEl = document.getElementById('product-listing-empty');
  if (!grid) return;

  // Populate team filter
  if (filterSelect) {
    const teams = getUniqueTeams();
    teams.forEach(team => {
      const opt = document.createElement('option');
      opt.value = team;
      opt.textContent = team;
      filterSelect.appendChild(opt);
    });
  }

  function render() {
    const sortValue = sortSelect ? sortSelect.value : 'default';
    const teamValue = filterSelect ? filterSelect.value : '';
    const list = getFilteredAndSortedProducts(sortValue, teamValue || null);
    grid.innerHTML = list.map(p => getProductListingCardHTML(p)).join('');
    if (emptyEl) {
      emptyEl.classList.toggle('hidden', list.length > 0);
    }
    bindListingAddToCart();
  }

  function bindListingAddToCart() {
    grid.querySelectorAll('.btn-add-cart[data-product_id]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product_id');
        addToCart(productId, 1, 'M');
        updateCartCountInHeader();
        this.textContent = 'Added';
        this.disabled = true;
        setTimeout(() => {
          this.textContent = 'Add to Cart';
          this.disabled = false;
        }, 1200);
      });
    });
  }

  if (sortSelect) sortSelect.addEventListener('change', render);
  if (filterSelect) filterSelect.addEventListener('change', render);
  render();
}

// ========== Initialize on DOM ready ==========
document.addEventListener('DOMContentLoaded', function () {
  updateCartCountInHeader();

  // Product detail: render product from ?id= and add to cart form
  const productDetailContainer = document.getElementById('product-detail-container');
  if (productDetailContainer) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = getProductById(id);
    if (product) {
      productDetailContainer.innerHTML = renderProductDetail(product);
      bindProductDetailEvents(productDetailContainer, product);
    } else {
      productDetailContainer.innerHTML = '<p>Product not found.</p>';
    }
  }

  // Product listing page: filter, sort, render grid, bind add-to-cart
  if (document.getElementById('product-list-grid')) {
    initProductListingPage();
  }

  // Cart page: render cart and bind events
  const cartContainer = document.getElementById('cart-items-container');
  if (cartContainer) {
    renderCartPage(cartContainer);
  }

  // Checkout form submit
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Payment form submit
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', handlePaymentSubmit);
  }

  // Sign up form
  const signUpForm = document.getElementById('signup-form');
  if (signUpForm) {
    signUpForm.addEventListener('submit', handleSignUpSubmit);
  }

  // Sign in form
  const signInForm = document.getElementById('sign-in-form');
  if (signInForm) {
    signInForm.addEventListener('submit', handleSignInSubmit);
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // Thank you page: show order id
  const thankYouOrderId = document.getElementById('thank-you-order-id');
  if (thankYouOrderId) {
    thankYouOrderId.textContent = getLastOrderId() || 'N/A';
  }
});

function renderProductDetail(product) {
  const sizesOptions = product.sizes.map(s => `
    <input type="radio" name="size" id="size-${s}" value="${s}" ${s === 'M' ? 'checked' : ''} data-step="size_select" data-size="${s}" data-product_id="${product.product_id}" />
    <label for="size-${s}" data-size="${s}">${s}</label>
  `).join('');
  return `
    <div class="product-detail-layout" id="product-detail-layout" data-product_id="${product.product_id}" data-product_name="${product.product_name}" data-price="${product.price}" data-team="${product.team}">
      <div class="product-detail-image-wrap">
        <img class="product-detail-image" id="product-detail-image" src="${product.image}" alt="${product.product_name}" data-product_id="${product.product_id}" />
      </div>
      <div class="product-detail-info" id="product-detail-info">
        <h1 class="product-detail-title" id="product-detail-title" data-product_name="${product.product_name}">${product.product_name}</h1>
        <p class="product-detail-team" id="product-detail-team" data-team="${product.team}">${product.team}</p>
        <p class="product-detail-price" id="product-detail-price" data-price="${product.price}">${formatPrice(product.price)}</p>
        <p class="product-detail-desc" id="product-detail-description">${product.description}</p>
        <form id="add-to-cart-form" class="product-detail-form" data-step="add_to_cart" data-product_id="${product.product_id}">
          <div class="size-selector" id="product-size-selector">
            <label class="size-selector-label">Size</label>
            <div class="size-options" id="product-size-options" role="group" aria-label="Jersey size">${sizesOptions}</div>
          </div>
          <div class="quantity-selector" id="product-quantity-selector">
            <label for="product-quantity" class="quantity-selector-label">Quantity</label>
            <input type="number" id="product-quantity" name="quantity" min="1" value="1" data-step="quantity" data-product_id="${product.product_id}" />
          </div>
          <div class="product-detail-actions">
            <button type="submit" class="btn btn-primary" id="product-add-to-cart" data-cta="add_to_cart" data-product_id="${product.product_id}" data-product_name="${product.product_name}" data-price="${product.price}">Add to Cart</button>
            <a href="cart.html" class="btn btn-secondary" id="product-view-cart" data-cta="view_cart">View Cart</a>
          </div>
        </form>
      </div>
    </div>
  `;
}

function bindProductDetailEvents(container, product) {
  const form = container.querySelector('#add-to-cart-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const size = form.querySelector('input[name="size"]:checked');
      const qty = form.querySelector('#qty');
      const qtyEl = form.querySelector('#product-quantity') || form.querySelector('#qty');
      addToCart(product.product_id, parseInt(qtyEl && qtyEl.value ? qtyEl.value : 1, 10) || 1, size ? size.value : 'M');
      window.location.href = 'cart.html';
    });
  }
}

function renderCartPage(container) {
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty" id="cart-empty-state" data-step="cart_empty">
        <p class="cart-empty-message">Your cart is empty.</p>
        <a href="products.html" class="btn btn-primary mt-2" id="cart-empty-shop-jerseys" data-cta="shop_now" data-link-type="primary">Shop Jerseys</a>
      </div>
    `;
    document.getElementById('cart-summary-box') && (document.getElementById('cart-summary-box').innerHTML = '');
    return;
  }

  let html = '';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item" data-product_id="${item.product_id}" data-product_name="${item.product_name}" data-price="${item.price}">
        <img class="cart-item-image" src="${item.image}" alt="${item.product_name}" />
        <div class="cart-item-details">
          <h3>${item.product_name}</h3>
          <p class="product-card-team">${item.team}</p>
          <p>Size: ${item.size}</p>
          <p class="cart-item-price">${formatPrice(item.price)} × ${item.quantity}</p>
        </div>
        <div>
          <label class="hidden" for="cart-qty-${index}">Quantity</label>
          <input type="number" id="cart-qty-${index}" data-cart-index="${index}" min="1" value="${item.quantity}" style="width: 60px; padding: 8px;" />
        </div>
        <div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
          <button type="button" class="btn btn-secondary mt-1" data-cart-remove="${index}" data-cta="remove_from_cart">Remove</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;

  const subtotal = getCartSubtotal();
  const summaryBox = document.getElementById('cart-summary-box');
  if (summaryBox) {
    summaryBox.innerHTML = `
      <div class="cart-summary">
        <div class="cart-summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div class="cart-summary-row cart-summary-total"><span>Total</span><span>${formatPrice(subtotal)}</span></div>
        <a href="checkout.html" class="btn btn-primary" style="width:100%; margin-top:1rem;" data-cta="proceed_checkout">Proceed to Checkout</a>
      </div>
    `;
  }

  container.querySelectorAll('[data-cart-remove]').forEach(btn => {
    btn.addEventListener('click', function () {
      removeFromCart(parseInt(this.getAttribute('data-cart-remove'), 10));
      renderCartPage(container);
    });
  });
  container.querySelectorAll('input[data-cart-index]').forEach(input => {
    input.addEventListener('change', function () {
      updateCartQuantity(parseInt(this.getAttribute('data-cart-index'), 10), this.value);
      renderCartPage(container);
    });
  });
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#checkout-name')?.value;
  const email = form.querySelector('#checkout-email')?.value;
  const address = form.querySelector('#checkout-address')?.value;
  const city = form.querySelector('#checkout-city')?.value;
  const pincode = form.querySelector('#checkout-pincode')?.value;
  if (!name || !email || !address || !city || !pincode) {
    alert('Please fill all required fields.');
    return;
  }
  sessionStorage.setItem('checkout_address', JSON.stringify({ name, email, address, city, pincode }));
  window.location.href = 'payment.html';
}

function handlePaymentSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const method = form.querySelector('input[name="payment_method"]:checked')?.value;
  if (!method) {
    alert('Please select a payment method.');
    return;
  }
  const orderId = 'ORD_' + Date.now();
  const timestamp = new Date().toISOString();
  setLastOrderId(orderId);
  clearCart();

  // Get checkout data (email, full name, city) from sessionStorage
  var checkoutData = { email: '', full_name: '', city: '' };
  try {
    var stored = sessionStorage.getItem('checkout_address');
    if (stored) {
      var parsed = JSON.parse(stored);
      checkoutData.email = parsed.email || '';
      checkoutData.full_name = parsed.name || '';
      checkoutData.city = parsed.city || '';
    }
  } catch (err) {}

  // Log order to Google Sheet if ORDER_LOG_WEB_APP_URL is set
  if (ORDER_LOG_WEB_APP_URL && typeof fetch !== 'undefined') {
    var q = 'order_id=' + encodeURIComponent(orderId) + '&timestamp=' + encodeURIComponent(timestamp) +
      '&email=' + encodeURIComponent(checkoutData.email) +
      '&full_name=' + encodeURIComponent(checkoutData.full_name) +
      '&city=' + encodeURIComponent(checkoutData.city);
    var url = ORDER_LOG_WEB_APP_URL + '?' + q;
    fetch(url, { mode: 'no-cors' }).catch(function () {}).finally(function () {
      window.location.href = 'thank-you.html';
    });
  } else {
    window.location.href = 'thank-you.html';
  }
}

function handleSignUpSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#signup-email')?.value?.trim();
  const password = form.querySelector('#signup-password')?.value;
  const name = form.querySelector('#signup-name')?.value?.trim();
  const msgEl = form.querySelector('.form-message');
  if (!email || !password) {
    if (msgEl) { msgEl.textContent = 'Email and password are required.'; msgEl.className = 'alert alert-error'; }
    return;
  }
  const result = signUp(email, password, name);
  if (result.success) {
    if (msgEl) { msgEl.textContent = 'Account created! Redirecting to Sign In...'; msgEl.className = 'alert alert-success'; }
    setTimeout(() => { window.location.href = 'signin.html'; }, 1500);
  } else {
    if (msgEl) { msgEl.textContent = result.message; msgEl.className = 'alert alert-error'; }
  }
}

function handleSignInSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#signin-email')?.value?.trim();
  const password = form.querySelector('#signin-password')?.value;
  const msgEl = form.querySelector('.form-message');
  if (!email || !password) {
    if (msgEl) { msgEl.textContent = 'Email and password are required.'; msgEl.className = 'alert alert-error'; }
    return;
  }
  const result = signIn(email, password);
  if (result.success) {
    const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
    window.location.href = redirect;
  } else {
    if (msgEl) { msgEl.textContent = result.message; msgEl.className = 'alert alert-error'; }
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#contact-name')?.value?.trim();
  const email = form.querySelector('#contact-email')?.value?.trim();
  const subject = form.querySelector('#contact-subject')?.value?.trim();
  const message = form.querySelector('#contact-message-body')?.value?.trim();
  const msgEl = form.querySelector('.form-message');
  if (!name || !email || !message) {
    if (msgEl) { msgEl.textContent = 'Name, email and message are required.'; msgEl.className = 'alert alert-error'; }
    return;
  }
  const result = submitLead(name, email, subject, message);
  if (result.success) {
    if (msgEl) { msgEl.textContent = 'Thank you! We have received your message (Lead ID: ' + result.lead_id + ').'; msgEl.className = 'alert alert-success'; }
    form.reset();
  }
}
