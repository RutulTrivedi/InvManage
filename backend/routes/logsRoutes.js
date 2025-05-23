const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logsController");

// POST - Create a new log
router.post("/create", logsController.createLog);

// GET - Get all logs by userId
router.get("/user/:userId", logsController.getLogsByUser);

// GET - Get single log by ID
router.get("/:logId", logsController.getLogById);

// DELETE - Delete a log
router.delete("/:logId", logsController.deleteLog);

module.exports = router;