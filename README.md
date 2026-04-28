# Fashion Store - E-Commerce Website

A modern, responsive e-commerce website built with HTML, CSS, JavaScript, and Firebase. Features a beautiful design with pink theme, user authentication, shopping cart, wishlist, admin dashboard, and more.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen.svg)

---

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog** - Browse dresses, bags, and accessories
- 🔍 **Search & Filter** - Find products by category
- ❤️ **Wishlist** - Save favorite products
- 🛒 **Shopping Cart** - Add/remove products, quantity management
- 👤 **User Authentication** - Google Sign-In & Email/Password
- 👤 **User Profile** - Manage personal info, addresses, orders
- ⭐ **Product Ratings** - View ratings and reviews

### Admin Features
- 📊 **Dashboard** - Overview of store statistics
- ➕ **Add Products** - Create new products with images
- ✏️ **Edit Products** - Update product details
- 🗑️ **Delete Products** - Remove products
- 📦 **Manage Orders** - View and update order status
- 🔄 **Stock Management** - Toggle product availability

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Firebase (Auth, Realtime Database) |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts (Poppins) |
| **Hosting** | Netlify / Vercel / Any static host |

---

## 📁 Project Structure

```
e-commerce-website/
├── index.html              # Main store page
├── style.css              # Main stylesheet
├── script.js              # Main JavaScript
├── README.md              # This file
│
├── resources/             # Images & assets
│   └── boutique.png
│
├── profile/              # User profile page
│   └── index.html
│
├── organization/          # Company team page
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── resources/
│
└── admin/               # Admin dashboard
    ├── index.html        # Admin login
    ├── script.js
    ├── addProducts/     # Add new products
    ├── productsManager/ # Manage products
    └── adminOrders/     # Manage orders
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A Firebase project (free tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/e-commerce-website.git
cd e-commerce-website
```

2. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable **Authentication** (Google & Email/Password)
   - Enable **Realtime Database**
   - Copy your config

3. **Configure Firebase**
   - Open `script.js`
   - Replace the `firebaseConfig` object with your project credentials

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

4. **Set Database Rules**
```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "orders": {
      ".indexOn": ["userId"]
    }
  }
}
```

5. **Run locally**
```bash
# Using VS Code Live Server
# Or using Python
python -m http.server 8000
# Or using PHP
php -S localhost:8000
```

---

## 📱 Responsive Design

| Device | Breakpoint |
|--------|------------|
| Desktop | > 992px |
| Tablet | 768px - 992px |
| Mobile | 480px - 768px |
| Small Mobile | < 480px |

---

## 🔧 Key Features Implementation

### Product Display
- Lazy loading images with fallback
- Category filtering (Dress, Bag, Accessory)
- Search functionality
- Product modal with image gallery

### Shopping Cart
- LocalStorage persistence
- Quantity adjustment
- Real-time total calculation
- Checkout form with validation

### User Authentication
- Google Sign-In
- Email/Password Sign-In
- Persistent sessions
- Profile management

### Admin Dashboard
- Product CRUD operations
- Order management
- Stock control

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #e91e63 | Main accent, buttons |
| Primary Dark | #c2185b | Hover states |
| Primary Light | #fce4ec | Backgrounds |
| Secondary | #212121 | Text, headers |
| Success | #4caf50 | Positive actions |
| Error | #f44336 | Errors, delete |

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Headings**: 700-900 weight
- **Body**: 400-500 weight

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developers

| Name | Role | Profile |
|------|------|---------|
| Moaaz Ashraf | Backend Developer | [LinkedIn](https://www.linkedin.com/in/moaaz-besher) |
| Moaz Hany | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/moaz-hany-6ab32b345) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues and feature requests, please open an [issue](https://github.com/your-username/e-commerce-website/issues).

---

<p align="center">Made with ❤️ by <a href="https://github.com/your-username">Goats Development</a></p>
