# NeoBuy Marketplace

A complete marketplace platform with buyer, seller, and admin roles. Built with a static HTML/CSS/JavaScript frontend and a Node.js Express backend with JSON file storage.

## Features

- **Buyer Platform**: Signup, login, browse products, purchase with NeoPoints, view order history
- **Seller Platform**: Signup, login, submit products for approval, track sales and orders
- **Admin Dashboard**: Manage buyers and sellers, approve/reject products, credit points, view stats
- **Real-time Stats**: Homepage displays live marketplace counts (refreshes hourly)
- **Authentication**: Secure login with username and password validation
- **Data Persistence**: All data stored server-side in JSON files

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
    │   ├── products.js            # Product routes (submit/approve/reject)
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

### 1. Start the Backend

Open a terminal and run:

```bash
cd neobuy-backend
npm install
npm start
```

The backend API runs on `http://localhost:3000/api`

### 2. Open the Frontend

Open `NeoBuy/Neobuy.html` in your browser using:
- **VS Code Live Server** extension, OR
- **Local server**: `python -m http.server 5500`, then visit `http://localhost:5500/NeoBuy/Neobuy.html`

## User Roles

### Buyer
- Sign up with username, password, real name, grade & section, GEMS account
- Start with 0 NeoPoints
- Browse approved products
- Purchase products using NeoPoints
- View purchase history

### Seller
- Sign up with username and password
- Submit products for admin approval
- View pending and approved products
- Track orders and revenue

### Admin
- Login with password: `NeoAdmin123`
- View all buyers and sellers with identity information
- Credit/adjust buyer NeoPoints
- Approve or reject pending products
- Delete users and products
- View marketplace statistics
- Reset all data

## API Endpoints

### Buyers
- `POST /api/buyers/signup` — create buyer account
- `POST /api/buyers/login` — buyer login

### Sellers
- `POST /api/sellers/signup` — create seller account
- `POST /api/sellers/login` — seller login

### Products
- `GET /api/products` — get approved products
- `POST /api/products/submit` — seller submits product
- `GET /api/products/pending` — get pending products (admin)
- `POST /api/products/approve` — approve product (admin)
- `POST /api/products/reject` — reject product (admin)

### Orders
- `POST /api/orders/buy` — buyer purchases product
- `GET /api/orders` — get all orders

### Admin
- `POST /api/admin/login` — admin login
- `GET /api/admin/buyers` — list all buyers
- `GET /api/admin/sellers` — list all sellers
- `POST /api/admin/credit-points` — add points to buyer
- `POST /api/admin/adjust-points` — adjust buyer points
- `DELETE /api/admin/delete-buyer/:username` — remove buyer
- `DELETE /api/admin/delete-seller/:username` — remove seller
- `DELETE /api/admin/remove-product/:id` — remove product
- `POST /api/admin/reset-data` — reset all data
- `GET /api/stats` — marketplace statistics

### Stats
- `GET /api/stats` — get buyer/seller/product/order counts

## Authentication

- Buyer/Seller: Username and password (exact match required)
- Admin: Password only (`NeoAdmin123`)
- Sessions stored in browser memory (not localStorage) for security

## Data Storage

All data persists in JSON files in `neobuy-backend/data/`:
- Buyer account info, GEMS accounts, NeoPoints balance
- Seller account info and products
- Approved and pending products
- Order history with buyer and seller information

## Notes

- This project uses plain-text passwords for demonstration only
- New buyers start with 0 NeoPoints
- Products require admin approval before appearing in the marketplace
- Admin can manually credit or adjust buyer NeoPoints
- Data persists across page refreshes and browser sessions
- Homepage marketplace stats refresh automatically every hour

## Development

To modify the project:

1. **Frontend**: Edit `NeoBuy/Neobuy.html` (HTML/CSS/JavaScript in one file)
2. **Backend**: Edit files in `neobuy-backend/routes/` and restart the server
3. **Data**: Manually edit JSON files in `neobuy-backend/data/` if needed (stop server first)
