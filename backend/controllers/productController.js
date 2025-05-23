const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, categoryId, unit, price, description, lowStockThreshold, userId } = req.body;

    const newProduct = new Product({
      name,
      categoryId,
      unit,
      price,
      description,
      lowStockThreshold,
      userId
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Products by User ID
exports.getProductsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const products = await Product.find({ userId }).populate("categoryId");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId).populate("categoryId");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};