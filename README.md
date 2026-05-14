# NeoBuy Marketplace

A complete multi-role marketplace platform built with a static HTML/CSS/JavaScript frontend and a Node.js Express backend with JSON file storage.

## Workspace Overview

This workspace contains:
- `NeoBuy/Neobuy.html` — Marketplace frontend
- `neobuy-backend/` — Express backend and JSON storage
- `index.html`, `style.css`, `script.js`, and `server.js` — legacy root website files that are not part of NeoBuy

## NeoBuy Features

- **Buyer platform**: signup, login, browse products, purchase with NeoPoints, view order history
- **Seller platform**: signup, login, submit products for approval, track orders and revenue
- **Admin dashboard**: manage buyers and sellers, approve/reject products, credit points, view stats
- **Product images**: sellers can submit multiple image URLs per product
- **Review system**: buyers who purchased a product can leave 1-5 star ratings and optional reviews
- **Average ratings**: product overview shows average score and review count
- **Data persistence**: all marketplace data stored in JSON files

## Project Structure

```
NeoBuy/
├── Neobuy.html                    # Marketplace frontend (single HTML file)
└── neobuy-backend/
    ├── server.js                  # Express server entry point
    ├── package.json               # Node.js dependencies
    ├── utils/
    │   └── jsonStorage.js         # JSON file I/O utilities
    ├── routes/
    │   ├── buyers.js              # Buyer signup/login routes
    │   ├── sellers.js             # Seller signup/login routes
    │   ├── products.js            # Product routes, approvals, reviews
    │   ├── orders.js              # Order processing routes
    │   └── admin.js               # Admin management routes
    └── data/
        ├── buyers.json            # Buyer accounts
        ├── sellers.json           # Seller accounts
        ├── approvedProducts.json  # Live marketplace products
        ├── pendingProducts.json   # Products awaiting approval
        └── orders.json            # Purchase history
```

## Quick Start

### 1. Run the Backend

```bash
cd neobuy-backend
npm install
npm start
```

The backend API runs on `http://localhost:3000/api`.

### 2. Open the Frontend

Open `NeoBuy/Neobuy.html` in your browser using either:
- **VS Code Live Server**, or
- **Local server**: `python -m http.server 5500` and visit `http://localhost:5500/NeoBuy/Neobuy.html`

## User Roles

### Buyer
- Sign up with username/password, name, grade/section, GEMS account
- Browse approved products
- Purchase with NeoPoints
- View order history

### Seller
- Sign up with username/password
- Submit products for admin approval
- Track approved products, orders, and revenue

### Admin
- Login with password: `NeoAdmin123`
- View buyer and seller data
- Approve/reject pending products
- Credit or adjust buyer NeoPoints
- Delete users and products
- View marketplace statistics
- Reset all marketplace data

## API Endpoints

### Buyers
- `POST /api/buyers/signup`
- `POST /api/buyers/login`

### Sellers
- `POST /api/sellers/signup`
- `POST /api/sellers/login`

### Products
- `GET /api/products`
- `POST /api/products/submit`
- `GET /api/products/pending`
- `POST /api/products/approve`
- `POST /api/products/reject`
- `POST /api/products/reviews`
- `GET /api/products/:productId/reviews`

### Orders
- `POST /api/orders/buy`
- `GET /api/orders`

### Admin
- `POST /api/admin/login`
- `GET /api/admin/buyers`
- `GET /api/admin/sellers`
- `POST /api/admin/credit-points`
- `POST /api/admin/adjust-points`
- `DELETE /api/admin/delete-buyer/:username`
- `DELETE /api/admin/delete-seller/:username`
- `DELETE /api/admin/remove-product/:id`
- `POST /api/admin/reset-data`
- `GET /api/stats`

## Notes

- Passwords are stored in plain text for demonstration only
- Buyers start with 0 NeoPoints
- Products require admin approval before appearing in the marketplace
- Reviews are only allowed for buyers who have purchased the product
- Product images are supplied as URL entries in the seller submission form

## Development

- Edit `NeoBuy/Neobuy.html` for frontend behavior and UI
- Edit `neobuy-backend/routes/` for backend logic
- Data is stored in `neobuy-backend/data/`

---

**Note:** The active marketplace project is in `NeoBuy/` and `neobuy-backend/`. The root folder also contains unrelated legacy website files.
