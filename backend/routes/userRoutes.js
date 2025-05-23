const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.put("/update/:id", userController.updateUser);
router.get("/:id", userController.getUserById);

module.exports = router;