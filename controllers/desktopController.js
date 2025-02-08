const fs = require("fs");
const path = require("path"); // Add this line

// Load the user data from the JSON file
let users = require("../data/DesktopUsers.json");

const getAllUsers = (req, res) => {
  if (users) {
    return res.status(201).json({ users: users });
  } else {
    return res.status(404).send("No User found.");
  }
};

const checkUser = (req, res) => {
  try {
    console.log("---------Checking New Hmid-------------------");

    const newUserData = req.body;
   

    const { hmid } = newUserData;
 console.log("hmid: " + hmid);
    // Check if user already exists
    const existingUser = users.find((user) => user.hmid === hmid);

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.json({ message: "User found.", user: existingUser });
    }

    // If user doesn't exist, add to the users array and save to file
    users.push(newUserData);

    // Write the updated users array back to the JSON file
    const filePath = path.join(__dirname, "../data/DesktopUsers.json");
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    console.log("New user added:", hmid);
    return res
      .status(201)
      .json({ message: "New user added.", user: newUserData });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return res.status(500).send("Internal server error.");
  }
};

module.exports = {
  getAllUsers,
  checkUser,
};
