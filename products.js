const express = require("express");
const path = require("path");
const {
  readJson,
  writeJson,
  ADMIN_PASSWORD,
} = require("../utils/jsonStorage");

const router = express.Router();
const approvedProductsPath = path.join(__dirname, "../data/approvedProducts.json");
const pendingProductsPath = path.join(__dirname, "../data/pendingProducts.json");
const sellersPath = path.join(__dirname, "../data/sellers.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

// Return all approved products.
router.get("/", async (req, res) => {
  try {
    const approvedProducts = await readJson(approvedProductsPath);
    return res.json({
      success: true,
      message: "Approved products retrieved successfully.",
      data: approvedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load approved products.",
      data: { error: error.message },
    });
  }
});

// Seller submits a product for approval.
router.post("/submit", async (req, res) => {
  try {
    const { sellerUsername, name, price, emoji } = req.body;

    if (!isNonEmptyString(sellerUsername) || !isNonEmptyString(name) || !isNonEmptyString(emoji)) {
      return res.status(400).json({
        success: false,
        message: "Seller username, product name, and emoji are required.",
        data: null,
      });
    }

    if (!isPositiveInteger(price)) {
      return res.status(400).json({
        success: false,
        message: "Product price must be a positive integer.",
        data: null,
      });
    }

    const sellers = await readJson(sellersPath);
    const seller = sellers.find((item) => item.username === sellerUsername.trim());
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
        data: null,
      });
    }

    const pendingProducts = await readJson(pendingProductsPath);
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      price,
      emoji: emoji.trim(),
      seller: sellerUsername.trim(),
      status: "pending",
      submittedDate: new Date().toISOString(),
    };

    pendingProducts.push(newProduct);
    await writeJson(pendingProductsPath, pendingProducts);

    const sellerIndex = sellers.findIndex((item) => item.username === sellerUsername.trim());
    if (sellerIndex !== -1) {
      sellers[sellerIndex].products.push(newProduct);
      await writeJson(sellersPath, sellers);
    }

    return res.status(201).json({
      success: true,
      message: "Product submitted successfully and is pending approval.",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit product.",
      data: { error: error.message },
    });
  }
});

// Admin approves a pending product.
router.post("/approve", async (req, res) => {
  try {
    const { adminPassword, productId } = req.body;
    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    if (!isNonEmptyString(productId)) {
      return res.status(400).json({ success: false, message: "Product ID is required.", data: null });
    }

    const pendingProducts = await readJson(pendingProductsPath);
    const productIndex = pendingProducts.findIndex((item) => item.id === productId.trim());
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Pending product not found.", data: null });
    }

    const approvedProducts = await readJson(approvedProductsPath);
    const product = pendingProducts.splice(productIndex, 1)[0];
    product.status = "approved";
    approvedProducts.push(product);

    const sellers = await readJson(sellersPath);
    const sellerIndex = sellers.findIndex((item) => item.username === product.seller);
    if (sellerIndex !== -1) {
      const sellerProduct = sellers[sellerIndex].products.find((item) => item.id === product.id);
      if (sellerProduct) {
        sellerProduct.status = "approved";
      }
      await writeJson(sellersPath, sellers);
    }

    await writeJson(pendingProductsPath, pendingProducts);
    await writeJson(approvedProductsPath, approvedProducts);

    return res.json({ success: true, message: "Product approved successfully.", data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not approve product.",
      data: { error: error.message },
    });
  }
});

// Return all pending products.
router.get("/pending", async (req, res) => {
  try {
    const pendingProducts = await readJson(pendingProductsPath);
    return res.json({
      success: true,
      message: "Pending products retrieved successfully.",
      data: pendingProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load pending products.",
      data: { error: error.message },
    });
  }
});

// Admin rejects a pending product.
router.post("/reject", async (req, res) => {
  try {
    const { adminPassword, productId } = req.body;
    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid admin password.", data: null });
    }

    if (!isNonEmptyString(productId)) {
      return res.status(400).json({ success: false, message: "Product ID is required.", data: null });
    }

    const pendingProducts = await readJson(pendingProductsPath);
    const productIndex = pendingProducts.findIndex((item) => item.id === productId.trim());
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Pending product not found.", data: null });
    }

    const rejectedProduct = pendingProducts.splice(productIndex, 1)[0];
    await writeJson(pendingProductsPath, pendingProducts);

    const sellers = await readJson(sellersPath);
    const sellerIndex = sellers.findIndex((item) => item.username === rejectedProduct.seller);
    if (sellerIndex !== -1) {
      sellers[sellerIndex].products = sellers[sellerIndex].products.filter((item) => item.id !== rejectedProduct.id);
      await writeJson(sellersPath, sellers);
    }

    return res.json({ success: true, message: "Product rejected and removed from pending approval.", data: rejectedProduct });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not reject product.",
      data: { error: error.message },
    });
  }
});

module.exports = router;
