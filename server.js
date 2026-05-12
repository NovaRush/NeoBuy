const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  readJson,
  writeJson,
  ensureJsonFileExists,
  seedDefaultApprovedProducts,
} = require("./utils/jsonStorage");

const buyersRouter = require("./routes/buyers");
const sellersRouter = require("./routes/sellers");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const adminRouter = require("./routes/admin");

const app = express();
const PORT = 3000;
const dataDir = path.join(__dirname, "data");
const buyersPath = path.join(dataDir, "buyers.json");
const sellersPath = path.join(dataDir, "sellers.json");
const approvedProductsPath = path.join(dataDir, "approvedProducts.json");
const pendingProductsPath = path.join(dataDir, "pendingProducts.json");
const ordersPath = path.join(dataDir, "orders.json");

app.use(cors());
app.use(express.json());

app.use("/api/buyers", buyersRouter);
app.use("/api/sellers", sellersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

// Public stats endpoint for marketplace totals and counts
app.get("/api/stats", async (req, res) => {
  try {
    const buyers = await readJson(buyersPath);
    const sellers = await readJson(sellersPath);
    const approvedProducts = await readJson(approvedProductsPath);
    const pendingProducts = await readJson(pendingProductsPath);
    const orders = await readJson(ordersPath);

    return res.json({
      success: true,
      message: "Marketplace statistics retrieved successfully.",
      data: {
        buyers: buyers.length,
        sellers: sellers.length,
        approvedProducts: approvedProducts.length,
        pendingProducts: pendingProducts.length,
        orders: orders.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not retrieve marketplace stats.",
      data: { error: error.message },
    });
  }
});

// Ensure data folder and base files exist before starting the server
async function initializeData() {
  await Promise.all([
    ensureJsonFileExists(buyersPath, []),
    ensureJsonFileExists(sellersPath, []),
    ensureJsonFileExists(approvedProductsPath, []),
    ensureJsonFileExists(pendingProductsPath, []),
    ensureJsonFileExists(ordersPath, []),
  ]);

  await seedDefaultApprovedProducts(approvedProductsPath);
}

initializeData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`NeoBuy backend is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize NeoBuy backend:", error);
    process.exit(1);
  });
