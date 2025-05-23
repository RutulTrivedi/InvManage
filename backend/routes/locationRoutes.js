const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.post("/", locationController.createLocation);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);
router.get("/user/:userId", locationController.getLocationsByUser);
router.get("/:id", locationController.getLocationById);

module.exports = router;