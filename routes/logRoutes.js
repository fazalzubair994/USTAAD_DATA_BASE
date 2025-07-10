const express = require("express");
const router = express.Router();
const { getAllLogs, clearAllLogs } = require("../controllers/logController");

// GET all logs
router.get("/logs", getAllLogs);

// DELETE all logs
router.delete("/logs", clearAllLogs);

module.exports = router;
