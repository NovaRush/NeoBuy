# NeoBuy Marketplace Backend

This folder contains the backend for the NeoBuy marketplace platform.

## Contents

- `server.js` — Express server entry point
- `package.json` — Node dependencies and scripts
- `package-lock.json` — locked dependency versions
- `utils/jsonStorage.js` — JSON file read/write helpers
- `routes/buyers.js` — buyer signup/login API routes
- `routes/sellers.js` — seller signup/login API routes
- `routes/products.js` — product submission, approval, and retrieval routes
- `routes/orders.js` — order processing routes
- `routes/admin.js` — admin dashboard and management routes
- `data/` — persistent JSON data storage for users, products, and orders

## Setup

1. Open a terminal and navigate to this folder:
   ```bash
   cd neobuy-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend:
   ```bash
   npm start
   ```

4. The backend API will run on:
   ```text
   http://localhost:3000/api
   ```

## Notes

- Admin password: `NeoAdmin123`
- New buyers start with `0 NeoPoints`
- Data is stored in `neobuy-backend/data/`
- This project uses plain text passwords for demonstration only
