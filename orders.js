const express = require("express");
const path = require("path");
const { readJson, writeJson } = require("../utils/jsonStorage");

const router = express.Router();
const buyersPath = path.join(__dirname, "../data/buyers.json");
const approvedProductsPath = path.join(__dirname, "../data/approvedProducts.json");
const ordersPath = path.join(__dirname, "../data/orders.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// Place an order using NeoPoints for an approved product.
router.post("/buy", async (req, res) => {
  try {
    const { buyerUsername, productId } = req.body;

    if (!isNonEmptyString(buyerUsername) || !isNonEmptyString(productId)) {
      return res.status(400).json({
        success: false,
        message: "Buyer username and product ID are required to buy a product.",
        data: null,
      });
    }

    const buyers = await readJson(buyersPath);
    const buyer = buyers.find((item) => item.username === buyerUsername.trim());
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found.",
        data: null,
      });
    }

    const approvedProducts = await readJson(approvedProductsPath);
    const product = approvedProducts.find((item) => item.id === productId.trim());
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Approved product not found.",
        data: null,
      });
    }

    if (buyer.neopoints < product.price) {
      return res.status(400).json({
        success: false,
        message: "Insufficient NeoPoints to purchase this product.",
        data: null,
      });
    }

    buyer.neopoints -= product.price;
    await writeJson(buyersPath, buyers);

    const orders = await readJson(ordersPath);
    const newOrder = {
      id: `order-${Date.now()}`,
      buyer: buyer.username,
      buyerName: buyer.name,
      buyerGradeSection: buyer.gradeSection,
      productId: product.id,
      productName: product.name,
      emoji: product.emoji,
      price: product.price,
      seller: product.seller,
      purchasedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    await writeJson(ordersPath, orders);

    return res.status(201).json({
      success: true,
      message: "Product purchased successfully.",
      data: { order: newOrder, buyer: { username: buyer.username, neopoints: buyer.neopoints } },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not complete purchase.",
      data: { error: error.message },
    });
  }
});

// Return all orders.
router.get("/", async (req, res) => {
  try {
    const orders = await readJson(ordersPath);
    return res.json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load orders.",
      data: { error: error.message },
    });
  }
});

module.exports = router;
