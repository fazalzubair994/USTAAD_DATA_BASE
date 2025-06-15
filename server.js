const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 8000;

const keyboardRoutes = require("./routes/keyboardRoutes");
const userRoutes = require("./routes/userRoutes");
const certificattion = require("./routes/certificateRoutes");
const routeInfoRoutes = require("./routes/routeInfoRoutes");
const userInterfaceRoutes = require("./routes/userInterfaceRoutes");
const drillDataRoutes = require("./routes/drillMeterialsRoutes");
const languageCards = require("./routes/languageCardsRoutes");
const notifications = require("./routes/notificationRoutes");

const keyboards = require("./data/Keyboards");
const UiData = require("./data/userInterface");
const drillData = require("./data/dirllMeterials.json");
const desktopRoutes = require("./routes/desktopRoutes");

// Increase the JSON payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Use routes
app.use("/api/keyboards", keyboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/certificate", certificattion);
app.use("/api/languageCards", languageCards);
app.use("/api/notifications", notifications);
app.use("/api/ui", userInterfaceRoutes);
app.use("/api/drillData", drillDataRoutes);
app.use("/api/info", routeInfoRoutes);
app.use("/api/desktop", desktopRoutes);


// Logger with Timestamp
const logWithTime = (message) => {
  const now = new Date().toLocaleString("en-PK", {
    timeZone: "Asia/Karachi", // Adjust to your timezone
    hour12: false,
  });
  console.log(`[${now}] ${message}`);
};


app.get("/api/getData", (req, res) => {
  try {
    const { userID, keyboardName } = req.query;

    // Validate userID
    if (!userID) {
      console.error("Missing userID in query.");
      return res.status(400).send("Missing userID");
    }
 
    // Reload the users from the file
    const users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    // Find the user by userID
    const user = users.find((user) => user._id === userID);

    if (!user) {
      console.error("No user found with the given ID:", userID);
      console.log("-------------: Printing users Data :-----------------");
      console.log(users);
      return res.status(404).send("No user found with the given ID.");
    }

    // Process user results
    let userResults = Array.isArray(user.results) ? user.results : [];

    const layoutResults = userResults.filter(
      (result) => result?.keyboardLyout === keyboardName
    );

    user.results = layoutResults.length > 0 ? layoutResults[0] : null;
    

    // Find the keyboard by name
    const keyboard = keyboards.find(
      (keyboard) => keyboard.properties.name === keyboardName
    );

    if (!keyboard) {
      console.error("Keyboard not found with the given name:", keyboardName);
      return res.status(404).send("Keyboard is not found.");
    }

    // Prepare requested data
    const requestedData = {
      keyboard: keyboard,
      uiData: UiData[keyboard.properties.userInterfaceID],
      drillMaterial: drillData[keyboard.properties.practiceMeterialID],
      userData: user,
    };

    // Send response
    res.json(requestedData);
    logWithTime(
      "userID: " +
        userID +
        " | Requet Layout: " +
        keyboardName +
        " | Response sent successfully."
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return res.status(500).send("Internal server error.");
  }
});

app.post("/api/trackVisit", (req, res) => {
  try {
    const { siteName, siteUrl } = req.body;

    // Get user-related info from request
logWithTime("----- New Site Visit Tracked -----");
    logWithTime("Site Name: " + siteName + " | Site URL: " + siteUrl);

    res.status(200).send("Visit tracked successfully.");
  } catch (err) {
    console.error("Error tracking visit:", err);
    res.status(500).send("Failed to track visit.");
  }
});
app.post("/api/userFeedback", (req, res) => {
  try {
    // Get user-related info from request

    logWithTime("----- New Feedback arrived -----");
    console.log(req.body);
    console.log("----------------------------------");

    res.status(200).send("Feedback successfully recieved.");
  } catch (err) {
    console.error("Error tracking visit:", err);
    res.status(500).send("Failed to track recive feedback.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
