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
  LEADS: 'pawar_jersey_leads',
  ORDER_ID: 'pawar_jersey_last_order_id',
  LAST_ORDER_DATA: 'pawar_jersey_last_order_data',
  /** Persisted Firebase UID for GTM (Custom JS / localStorage variable). Cleared on sign-out. */
  USER_ID: 'pawar_jersey_user_id'
};

// ========== GA4 dataLayer (GTM) – e-commerce & conversion events ==========
window.dataLayer = window.dataLayer || [];

var GA4_CURRENCY = 'INR';

/**
 * Build GA4 ecommerce item from product/cart item (recommended item params)
 */
function ga4Item(p, index, quantity) {
  var qty = quantity === undefined ? (p.quantity || 1) : quantity;
  return {
    item_id: p.product_id,
    item_name: p.product_name,
    price: Number(p.price),
    quantity: Number(qty),
    index: index === undefined ? 0 : index,
    item_category: p.category || 'IPL Jersey',
    item_brand: p.team || ''
  };
}

/**
 * Push ecommerce event and clear previous ecommerce (GA4 best practice)
 */
function pushDataLayer(obj) {
  // #region agent log
  if (obj && obj.ecommerce && obj.ecommerce.items) {
    fetch('http://127.0.0.1:7249/ingest/c0390aac-679d-466b-a6b9-5887e1436b83',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b26670'},body:JSON.stringify({sessionId:'b26670',location:'script.js:pushDataLayer',message:'dataLayer ecommerce push',data:{event:obj.event,itemsLength:obj.ecommerce.items.length,itemIds:obj.ecommerce.items.map(function(i){return i.item_id;})},timestamp:Date.now(),hypothesisId:'H1'})}).catch(function(){});
  }
  // #endregion
  window.dataLayer.push(obj);
}

// ========== GA / GTM: persistent user_id (Firebase UID) ==========
var lastSyncedAnalyticsUserId = undefined;
var gtagUserIdPollTimer = null;

function readStoredAnalyticsUserId() {
  try {
    var v = localStorage.getItem(STORAGE_KEYS.USER_ID) || localStorage.getItem('user_id');
    return v && String(v).trim() ? String(v).trim() : '';
  } catch (e) {
    return '';
  }
}

function persistAnalyticsUserIdToStorage(uid) {
  var v = uid && String(uid).trim() ? String(uid).trim() : '';
  if (!v) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_ID, v);
    localStorage.setItem('user_id', v);
  } catch (e) {}
}

function clearAnalyticsUserIdStorage() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem('user_id');
  } catch (e) {}
}

function tryGtagUserIdPoll(uid) {
  var attempts = 0;
  if (gtagUserIdPollTimer) {
    clearInterval(gtagUserIdPollTimer);
    gtagUserIdPollTimer = null;
  }
  gtagUserIdPollTimer = setInterval(function () {
    attempts++;
    if (typeof window.gtag === 'function') {
      clearInterval(gtagUserIdPollTimer);
      gtagUserIdPollTimer = null;
      window.gtag('set', { user_id: uid || '' });
    } else if (attempts >= 40) {
      clearInterval(gtagUserIdPollTimer);
      gtagUserIdPollTimer = null;
    }
  }, 100);
}

/**
 * Pushes user_id early for GTM/GA4. Named event so you can add a trigger in GTM:
 * Custom Event = user_id_available, and map user_id to GA4 Configuration → user_id.
 */
function pushAnalyticsUserIdToDataLayer(uid) {
  var v = uid && String(uid).trim() ? String(uid).trim() : '';
  if (!v) return;
  pushDataLayer({ event: 'user_id_available', user_id: v });
  tryGtagUserIdPoll(v);
}

function pushAnalyticsUserIdCleared() {
  pushDataLayer({ event: 'user_id_cleared', user_id: '' });
  tryGtagUserIdPoll(null);
}

(function bootstrapAnalyticsUserIdFromStorage() {
  var stored = readStoredAnalyticsUserId();
  if (!stored) return;
  lastSyncedAnalyticsUserId = stored;
  pushAnalyticsUserIdToDataLayer(stored);
})();

function syncAnalyticsUserIdFromAuth(fbUser) {
  var mapped = mapFirebaseUser(fbUser);
  if (mapped && mapped.user_id) {
    persistAnalyticsUserIdToStorage(mapped.user_id);
    if (lastSyncedAnalyticsUserId !== mapped.user_id) {
      lastSyncedAnalyticsUserId = mapped.user_id;
      pushAnalyticsUserIdToDataLayer(mapped.user_id);
    }
  } else {
    clearAnalyticsUserIdStorage();
    if (typeof lastSyncedAnalyticsUserId === 'string') {
      pushAnalyticsUserIdCleared();
    }
    lastSyncedAnalyticsUserId = null;
  }
}

var analyticsAuthListenerRegistered = false;

function registerAnalyticsAuthSync() {
  if (analyticsAuthListenerRegistered || !pawarFirebaseAuth) return;
  analyticsAuthListenerRegistered = true;
  pawarFirebaseAuth.onAuthStateChanged(syncAnalyticsUserIdFromAuth);
}

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

// ========== Auth (Firebase) ==========
/**
 * Normalize email for Firebase email/password sign-in.
 */
function normalizeAuthEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Generate unique ID for user or lead
 */
function generateId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

function isFirebaseConfigured() {
  var c = typeof window !== 'undefined' && window.FIREBASE_CONFIG;
  if (!c || !c.apiKey || !c.projectId) return false;
  if (c.apiKey === 'YOUR_API_KEY' || c.projectId === 'YOUR_PROJECT_ID') return false;
  return true;
}

var pawarFirebaseAuth = null;

function initFirebaseAuth() {
  if (!isFirebaseConfigured()) return false;
  if (typeof firebase === 'undefined') {
    console.warn('Pawar Jersey Hub: Firebase SDK not loaded. Add firebase scripts before script.js.');
    return false;
  }
  if (!firebase.apps.length) {
    firebase.initializeApp(window.FIREBASE_CONFIG);
  }
  pawarFirebaseAuth = firebase.auth();
  pawarFirebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function () {});
  try {
    localStorage.removeItem('pawar_jersey_users');
    localStorage.removeItem('pawar_jersey_current_user');
  } catch (e) {}
  registerAnalyticsAuthSync();
  return true;
}

initFirebaseAuth();

function mapFirebaseUser(fbUser) {
  if (!fbUser) return null;
  return {
    user_id: fbUser.uid,
    email: normalizeAuthEmail(fbUser.email || ''),
    name: (fbUser.displayName || '').trim()
  };
}

function mapFirebaseAuthError(err) {
  var code = err && err.code ? err.code : '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Use Sign In with the same email and password—do not create another account.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. If you already created an account, use Sign In (not Sign Up).';
    case 'auth/unauthorized-domain':
      return 'This site’s domain is not allowed. In Firebase Console → Authentication → Settings → Authorized domains, add your exact hostname (e.g. yourname.github.io). Do not include https or paths.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is disabled. In Firebase Console → Authentication → Sign-in method, enable Email/Password.';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'Invalid API key. Check js/firebase-config.js matches your Firebase project’s Web app config.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/requires-recent-login':
      return 'For security, sign out, sign in again, then try deleting your account.';
    default:
      return (err && err.message) || 'Something went wrong. Please try again.';
  }
}

/**
 * Sign up (Firebase). Signs the user out after creation so they complete Sign In on the next page.
 * @returns {Promise<{success:boolean,message?:string,user?:object}>}
 */
function signUp(email, password, name) {
  if (!pawarFirebaseAuth) {
    return Promise.resolve({
      success: false,
      message: 'Firebase is not configured. Paste your web app keys in js/firebase-config.js (see file comments).'
    });
  }
  var normalized = normalizeAuthEmail(email);
  if (!normalized) {
    return Promise.resolve({ success: false, message: 'Email is required.' });
  }
  return pawarFirebaseAuth
    .createUserWithEmailAndPassword(normalized, password)
    .then(function (cred) {
      var u = cred.user;
      if (name && u) {
        return u.updateProfile({ displayName: name }).then(function () {
          return cred;
        });
      }
      return cred;
    })
    .then(function (cred) {
      var mapped = mapFirebaseUser(cred.user);
      return pawarFirebaseAuth.signOut().then(function () {
        return { success: true, user: mapped };
      });
    })
    .catch(function (err) {
      return { success: false, message: mapFirebaseAuthError(err) };
    });
}

/**
 * Sign in (Firebase)
 * @returns {Promise<{success:boolean,message?:string,user?:object}>}
 */
function signIn(email, password) {
  if (!pawarFirebaseAuth) {
    return Promise.resolve({
      success: false,
      message: 'Firebase is not configured. Paste your web app keys in js/firebase-config.js.'
    });
  }
  var normalized = normalizeAuthEmail(email);
  if (!normalized) {
    return Promise.resolve({ success: false, message: 'Email is required.' });
  }
  return pawarFirebaseAuth
    .signInWithEmailAndPassword(normalized, password)
    .then(function (cred) {
      return { success: true, user: mapFirebaseUser(cred.user) };
    })
    .catch(function (err) {
      return { success: false, message: mapFirebaseAuthError(err) };
    });
}

/**
 * Current Firebase user as { user_id, email, name } or null
 */
function getCurrentUser() {
  if (!pawarFirebaseAuth) return null;
  return mapFirebaseUser(pawarFirebaseAuth.currentUser);
}

/**
 * Sign out
 * @returns {Promise<void>}
 */
function signOut() {
  if (!pawarFirebaseAuth) return Promise.resolve();
  return pawarFirebaseAuth.signOut();
}

/**
 * Delete Firebase account (requires recent sign-in; may fail with auth/requires-recent-login)
 * @returns {Promise<{success:boolean,message?:string}>}
 */
function deleteAccount() {
  if (!pawarFirebaseAuth || !pawarFirebaseAuth.currentUser) {
    return Promise.resolve({ success: false, message: 'Not signed in.' });
  }
  return pawarFirebaseAuth.currentUser
    .delete()
    .then(function () {
      return { success: true };
    })
    .catch(function (err) {
      return { success: false, message: mapFirebaseAuthError(err) };
    });
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
    // GA4: view_item_list
    if (list.length > 0) {
      pushDataLayer({
        event: 'view_item_list',
        ecommerce: {
          currency: GA4_CURRENCY,
          item_list_id: 'product_listing',
          item_list_name: 'All IPL Jerseys',
          items: list.map(function (p, i) { return ga4Item(p, i, 1); })
        }
      });
    }
  }

  function bindListingAddToCart() {
    grid.querySelectorAll('.btn-add-cart[data-product_id]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product_id');
        const product = getProductById(productId);
        addToCart(productId, 1, 'M');
        updateCartCountInHeader();
        if (product) {
          pushDataLayer({
            event: 'add_to_cart',
            ecommerce: {
              currency: GA4_CURRENCY,
              value: product.price,
              items: [ga4Item(product, 0, 1)]
            }
          });
        }
        this.textContent = 'Added';
        this.disabled = true;
        setTimeout(function () {
          this.textContent = 'Add to Cart';
          this.disabled = false;
        }.bind(this), 1200);
      });
    });
  }

  // GA4: select_item – when user clicks through to product detail from listing
  grid.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="product-detail.html"]');
    if (!link) return;
    var card = e.target.closest('.product-listing-card');
    if (!card) return;
    var productId = card.getAttribute('data-product_id');
    var product = getProductById(productId);
    if (!product) return;
    var cards = grid.querySelectorAll('.product-listing-card');
    var index = Array.prototype.indexOf.call(cards, card);
    if (index < 0) index = 0;
    pushDataLayer({
      event: 'select_item',
      ecommerce: {
        item_list_id: 'product_listing',
        item_list_name: 'All IPL Jerseys',
        items: [ga4Item(product, index, 1)]
      }
    });
  });

  if (sortSelect) sortSelect.addEventListener('change', render);
  if (filterSelect) filterSelect.addEventListener('change', render);
  render();
}

// ========== Initialize when DOM is ready ==========
// Script is at end of body, so DOMContentLoaded may have already fired; run init immediately if so.
function initWhenReady() {
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
      // GA4: view_item
      pushDataLayer({
        event: 'view_item',
        ecommerce: {
          currency: GA4_CURRENCY,
          value: product.price,
          items: [ga4Item(product, 0, 1)]
        }
      });
    } else {
      productDetailContainer.innerHTML = '<p>Product not found.</p>';
    }
  }

  // Product listing page: filter, sort, render grid, bind add-to-cart
  if (document.getElementById('product-list-grid')) {
    initProductListingPage();
  }

  // GA4: select_item from homepage featured list (when user clicks a product to view detail)
  var featuredGrid = document.getElementById('featured-product-grid');
  if (featuredGrid) {
    featuredGrid.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="product-detail.html"]');
      if (!link) return;
      var card = e.target.closest('.product-card');
      if (!card) return;
      var productId = card.getAttribute('data-product_id');
      var product = getProductById(productId);
      if (!product) return;
      var cards = featuredGrid.querySelectorAll('.product-card');
      var index = Array.prototype.indexOf.call(cards, card);
      if (index < 0) index = 0;
      pushDataLayer({
        event: 'select_item',
        ecommerce: {
          item_list_id: 'featured',
          item_list_name: 'Featured Jerseys',
          items: [ga4Item(product, index, 1)]
        }
      });
    });
  }

  // Cart page: render cart and bind events
  const cartContainer = document.getElementById('cart-items-container');
  if (cartContainer) {
    renderCartPage(cartContainer);
  }

  // Checkout page: GA4 begin_checkout (when cart has items)
  if (document.getElementById('checkout-form')) {
    var checkoutCart = getCart();
    if (checkoutCart.length > 0) {
      pushDataLayer({
        event: 'begin_checkout',
        ecommerce: {
          currency: GA4_CURRENCY,
          value: getCartSubtotal(),
          items: checkoutCart.map(function (item, i) { return ga4Item(item, i, item.quantity); })
        }
      });
    }
  }

  // Checkout form submit + prefill name/email when signed in (Firebase restores session async)
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    if (pawarFirebaseAuth) {
      pawarFirebaseAuth.onAuthStateChanged(function (u) {
        var cu = mapFirebaseUser(u);
        if (!cu) return;
        var em = checkoutForm.querySelector('#checkout-email');
        var nm = checkoutForm.querySelector('#checkout-name');
        if (em && !em.value) em.value = cu.email;
        if (nm && !nm.value && cu.name) nm.value = cu.name;
      });
    }
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
    var signupCfgMsg = document.getElementById('signup-message');
    if (!isFirebaseConfigured() && signupCfgMsg) {
      signupCfgMsg.textContent =
        'Firebase is not configured. Paste your web app keys in js/firebase-config.js and enable Email/Password in Firebase Console.';
      signupCfgMsg.className = 'alert alert-error';
      signupCfgMsg.classList.remove('hidden');
    }
  }

  // Sign in form
  const signInForm = document.getElementById('sign-in-form');
  if (signInForm) {
    signInForm.addEventListener('submit', handleSignInSubmit);
  }

  // Sign-in page: Firebase auth state + Sign out / Delete account
  var signedInBlock = document.getElementById('signin-signed-in-block');
  if (signedInBlock && signInForm) {
    var signinCfgMsg = document.getElementById('signin-message');
    if (!isFirebaseConfigured() && signinCfgMsg) {
      signinCfgMsg.textContent =
        'Firebase is not configured. Paste your web app keys in js/firebase-config.js and enable Email/Password in Firebase Console.';
      signinCfgMsg.className = 'alert alert-error';
      signinCfgMsg.classList.remove('hidden');
    } else if (isFirebaseConfigured() && !pawarFirebaseAuth && signinCfgMsg) {
      signinCfgMsg.textContent =
        'Firebase SDK did not load. Check your network, disable blockers for this page, and ensure script tags load before js/script.js.';
      signinCfgMsg.className = 'alert alert-error';
      signinCfgMsg.classList.remove('hidden');
    } else if (pawarFirebaseAuth) {
      pawarFirebaseAuth.onAuthStateChanged(function (fbUser) {
        var currentUser = mapFirebaseUser(fbUser);
        if (currentUser) {
          signedInBlock.classList.remove('hidden');
          var emailEl = document.getElementById('signin-current-email');
          if (emailEl) emailEl.textContent = currentUser.email;
          signInForm.classList.add('hidden');
        } else {
          signedInBlock.classList.add('hidden');
          signInForm.classList.remove('hidden');
        }
      });
      var signOutLink = document.getElementById('signin-link-signout');
      if (signOutLink) {
        signOutLink.addEventListener('click', function (e) {
          e.preventDefault();
          signOut().then(function () {
            window.location.href = 'index.html';
          });
        });
      }
      var deleteLink = document.getElementById('signin-link-delete-account');
      if (deleteLink) {
        deleteLink.addEventListener('click', function (e) {
          e.preventDefault();
          if (!confirm('Permanently delete your account? This cannot be undone.')) return;
          deleteAccount().then(function (res) {
            if (res.success) {
              window.location.href = 'signin.html';
            } else {
              alert(res.message || 'Could not delete account. Sign in again and retry.');
            }
          });
        });
      }
    }
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // Thank you page: show order id and GA4 purchase
  const thankYouOrderId = document.getElementById('thank-you-order-id');
  if (thankYouOrderId) {
    thankYouOrderId.textContent = getLastOrderId() || 'N/A';
    var lastOrder = null;
    try {
      var raw = sessionStorage.getItem(STORAGE_KEYS.LAST_ORDER_DATA);
      if (raw) lastOrder = JSON.parse(raw);
    } catch (err) {}
    if (lastOrder && lastOrder.transaction_id) {
      pushDataLayer({
        event: 'purchase',
        ecommerce: {
          transaction_id: lastOrder.transaction_id,
          currency: GA4_CURRENCY,
          value: lastOrder.value,
          items: lastOrder.items || []
        }
      });
      sessionStorage.removeItem(STORAGE_KEYS.LAST_ORDER_DATA);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
  initWhenReady();
}

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
      const qtyEl = form.querySelector('#product-quantity') || form.querySelector('#qty');
      var qty = parseInt(qtyEl && qtyEl.value ? qtyEl.value : 1, 10) || 1;
      addToCart(product.product_id, qty, size ? size.value : 'M');
      pushDataLayer({
        event: 'add_to_cart',
        ecommerce: {
          currency: GA4_CURRENCY,
          value: product.price * qty,
          items: [ga4Item(product, 0, qty)]
        }
      });
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

  var subtotalNum = getCartSubtotal();
  pushDataLayer({
    event: 'view_cart',
    ecommerce: {
      currency: GA4_CURRENCY,
      value: subtotalNum,
      items: cart.map(function (item, i) { return ga4Item(item, i, item.quantity); })
    }
  });

  container.querySelectorAll('[data-cart-remove]').forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      var index = parseInt(this.getAttribute('data-cart-remove'), 10);
      var removed = cart[index];
      removeFromCart(index);
      if (removed) {
        pushDataLayer({
          event: 'remove_from_cart',
          ecommerce: {
            currency: GA4_CURRENCY,
            value: removed.price * removed.quantity,
            items: [ga4Item(removed, index, removed.quantity)]
          }
        });
      }
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
  var checkoutCart = getCart();
  if (checkoutCart.length > 0) {
    pushDataLayer({
      event: 'add_shipping_info',
      ecommerce: {
        currency: GA4_CURRENCY,
        value: getCartSubtotal(),
        items: checkoutCart.map(function (item, i) { return ga4Item(item, i, item.quantity); })
      }
    });
  }
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
  var orderCart = getCart();
  var orderValue = getCartSubtotal();
  setLastOrderId(orderId);
  sessionStorage.setItem(STORAGE_KEYS.LAST_ORDER_DATA, JSON.stringify({
    transaction_id: orderId,
    value: orderValue,
    items: orderCart.map(function (item, i) { return ga4Item(item, i, item.quantity); })
  }));
  clearCart();

  pushDataLayer({
    event: 'add_payment_info',
    ecommerce: {
      currency: GA4_CURRENCY,
      value: orderValue,
      payment_type: method || 'unknown',
      items: orderCart.map(function (item, i) { return ga4Item(item, i, item.quantity); })
    }
  });

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
    var loggedIn = getCurrentUser();
    var firebaseUid = loggedIn && loggedIn.user_id ? loggedIn.user_id : '';
    var q = 'order_id=' + encodeURIComponent(orderId) + '&timestamp=' + encodeURIComponent(timestamp) +
      '&email=' + encodeURIComponent(checkoutData.email) +
      '&full_name=' + encodeURIComponent(checkoutData.full_name) +
      '&city=' + encodeURIComponent(checkoutData.city) +
      '&firebase_uid=' + encodeURIComponent(firebaseUid);
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
  const msgEl = document.getElementById('signup-message') || form.querySelector('.form-message');
  if (!email || !password) {
    if (msgEl) {
      msgEl.textContent = 'Email and password are required.';
      msgEl.className = 'alert alert-error';
      msgEl.classList.remove('hidden');
    }
    return;
  }
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  signUp(email, password, name)
    .then(function (result) {
      if (submitBtn) submitBtn.disabled = false;
      if (result.success && msgEl) {
        msgEl.textContent = 'Account created! Redirecting to Sign In...';
        msgEl.className = 'alert alert-success';
        msgEl.classList.remove('hidden');
      } else if (msgEl && !result.success) {
        msgEl.textContent = result.message || 'Could not create account.';
        msgEl.className = 'alert alert-error';
        msgEl.classList.remove('hidden');
      }
      if (result.success) {
        var uid = result.user && result.user.user_id ? result.user.user_id : '';
        try {
          pushDataLayer({ event: 'sign_up', method: 'email', user_id: uid });
        } catch (dlErr) {}
        setTimeout(function () {
          window.location.href = 'signin.html';
        }, 1500);
      }
    })
    .catch(function (err) {
      if (submitBtn) submitBtn.disabled = false;
      if (msgEl) {
        msgEl.textContent = 'Something went wrong. Please try again.';
        msgEl.className = 'alert alert-error';
        msgEl.classList.remove('hidden');
      }
      if (typeof console !== 'undefined' && console.error) console.error(err);
    });
}

function handleSignInSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#signin-email')?.value?.trim();
  const password = form.querySelector('#signin-password')?.value;
  const msgEl = form.querySelector('.form-message');
  if (!email || !password) {
    if (msgEl) {
      msgEl.textContent = 'Email and password are required.';
      msgEl.className = 'alert alert-error';
      msgEl.classList.remove('hidden');
    }
    return;
  }
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  signIn(email, password).then(function (result) {
    if (submitBtn) submitBtn.disabled = false;
    if (!msgEl) {
      if (result.success) {
        persistAnalyticsUserIdToStorage(result.user.user_id);
        lastSyncedAnalyticsUserId = result.user.user_id;
        pushAnalyticsUserIdToDataLayer(result.user.user_id);
        pushDataLayer({ event: 'login', method: 'email', user_id: result.user.user_id });
        const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
        window.location.href = redirect;
      }
      return;
    }
    msgEl.classList.remove('hidden');
    if (result.success) {
      persistAnalyticsUserIdToStorage(result.user.user_id);
      lastSyncedAnalyticsUserId = result.user.user_id;
      pushAnalyticsUserIdToDataLayer(result.user.user_id);
      pushDataLayer({ event: 'login', method: 'email', user_id: result.user.user_id });
      const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
      window.location.href = redirect;
    } else {
      msgEl.textContent = result.message;
      msgEl.className = 'alert alert-error';
    }
  });
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
    pushDataLayer({ event: 'generate_lead', lead_id: result.lead_id });
    if (msgEl) { msgEl.textContent = 'Thank you! We have received your message.'; msgEl.className = 'alert alert-success'; }
    form.reset();
  }
}
