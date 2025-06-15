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


// Logger with Timestamp
const logWithTime = (message) => {
  const now = new Date().toLocaleString("en-PK", {
    timeZone: "Asia/Karachi", // Adjust to your timezone
    hour12: false,
  });
  console.log(`[${now}] ${message}`);
};


const checkUser = (req, res) => {
  try {
    logWithTime("---------Checking New User-------------------");
    logWithTime("Incoming request body: " + JSON.stringify(req.body, null, 2));

    const newUserData = req.body;

    if (!newUserData || !newUserData.userInfo || !newUserData.userInfo.id) {
      console.error("Invalid request body. Missing userInfo or user ID.");
      return res
        .status(400)
        .send("Invalid request body. Missing userInfo or user ID.");
    }

    const userID = newUserData.userInfo.id;
    console.log("Extracted userID:", userID);

    // Check if user already exists
    const userExists = users.some((user) => user._id === userID);
    console.log("Does user already exist?", userExists);

    if (userExists) {
      logWithTime("User with ID: " +  userID +  " | already exists.");
      return res.status(200).send("User already exists");
    }

    
    const currentDate = new Date();

    // Create the new user object
    const userObj = {
      _id: newUserData.userInfo.id,
      userInfo: {
        name: newUserData.userInfo.name,
        ID: newUserData.userInfo.id,
        email: newUserData.userInfo.email,
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
              accountName: newUserData.userInfo.name,
              date: formatDate(currentDate),
              score: "0",
              time: formatTime(currentDate),
            },
            cityDefender: {
              id: newUserData.userInfo.id,
              accountName: newUserData.userInfo.name,
              date: formatDate(currentDate),
              score: "0",
              time: formatTime(currentDate),
            },
          },
        },
      ],
    };

   

    // Add the new user to the users array
    users.push(userObj);
   

    // Write the updated users array to the file
    fs.writeFile(
      "./data/users.json",
      JSON.stringify(users, null, 2),
      (error) => {
        if (error) {
          console.error("Error writing to users.json:", error);
          return res.status(500).send("Error saving user data.");
        }

        logWithTime("New user added successfully to users.json.");
        return res.status(201).send("New user added successfully");
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return res.status(500).send("Internal server error.");
  }
};

const updateUserResults = (req, res) => {
  try {
    console.log("---------: Updating User Results : -------------------");
    
    const userResults = req.body;

    if (!userResults || !userResults.results) {
      console.error("Invalid request body format. Missing 'results'.");
      return res.status(400).send("Invalid request body. Missing 'results'.");
    }

    const keyboardLayout = userResults.results.keyboardLyout;
    const userId = userResults.results.userId;

    

    if (!keyboardLayout || !userId) {
      console.error("Missing 'keyboardLyout' or 'userId' in request body.");
      return res.status(400).send("Missing 'keyboardLyout' or 'userId' in request body.");
    }

    // Find the user by userId
    const userData = users.find((user) => user._id === userId);

    if (!userData) {
      console.error("User not found for userId:", userId);
      return res.status(404).send(`Invalid id: ${userId}`);
    }

    let PrevResults = userData.results;

    if (!Array.isArray(PrevResults)) {
      console.warn("PrevResults is not an array, converting to array...");
      PrevResults = [PrevResults];
    }

    const existingLayoutIndex = PrevResults.findIndex(
      (result) => result.keyboardLyout === keyboardLayout
    );
    console.log("Existing layout index:", existingLayoutIndex);

    const currentDate = new Date();
    if (existingLayoutIndex !== -1) {
      console.log("Updating existing keyboard layout results...");

      // Update the existing layout data
      PrevResults[existingLayoutIndex] = {
        status: "updated..." + currentDate.toISOString(),
        certificateComplition: userResults.results.certificateComplition,
        CRNO: userResults.results.CRNO,
        keyboardLyout: keyboardLayout,
        drills: userResults.results.drills || {},
        games: userResults.results.games || {},
      };

    } else {
      console.log("Adding new keyboard layout results...");
      // Add new layout data
      PrevResults.push(userResults.results);
    }

    userData.results = PrevResults;

    users = users.filter((user) => user._id !== userId);
    users.push(userData);


    // Write updated users to file
    fs.writeFile("./data/users.json", JSON.stringify(users, null, 2), (error) => {
      if (error) {
        console.error("Error writing to file:", error);
        return res.status(500).send("Error saving data.");
      }

      const message = existingLayoutIndex !== -1
        ? "User results updated successfully."
        : "New layout results added successfully.";
      console.log(message);
      return res.status(existingLayoutIndex !== -1 ? 200 : 201).send(message);
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return res.status(500).send("Internal server error.");
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

const updateUserData = (req, res) => {
  

  const userinfo = req.body;
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("ID is required.");
  }

  console.log("updating the user Data...");
  // Assuming users are loaded from a file or stored in memory
  const user = users.find((user) => user._id === id);

  if (!user) {
    return res.status(404).send("User not found.");
  }

  // Update user's settings
  user.userInfo = userinfo;

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
  updateUserData,
  updateSettings,
};
