const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../data/Objectlogger.json");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "[]", "utf-8");
}

const log = (data) => {
  try {
    const logs = JSON.parse(
      fs.readFileSync(logFilePath, "utf-8")
    );

    const logEntry = {
      ...data,

      timestamp: new Date().toLocaleString("en-PK", {
        timeZone: "Asia/Karachi",
        hour12: false,
      }),
    };

    logs.push(logEntry);

    fs.writeFileSync(
      logFilePath,
      JSON.stringify(logs, null, 2),
      "utf-8"
    );
  } catch {
    // Silent
  }
};

module.exports = log;