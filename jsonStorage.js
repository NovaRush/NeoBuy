const fs = require("fs").promises;
const path = require("path");

const ADMIN_PASSWORD = "NeoAdmin123";

// Ensure a JSON file exists on disk, creating it with a default value when missing.
async function ensureJsonFileExists(filePath, initialContent = []) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.access(filePath);
  } catch (error) {
    await writeJson(filePath, initialContent);
  }
}

// Read JSON contents from a file and return a parsed object or default array.
async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeJson(filePath, []);
      return [];
    }
    throw error;
  }
}

// Write JSON data to a file using pretty formatting.
async function writeJson(filePath, data) {
  const contents = JSON.stringify(data, null, 2);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, "utf-8");
}

// Generate default approved products when no approved products exist.
function getDefaultApprovedProducts() {
  const now = new Date().toISOString();
  return [
    {
      id: "prod-1",
      name: "Cool Pen",
      price: 5,
      emoji: "✏️",
      seller: "NeoBuy",
      status: "approved",
      submittedDate: now,
    },
    {
      id: "prod-2",
      name: "Notebook",
      price: 10,
      emoji: "📓",
      seller: "NeoBuy",
      status: "approved",
      submittedDate: now,
    },
  ];
}

// Seed default approved products into the approvedProducts file if it is empty.
async function seedDefaultApprovedProducts(approvedProductsPath) {
  const approvedProducts = await readJson(approvedProductsPath);
  if (!Array.isArray(approvedProducts) || approvedProducts.length === 0) {
    await writeJson(approvedProductsPath, getDefaultApprovedProducts());
  }
}

module.exports = {
  ADMIN_PASSWORD,
  ensureJsonFileExists,
  readJson,
  writeJson,
  seedDefaultApprovedProducts,
  getDefaultApprovedProducts,
};
