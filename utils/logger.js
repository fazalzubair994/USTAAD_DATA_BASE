const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../data/logger.json");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, JSON.stringify([]));
}

const logWithTime = (message) => {
  const now = new Date().toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    hour12: false,
  });

  const logEntry = {
    timestamp: now,
    message,
  };

  try {
    const logs = JSON.parse(fs.readFileSync(logFilePath, "utf-8"));
    logs.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Logger error:", err);
  }
};

module.exports = logWithTime;
