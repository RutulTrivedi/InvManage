const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.post("/", inventoryController.createInventory);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);
router.get("/product/:productId/location/:locationId", inventoryController.getInventoryByProductAndLocation);
router.get("/product/:productId", inventoryController.getAllInventoryByProduct);
router.get("/location/:locationId", inventoryController.getAllInventoryByLocation);
router.get("/user/:userId", inventoryController.getAllInventoryByUser);
router.get('/low-stock/:userId', inventoryController.checkLowStock);
router.get('/stock-summary/:userId/:productId', inventoryController.getProductStockSummary);
router.get('/stock-location/:userId/:productId', inventoryController.getStockPerLocation);

module.exports = router;