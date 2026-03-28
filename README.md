# Pawar's Jersey Hub

A simple multi-page e-commerce website for IPL jerseys, built with HTML, CSS, and vanilla JavaScript.

## Folder structure

```
Website/
├── index.html          # Homepage
├── products.html       # Product listing (all 10 jerseys)
├── product-detail.html # Product detail (?id=P001 etc.)
├── cart.html          # Cart
├── checkout.html      # Checkout
├── payment.html       # Payment
├── thank-you.html     # Thank you / order confirmation
├── signin.html        # Sign in
├── signup.html        # Sign up
├── contact.html       # Contact us
├── README.md
├── css/
│   └── style.css      # Main stylesheet
└── js/
    ├── firebase-config.js  # Firebase web config (paste keys from Firebase Console)
    └── script.js           # Product data, cart, Firebase auth, leads
```

## How to run

Open `index.html` in a browser (double-click or use “Open with Live Server” in VS Code). No build step required.

## Features

- **Theme:** IPL jerseys store – brand: Pawar's Jersey Hub
- **Pages:** Home, Products, Product detail, Cart, Checkout, Payment, Thank you, Sign in, Sign up, Contact
- **Products:** 10 IPL jerseys with product_id, team name, jersey name, price, placeholder image, description, sizes
- **Cart:** Stored in `localStorage`; persists across pages
- **Auth:** Firebase Authentication (email/password); configure `js/firebase-config.js` and enable Email/Password + authorized domains in Firebase Console
- **Contact:** Form creates a unique `lead_id` on submit; stored in `localStorage`
- **Funnel:** Listing → Product → Cart → Checkout → Payment → Thank you

## GA4 readiness

Elements use unique IDs, clear class names, and data attributes for easier tracking:

- `data-product_id`, `data-product_name`, `data-price` on product cards and cart items
- `data-cta` on buttons and links (e.g. `add_to_cart`, `proceed_checkout`)
- `data-step` for funnel steps (e.g. `product_detail`, `checkout_form`, `thank_you`)

You can add GA4 tags later using these attributes.
