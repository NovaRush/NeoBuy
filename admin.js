const express = require("express");
const path = require("path");
const {
  readJson,
  writeJson,
  ADMIN_PASSWORD,
  getDefaultApprovedProducts,
} = require("../utils/jsonStorage");

const router = express.Router();
const buyersPath = path.join(__dirname, "../data/buyers.json");
const sellersPath = path.join(__dirname, "../data/sellers.json");
const approvedProductsPath = path.join(__dirname, "../data/approvedProducts.json");
const pendingProductsPath = path.join(__dirname, "../data/pendingProducts.json");
const ordersPath = path.join(__dirname, "../data/orders.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isInteger(value) {
  return Number.isInteger(value);
}

function validateAdmin(password) {
  return password === ADMIN_PASSWORD;
}

router.post("/login", async (req, res) => {
  const { password } = req.body;
  if (!validateAdmin(password)) {
    return res.status(401).json({ success: false, message: "Invalid admin password", data: null });
  }

  return res.json({ success: true, message: "Admin login successful", data: null });
});

router.get("/buyers", async (req, res) => {
  try {
    const { password } = req.query;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    const buyers = await readJson(buyersPath);
    const filtered = buyers.map(({ username, name, gradeSection, gems, neopoints, createdAt }) => ({
      username,
      name,
      gradeSection,
      gems,
      neopoints,
      createdAt,
    }));

    return res.json({ success: true, message: "Buyers retrieved successfully.", data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not retrieve buyers.", data: { error: error.message } });
  }
});

router.get("/sellers", async (req, res) => {
  try {
    const { password } = req.query;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    const sellers = await readJson(sellersPath);
    const filtered = sellers.map(({ username, name, gradeSection, gems, products, createdAt }) => ({
      username,
      name,
      gradeSection,
      gems,
      products,
      createdAt,
    }));

    return res.json({ success: true, message: "Sellers retrieved successfully.", data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not retrieve sellers.", data: { error: error.message } });
  }
});

router.get("/pending-products", async (req, res) => {
  try {
    const { password } = req.query;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    const pendingProducts = await readJson(pendingProductsPath);
    return res.json({ success: true, message: "Pending products retrieved successfully.", data: pendingProducts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not retrieve pending products.", data: { error: error.message } });
  }
});

router.post("/credit-points", async (req, res) => {
  try {
    const { password, username, amount } = req.body;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    if (!isNonEmptyString(username) || !isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid buyer username and positive credit amount are required.",
        data: null,
      });
    }

    const buyers = await readJson(buyersPath);
    const buyer = buyers.find((item) => item.username === username.trim());
    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found.", data: null });
    }

    buyer.neopoints += amount;
    await writeJson(buyersPath, buyers);

    return res.json({
      success: true,
      message: `Credited ${amount} NeoPoints to ${buyer.username}.`,
      data: { username: buyer.username, neopoints: buyer.neopoints },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not credit points.",
      data: { error: error.message },
    });
  }
});

router.post("/adjust-points", async (req, res) => {
  try {
    const { password, username, points } = req.body;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    if (!isNonEmptyString(username) || !isInteger(points)) {
      return res.status(400).json({
        success: false,
        message: "Valid buyer username and integer points amount are required.",
        data: null,
      });
    }

    const buyers = await readJson(buyersPath);
    const buyer = buyers.find((item) => item.username === username.trim());
    if (!buyer) {
      return res.status(404).json({ success: false, message: "Buyer not found.", data: null });
    }

    const newPoints = buyer.neopoints + points;
    if (newPoints < 0) {
      return res.status(400).json({
        success: false,
        message: "Adjustment would result in negative NeoPoints.",
        data: null,
      });
    }

    buyer.neopoints = newPoints;
    await writeJson(buyersPath, buyers);

    return res.json({
      success: true,
      message: `Adjusted NeoPoints for ${buyer.username}.`,
      data: { username: buyer.username, neopoints: buyer.neopoints },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not adjust points.",
      data: { error: error.message },
    });
  }
});

router.delete("/delete-buyer/:username", async (req, res) => {
  try {
    const { password } = req.body;
    const { username } = req.params;

    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    const buyers = await readJson(buyersPath);
    const updated = buyers.filter((item) => item.username !== username.trim());
    if (updated.length === buyers.length) {
      return res.status(404).json({ success: false, message: "Buyer not found.", data: null });
    }

    await writeJson(buyersPath, updated);
    return res.json({ success: true, message: "Buyer deleted successfully.", data: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete buyer.",
      data: { error: error.message },
    });
  }
});

router.delete("/delete-seller/:username", async (req, res) => {
  try {
    const { password } = req.body;
    const { username } = req.params;

    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    const sellers = await readJson(sellersPath);
    const updated = sellers.filter((item) => item.username !== username.trim());
    if (updated.length === sellers.length) {
      return res.status(404).json({ success: false, message: "Seller not found.", data: null });
    }

    await writeJson(sellersPath, updated);
    return res.json({ success: true, message: "Seller deleted successfully.", data: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete seller.",
      data: { error: error.message },
    });
  }
});

router.delete("/remove-product/:id", async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    const approvedProducts = await readJson(approvedProductsPath);
    const updated = approvedProducts.filter((item) => item.id !== id.trim());
    if (updated.length === approvedProducts.length) {
      return res.status(404).json({ success: false, message: "Product not found.", data: null });
    }

    await writeJson(approvedProductsPath, updated);
    return res.json({ success: true, message: "Approved product removed successfully.", data: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not remove product.",
      data: { error: error.message },
    });
  }
});

router.post("/clear-orders", async (req, res) => {
  try {
    const { password } = req.body;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    await writeJson(ordersPath, []);
    return res.json({ success: true, message: "Orders cleared successfully.", data: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not clear orders.",
      data: { error: error.message },
    });
  }
});

router.post("/reset-data", async (req, res) => {
  try {
    const { password } = req.body;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    await Promise.all([
      writeJson(buyersPath, []),
      writeJson(sellersPath, []),
      writeJson(pendingProductsPath, []),
      writeJson(ordersPath, []),
      writeJson(approvedProductsPath, getDefaultApprovedProducts()),
    ]);

    return res.json({ success: true, message: "All marketplace data has been reset.", data: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not reset data.",
      data: { error: error.message },
    });
  }
});

router.get("/export", async (req, res) => {
  try {
    const { password } = req.query;
    if (!validateAdmin(password)) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    const buyers = await readJson(buyersPath);
    const sellers = await readJson(sellersPath);
    const approvedProducts = await readJson(approvedProductsPath);
    const pendingProducts = await readJson(pendingProductsPath);
    const orders = await readJson(ordersPath);

    return res.json({
      success: true,
      message: "Marketplace export data retrieved successfully.",
      data: { buyers, sellers, approvedProducts, pendingProducts, orders },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not export data.",
      data: { error: error.message },
    });
  }
});

module.exports = router;
