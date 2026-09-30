const express = require("express");

const {
  createObjectLog,
  getObjectLogs,
} = require("../controllers/objectLoggerController");

const router = express.Router();

// Store object
router.post("/", createObjectLog);

// Get all objects
router.get("/", getObjectLogs);

module.exports = router;