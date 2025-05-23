const Log = require("../models/Logs");
const { updateStockFromLog } = require('./inventoryController');

// Create a log
exports.createLog = async (req, res) => {
  try {
    const {
      productId,
      locationId,
      userId,
      type,
      quantity,
      note,
      transferDetails
    } = req.body;

    if (!["in", "out", "adjustment", "transfer"].includes(type)) {
      return res.status(400).json({ error: "Invalid log type" });
    }

    const log = new Log({
      productId,
      locationId,
      userId,
      type,
      quantity,
      note,
      transferDetails: type === "transfer" ? transferDetails : undefined,
    });

    const savedLog = await log.save();
    await updateStockFromLog(log);
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all logs for a user
exports.getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await Log.find({ userId })
      .populate("productId", "name")
      .populate("locationId", "name")
      .populate("transferDetails.fromLocationId", "name")
      .populate("transferDetails.toLocationId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single log by ID
exports.getLogById = async (req, res) => {
  try {
    const { logId } = req.params;
    const log = await Log.findById(logId)
      .populate("productId", "name")
      .populate("locationId", "name")
      .populate("transferDetails.fromLocationId", "name")
      .populate("transferDetails.toLocationId", "name");

    if (!log) return res.status(404).json({ error: "Log not found" });
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a log by ID
exports.deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const deleted = await Log.findByIdAndDelete(logId);
    if (!deleted) return res.status(404).json({ error: "Log not found" });
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};