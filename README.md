# Fashion Store — Premium E-Commerce Platform

A full-featured, production-ready e-commerce marketplace built with vanilla **HTML, CSS, JavaScript**, and **Firebase**. Designed for the Egyptian market with a modern pink-themed UI, glassmorphism aesthetics, and responsive design.

<p align="center">
  <img src="screenshots/01-home-full.png" alt="Fashion Store Homepage" width="80%" />
</p>

---

## Features

### Customer Experience
| Feature | Description |
|---------|-------------|
| Product Catalog | Browse dresses, bags, and accessories with category filters |
| Search | Real-time product search by name |
| Product Detail | Dedicated product page with image gallery, ratings, and related items |
| Shopping Cart | Persistent cart with localStorage, quantity controls, and checkout |
| Wishlist | Save and manage favorite products |
| Ratings & Reviews | 1–5 star rating system for authenticated users |
| User Authentication | Google Sign-In via Firebase Auth |
| User Profile | Order history, wishlist, address management, and settings |

### Admin Panel
| Feature | Description |
|---------|-------------|
| Dashboard | Overview with quick links to all admin tools |
| Product Management | Add, edit, delete products with name, price, category, images |
| Stock Control | Toggle product availability (In Stock / Out of Stock) |
| Order Management | View new/pending/completed/cancelled orders, update status |
| Security | Google Sign-In restricted to admin email addresses |

---

## Screenshots

| Page | Preview |
|------|---------|
| **Homepage** — Product grid, hero section, category filters | <img src="screenshots/02-home-viewport.png" alt="Homepage" width="400"/> |
| **Product Detail** — Gallery, ratings, add to cart | <img src="screenshots/03-product-page.png" alt="Product Detail" width="400"/> |
| **Organization** — Company/team landing page | <img src="screenshots/04-organization-page.png" alt="Organization Page" width="400"/> |
| **User Profile** — Orders, wishlist, settings | <img src="screenshots/05-profile-page.png" alt="Profile Page" width="400"/> |
| **Admin Login** — Google Sign-In gateway | <img src="screenshots/06-admin-login.png" alt="Admin Login" width="400"/> |
| **Add Products** — Admin product creation form | <img src="screenshots/07-admin-add-products.png" alt="Add Products" width="400"/> |
| **Products Manager** — Edit, delete, toggle stock | <img src="screenshots/08-admin-products-manager.png" alt="Products Manager" width="400"/> |
| **Orders Manager** — View and manage orders | <img src="screenshots/09-admin-orders.png" alt="Orders Manager" width="400"/> |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Backend** | Firebase Authentication + Realtime Database |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts — Cormorant Garamond, Outfit |
| **Animations** | CSS keyframes, 3D parallax, glassmorphism |
| **Hosting** | Netlify, Vercel, or any static host |

---

## Project Structure

```
fashion-store/
├── index.html                  # Main storefront
├── product.html                # Product detail page
├── style.css                   # Global styles (2649 lines)
├── script.js                   # Client-side logic (1142 lines)
├── firebase-config.js          # Firebase config template
├── firebase-rules.json         # Database security rules
│
├── screenshots/                # Screenshots for README
├── resources/                  # Static assets (favicon, etc.)
│
├── profile/
│   └── index.html              # User profile page
│
├── organization/
│   ├── index.html              # Company/team landing page
│   ├── style.css
│   ├── script.js
│   └── resources/              # Team member photos
│
├── admin/
│   ├── index.html              # Admin login + dashboard
│   ├── script.js
│   ├── app.js
│   ├── addProducts/            # Add new products
│   ├── productsManager/        # Manage products CRUD
│   └── adminOrders/            # Manage orders CRUD
```

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A Firebase project (free tier)

### Installation

```bash
git clone https://github.com/MoaazBesher/fashionStore.git
cd fashionStore
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Google Sign-In
4. Enable **Realtime Database**
5. Copy your Firebase config and replace in these files:
   - `script.js`
   - `admin/index.html`
   - `admin/addProducts/index.html`
   - `admin/productsManager/index.html`
   - `admin/adminOrders/index.html`

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

6. Deploy the security rules from `firebase-rules.json` to your Firebase Realtime Database

### Run Locally

```bash
# VS Code Live Server
npx live-server --port=5500

# OR Python
python -m http.server 8000

# OR PHP
php -S localhost:8000
```

---

## Responsive Breakpoints

| Device | Breakpoint |
|--------|------------|
| Desktop | > 992px |
| Tablet | 768px – 992px |
| Mobile | 480px – 768px |
| Small Mobile | < 480px |

---

## Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#db2777` | Main accent, buttons |
| Primary Dark | `#be185d` | Hover states |
| Primary Light | `#fdf2f8` | Backgrounds |
| Secondary | `#1e293b` | Text, headings |
| Success | `#10b981` | In stock, positive actions |
| Error | `#ef4444` | Errors, delete |

### Typography
- **Headings:** Cormorant Garamond (serif, elegant)
- **Body:** Outfit (sans-serif, modern)

---

## Admin Access

Admin login is restricted to authorized email addresses. To add or modify admin emails, update the `adminEmails` array in `admin/app.js`.

---

## Developers

| Name | Role | Contact |
|------|------|---------|
| Moaaz Ashraf | Backend Developer | [GitHub](https://github.com/MoaazBesher) |
| Moaz Hany | Frontend Developer | — |

Built with ❤️ by **Goats Development**

---

## License

This project is licensed under the MIT License.

---

## Support

For issues and feature requests, please open an issue on [GitHub](https://github.com/MoaazBesher/fashionStore/issues).
