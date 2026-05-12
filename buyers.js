const express = require("express");
const path = require("path");
const { readJson, writeJson } = require("../utils/jsonStorage");

const router = express.Router();
const buyersPath = path.join(__dirname, "../data/buyers.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// Buyer signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, gradeSection, gems } = req.body;

    if (!isNonEmptyString(username) || !isNonEmptyString(password) || !isNonEmptyString(name) || !isNonEmptyString(gradeSection) || !isNonEmptyString(gems)) {
      return res.status(400).json({
        success: false,
        message: "Username, password, real name, grade & section, and GEMS account are required for buyer signup.",
        data: null,
      });
    }

    const buyers = await readJson(buyersPath);
    const existing = buyers.find((buyer) => buyer.username === username.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Buyer username is already taken.",
        data: null,
      });
    }

    const existingGems = buyers.find((buyer) => buyer.gems === gems.trim());
    if (existingGems) {
      return res.status(409).json({
        success: false,
        message: "GEMS account is already registered.",
        data: null,
      });
    }

    const newBuyer = {
      username: username.trim(),
      password: password,
      name: name.trim(),
      gradeSection: gradeSection.trim(),
      gems: gems.trim(),
      neopoints: 0,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    buyers.push(newBuyer);
    await writeJson(buyersPath, buyers);

    return res.status(201).json({
      success: true,
      message: "Buyer account created successfully.",
      data: { buyer: { username: newBuyer.username, name: newBuyer.name, gradeSection: newBuyer.gradeSection, gems: newBuyer.gems, neopoints: newBuyer.neopoints } },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create buyer account.",
      data: { error: error.message },
    });
  }
});

// Buyer login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required to log in.",
        data: null,
      });
    }

    const buyers = await readJson(buyersPath);
    const buyer = buyers.find((item) => item.username === username.trim());

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer account not found",
        data: null,
      });
    }

    if (buyer.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Buyer login successful",
      data: {
        username: buyer.username,
        name: buyer.name,
        gradeSection: buyer.gradeSection,
        gems: buyer.gems,
        neopoints: buyer.neopoints,
        joinDate: buyer.joinDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Buyer login failed.",
      data: { error: error.message },
    });
  }
});

module.exports = router;
