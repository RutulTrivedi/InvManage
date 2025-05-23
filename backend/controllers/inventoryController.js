const Inventory = require("../models/Inventory");

exports.createInventory = async (req, res) => {
  const { productId, locationId, userId, currentStock } = req.body;

  try {
    const existing = await Inventory.findOne({ productId, locationId, userId });
    if (existing) {
      return res.status(400).json({ message: "Inventory already exists for this product and location" });
    }

    const newInventory = new Inventory({ productId, locationId, userId, currentStock });
    await newInventory.save();

    res.status(201).json({ message: "Inventory created", inventory: newInventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  const inventoryId = req.params.id;
  const { currentStock } = req.body;

  try {
    const updated = await Inventory.findByIdAndUpdate(
      inventoryId,
      { currentStock, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Inventory not found" });

    res.status(200).json({ message: "Inventory updated", inventory: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const deleted = await Inventory.findByIdAndDelete(inventoryId);
    if (!deleted) return res.status(404).json({ message: "Inventory not found" });

    res.status(200).json({ message: "Inventory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInventoryByProductAndLocation = async (req, res) => {
  const { productId, locationId } = req.params;

  try {
    const inventory = await Inventory.findOne({ productId, locationId });
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInventoryByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const records = await Inventory.find({ productId }).populate("locationId");
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInventoryByLocation = async (req, res) => {
  const { locationId } = req.params;

  try {
    const records = await Inventory.find({ locationId }).populate("productId");
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInventoryByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const records = await Inventory.find({ userId }).populate("productId").populate("locationId");
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update stock based on a log object
exports.updateStockFromLog = async (logData) => {
  const { productId, locationId, userId, quantity, type, transferDetails } = logData;

  try {
    if (type === 'in') {
      // Purchase: Add stock
      const inventory = await Inventory.findOneAndUpdate(
        { productId, locationId, userId },
        { $inc: { currentStock: quantity }, lastUpdated: new Date() },
        { new: true, upsert: true }
      );
      return inventory;
    }

    if (type === 'out') {
      // Sale: Reduce stock
      const inventory = await Inventory.findOneAndUpdate(
        { productId, locationId, userId },
        { $inc: { currentStock: -quantity }, lastUpdated: new Date() },
        { new: true }
      );
      return inventory;
    }

    if (type === 'transfer' && transferDetails?.fromLocationId && transferDetails?.toLocationId) {
      // Transfer: Subtract from one and add to another
      const fromInventory = await Inventory.findOneAndUpdate(
        { productId, locationId: transferDetails.fromLocationId, userId },
        { $inc: { currentStock: -quantity }, lastUpdated: new Date() },
        { new: true }
      );

      const toInventory = await Inventory.findOneAndUpdate(
        { productId, locationId: transferDetails.toLocationId, userId },
        { $inc: { currentStock: quantity }, lastUpdated: new Date() },
        { new: true, upsert: true }
      );

      return { fromInventory, toInventory };
    }

    throw new Error('Invalid log type or missing transfer details');

  } catch (error) {
    console.error('Stock update failed:', error.message);
    throw error;
  }
};

exports.checkLowStock = async (req, res) => {
  try {
    const { userId } = req.params;

    const lowStockItems = await Inventory.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: "$product" },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          $expr: { $lte: ["$currentStock", "$product.lowStockThreshold"] }
        }
      },
      {
        $project: {
          productName: "$product.name",
          currentStock: 1,
          lowStockThreshold: "$product.lowStockThreshold",
          locationId: 1
        }
      }
    ]);

    res.status(200).json(lowStockItems);
  } catch (err) {
    res.status(500).json({ message: "Error checking low stock items", error: err });
  }
};

exports.getProductStockSummary = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const stocks = await Inventory.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          productId: new mongoose.Types.ObjectId(productId)
        }
      },
      {
        $group: {
          _id: "$productId",
          totalStock: { $sum: "$currentStock" }
        }
      }
    ]);

    res.status(200).json(stocks[0] || { totalStock: 0 });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stock summary", error: err });
  }
};

exports.getStockPerLocation = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const stockDetails = await Inventory.find({ userId, productId })
      .populate('locationId', 'name address');

    res.status(200).json(stockDetails);
  } catch (err) {
    res.status(500).json({ message: "Failed to get location-wise stock", error: err });
  }
};