const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
  const { name, description, userId } = req.body;

  try {
    const newCategory = new Category({ name, description, userId });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Category by ID
exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Categories by userId
exports.getCategoriesByUser = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.params.userId });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};