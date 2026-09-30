const log = require("../utils/ObjectLogger");
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(
  __dirname,
  "../data/Objectlogger.json"
);

const createObjectLog = (req, res) => {
  try {
    log(req.body);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to store object log.",
    });
  }
};

const getObjectLogs = (req, res) => {
  try {
    if (!fs.existsSync(logFilePath)) {
      return res.status(200).json([]);
    }

    const fileData = fs.readFileSync(
      logFilePath,
      "utf-8"
    );

    if (!fileData.trim()) {
      return res.status(200).json([]);
    }

    const logs = JSON.parse(fileData);

    return res.status(200).json(
      Array.isArray(logs) ? logs : []
    );

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to read object logs.",
    });
  }
};

module.exports = {
  createObjectLog,
  getObjectLogs,
};