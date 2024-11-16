const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8000;

const keyboardRoutes = require("./routes/keyboardRoutes");
const userRoutes = require("./routes/userRoutes");
const routeInfoRoutes = require("./routes/routeInfoRoutes");
const userInterfaceRoutes = require("./routes/userInterfaceRoutes");
const drillDataRoutes = require("./routes/drillMeterialsRoutes");
const languageCards = require("./routes/languageCardsRoutes");

const keyboards = require("./data/Keyboards");
const UiData = require("./data/userInterface");
const users = require("./data/users.json");
const drillData = require("./data/dirllMeterials.json");

// Increase the JSON payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Use routes
app.use("/api/keyboards", keyboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/languageCards", languageCards);
app.use("/api/ui", userInterfaceRoutes);
app.use("/api/drillData", drillDataRoutes);
app.use("/api/info", routeInfoRoutes);

app.get("/api/getData", (req, res) => {
  const { userID, keyboardName } = req.query;

  // Check for missing userID
  if (!userID) {
    return res.status(400).send("Missing userID");
  }
  const user = { ...users.find((user) => user._id === userID) };

  let userResults = user.results;

  if (!Array.isArray(userResults)) {
    // console.log("userResults is not an array...");
    userResults = [userResults];
  }
  // console.log(typeof keyboardName);
  const layoutResults = userResults.filter(
    (result) => result.keyboardLyout === keyboardName
  );

  if (Array.isArray(layoutResults) && layoutResults.length > 0) {
    user.results = layoutResults[0];
  } else {
    user.results = null;
  }
  // console.log(users);
  if (!user) {
    return res.status(404).send("No user found with the given ID.");
  }

  const keyboard = keyboards.find(
    (keyboard) => keyboard.properties.name === keyboardName
  );
  if (keyboard) {
    const requestedData = {
      keyboard: keyboard,
      uiData: UiData[keyboard.properties.userInterfaceID],
      drillMaterial: drillData[keyboard.properties.practiceMeterialID],
      userData: user,
    };
    return res.json(requestedData);
  } else {
    return res.end("Keyboard is not found....");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
