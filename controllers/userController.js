const fs = require("fs");
let users = require("../data/users.json");

const getAllUsers = (req, res) => {
  if (users) {
    return res.json(users);
  } else {
    return res.status(404).send("No User found.");
  }
};

const formatDate = (date) => {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options).replace(/\//g, "/");
};

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12; // Convert 24-hour to 12-hour format
  return `${hour}:${minutes} ${ampm}`;
};

const checkUser = (req, res) => {
  const newUserData = req.body;
  const userID = newUserData.userInfo.id;
  const userExists = users.some((user) => user._id === userID);
  if (userExists) {
    return res.status(200).send("User already exists");
  } else {
    const currentDate = new Date();
    let userObj = {
      _id: newUserData.userInfo.id,
      userInfo: {
        name: newUserData.userInfo.name,
        ID: newUserData.userInfo.id,
        emal: newUserData.userInfo.email,
        registerationDate: formatDate(currentDate),
        registerationTime: formatTime(currentDate),
        lastActiveDate: formatDate(currentDate),
      },
      applicationSettings: {
        appTheme: "dark",
        randomizer: false,
        fontSizes: "small",
        durationDialog: { duration: "3 minutes", showDialog: true },
        internalKeyboard: "on",
      },
      results: [
        {
          keyboardLyout: "QWERTY keyboard",
          certificateComplition: false,
          CRNO: null,
          drills: {},
          games: {
            safeDrive: {
              id: newUserData.userInfo.id,
              accountName: newUserData.name,
              date: formatDate(currentDate),
              score: "0",
              time: formatTime(currentDate),
            },
            cityDefender: {
              id: newUserData.userInfo.id,
              accountName: newUserData.name,
              date: formatDate(currentDate),
              score: "0",
              time: formatTime(currentDate),
            },
          },
        },
      ],
    };

    users.push(userObj);
    fs.writeFile("./data/users.json", JSON.stringify(users), (error) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(201).send("New user added successfully");
      }
    });
  }
};

const updateUserResults = (req, res) => {
  const userResults = req.body;
  const keyboardLayout = userResults.results.keyboardLyout;
  const userId = userResults.results.userId;

  // console.log(keyboardLayout);
  // console.log("userID: " + userId);
  // Find the index of the user in the users array by userInfo.ID
  const userData = users.find((user) => user._id === userId);
  // console.log("userData: " + JSON.stringify(userData));

  if (userData) {
    let PrevResults = userData.results;
    if (!Array.isArray(PrevResults)) {
      // console.log("PrevResults is not an array...");
      PrevResults = [PrevResults];
    }
    // console.log(PrevResults);
    const existingLayoutIndex = PrevResults.findIndex(
      (result) => result.keyboardLyout === keyboardLayout
    );

    // console.log(existingLayoutIndex);
    if (existingLayoutIndex !== -1) {
      const currentDate = new Date();
      // Keyboard layout exists, replace the existing data
      PrevResults[existingLayoutIndex] = {
        status: "updated..." + formatDate(currentDate),
        certificateComplition: userResults.results.certificateComplition,
        CRNO: userResults.results.CRNO,
        keyboardLyout: userResults.results.keyboardLyout,
        drills: userResults.results.drills || {},
        games: userResults.results.games || {},
      };

      userData.results = PrevResults;
      // console.log(userData.results);
      users = users.filter((user) => user.userInfo.ID !== userId);
      users.push(userData);
      fs.writeFile("./data/users.json", JSON.stringify(users), (error) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).send("User Results updated successfully");
        }
      });
    } else {
      // User does not exist, push the new user data to the array
      PrevResults.push(userResults.results);
      userData.results = PrevResults;
      users = users.filter((user) => user.userInfo.ID !== userId);
      users.push(userData);
      fs.writeFile("./data/users.json", JSON.stringify(users), (error) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(201).send("New Layout Results added successfully");
        }
      });
    }
  } else {
    return res.status(404).send("Invalid id....: " + userId);
  }
};

const updateSettings = (req, res) => {
  const userSettings = req.body;
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("ID is required.");
  }

  // Assuming users are loaded from a file or stored in memory
  const user = users.find((user) => user._id === id);

  if (!user) {
    return res.status(404).send("User not found.");
  }

  // Update user's settings
  user.applicationSettings = userSettings;

  // Write updated users array back to the file
  fs.writeFile("./data/users.json", JSON.stringify(users, null, 2), (error) => {
    if (error) {
      console.error("Error writing file:", error);
      return res.status(500).send("Error updating user settings.");
    }

    return res.status(200).send("User settings updated successfully.");
  });
};
const singleUser = (req, res) => {
  const id = req.params.id;
  if (id) {
    const user = users.find((user) => user._id === id);
    return res.json(user);
  } else {
    return res.status(404).send("Invalid ID....");
  }
};
const deleteUser = (req, res) => {
  const id = req.params.id;
  if (id) {
    const updatedUsers = users.filter((user) => user._id !== id);
    users = updatedUsers;
    fs.writeFile("./data/users.json", JSON.stringify(users), (error, file) => {
      if (error) {
        console.log(error);
        return res.status(404).send("File not found.");
      } else {
        return res.json("Deletion sucessfull: id: " + id);
      }
    });
  } else {
    return res.status(404).send("Invalid ID....");
  }
};

// Other user methods...

module.exports = {
  getAllUsers,
  singleUser,
  checkUser,
  updateUserResults,
  deleteUser,
  updateSettings,
};
