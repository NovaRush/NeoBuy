const express = require("express");
const path = require("path");
const { readJson, writeJson } = require("../utils/jsonStorage");

const router = express.Router();
const sellersPath = path.join(__dirname, "../data/sellers.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// Seller signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, gradeSection, gems } = req.body;

    if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required for seller signup.",
        data: null,
      });
    }

    const sellers = await readJson(sellersPath);
    const existing = sellers.find((seller) => seller.username === username.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Seller username is already taken.",
        data: null,
      });
    }

    const newSeller = {
      username: username.trim(),
      password: password,
      name: isNonEmptyString(name) ? name.trim() : "",
      gradeSection: isNonEmptyString(gradeSection) ? gradeSection.trim() : "",
      gems: isNonEmptyString(gems) ? gems.trim() : "",
      products: [],
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    sellers.push(newSeller);
    await writeJson(sellersPath, sellers);

    return res.status(201).json({
      success: true,
      message: "Seller account created successfully.",
      data: { seller: { username: newSeller.username, name: newSeller.name, gradeSection: newSeller.gradeSection, gems: newSeller.gems } },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create seller account.",
      data: { error: error.message },
    });
  }
});

// Seller login endpoint
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

    const sellers = await readJson(sellersPath);
    const seller = sellers.find((item) => item.username === username.trim());

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller account not found",
        data: null,
      });
    }

    if (seller.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Seller login successful",
      data: {
        username: seller.username,
        name: seller.name,
        gradeSection: seller.gradeSection,
        gems: seller.gems,
        joinDate: seller.joinDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Seller login failed.",
      data: { error: error.message },
    });
  }
});

module.exports = router;
