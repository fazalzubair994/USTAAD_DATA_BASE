const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../data/logger.json");

// GET all logs
const getAllLogs = (req, res) => {
  try {
    const data = fs.readFileSync(logFilePath, "utf-8");
    const logs = JSON.parse(data);
    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).send("❌ Failed to read logs: " + err.message);
  }
};

// DELETE all logs (optional cleaner)
const clearAllLogs = (req, res) => {
  try {
    fs.writeFileSync(logFilePath, JSON.stringify([], null, 2));
    return res.status(200).send("🧽 All logs cleared successfully.");
  } catch (err) {
    return res.status(500).send("❌ Failed to clear logs: " + err.message);
  }
};

module.exports = {
  getAllLogs,
  clearAllLogs,
};
