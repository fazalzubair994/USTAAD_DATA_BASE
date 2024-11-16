const express = require("express");
const fs = require("fs");
var keyboards = require("./data/Keyboards");
const UiData = require("./data/userInterface");
var users = require("./data/users.json")
const cors = require("cors");
const app = express();
const PORT = 8000;

app.use(express.json({extended:false}));

// Enable CORS for all routes
app.use(cors());


// will return all the users in the users.js file
app.get("/api/users", (req, res) => {
  if (users) {
    return res.json(users);
  } else {
    return res.status(404).send("No User found.");
  }
});

// will update the user Results by the new results. 
app.patch("/api/users/updateUserResults", (req, res) => {
  const userResults = req.body;
  const keyboardLayout = userResults.results.keyboardLyout;
  const userId = userResults.results.userId;

  console.log(userResults.results);

  // Find the index of the user in the users array by userInfo.ID
  const userData = users.find((user) => user.userInfo.ID === userId);

  if (userData) {
    const PrevResults = userData.results; 
    
    const existingLayoutIndex =PrevResults.findIndex(
      result => result.keyboardLyout === keyboardLayout
    );

    if (existingLayoutIndex !== -1) {
      // Keyboard layout exists, replace the existing data
      PrevResults[existingLayoutIndex] = {
        keyboardLyout: userResults.results.keyboardLyout,
        drills: userResults.results.drills || {},
        games: userResults.results.games || {}
      };

      console.log(PrevResults);
      userData.results = PrevResults;
    
      return res.status(200).send("Keyboard layout updated successfully");
   
  } else {
    // User does not exist, push the new user data to the array
    PrevResults.push(userResults.results);
    userData.results = PrevResults;
    return res.status(201).send("New user added successfully");
  }


}});

// will check if the user is already member or not, if not then the user will be added in the data base
app.post("/api/users/checkUser", (req, res) => {
  const newUserData = req.body;
  console.log(newUserData)
  // Check if user data is provided in the request body
  if (!newUserData || !newUserData.userInfo || !newUserData.userInfo.id) {
    return res.status(400).send("Invalid user data");
  }

  const userID = newUserData.userInfo.id;

  // Find if the user exists in the users array by userInfo.ID
  const userExists = users.some(user => user._id === userID);
  if (userExists) {
    // User exists, do nothing
    return res.status(200).send("User already exists");
  } else {
    var userObj = {
      _id: newUserData.userInfo.id,
      userInfo: {
        name: newUserData.userInfo.name,
        ID: newUserData.userInfo.id,
        email: newUserData.userInfo.email,
        registrationDate: Date.now(),
        registrationTime: "04:30 PM",
        lastActiveDate: "7-Oct-2024"
      },
      applicationSettings: {
        appTheme: "dark",
        randomizer: false,
        fontSizes: "small",
        durationDialog: { "duration": "3 minutes", "showDialog": true },
        internalKeyboard: "on"
      },
      results: [
        {
          keyboardLyout: "QWERTY keyboard",
          drills: {},
          games: {
            safeDrive: {},
            cityDefender: {}
          }
        },
      ]
    };
    

    // Push the new user with default data to the array
    users.push(userObj);
    fs.writeFile(
      "./data/users.json", 
       JSON.stringify(users),
       (error, file) => {
         if (error) {
           console.log(error);
         } else {
           return res.end("Success: " );
         }
       }
     );
    return res.status(201).send("New user added successfully with default settings");
  }
});

// will delete a specific user i mean we pass an id and thi rout will delete the user with that id.
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  if (id) {
    const updatedUsers = users.filter((user) => user._id !== Number(id));
    users = updatedUsers;

    fs.writeFile(
      "./data/users.json", 
       JSON.stringify(users),
       (error, file) => {
         if (error) {
           console.log(error);
         } else {
           return res.end("Success: " + id);
         }
       }
     );

  } else {
    return res.status(404).send("No User found.");
  }
});

// this rout will return all the important data for the application, i mean it will take userID and keyboard name 
// and then return the all the important data for the application. 
app.get("/api/getData", (req, res) => {
  const { userID, keyboardName } = req.query;

  // Check for missing userID
  if (!userID) {
    return res.status(400).send("Missing userID");
  }
 const user = users.find(user => user._id === Number(userID));

 if (!user) {
   return res.status(404).send("No user found with the given ID.");
 }

  const keyboard = keyboards.find((keyboard) => keyboard.properties.name===keyboardName);
  if(keyboard){

    const requestedData = {
      keyboard: keyboard,
      uiData: UiData[keyboard.properties.userInterfaceID],
      drillMaterial: {
        /* Drill Material Data */
      },
      userData: user,
    };
    return res.json(requestedData);
  }
  else{
    return res.end("Keyboard is not found....");
  }
});

// this route will return all the keyboard layout in the keyboards.js file. 
app.get("/api/allkeyboards", (req, res) => {
  if (keyboards && keyboards.length > 0) {
    // Return the list of all keyboards
    return res.json(keyboards);
  } else {
    return res.status(404).send("No keyboards found.");
  }
});


// will return a keyboard with specific name. 
app.get("/api/keyboards/:keyboardName", (req, res) => {
  const keyboardName = req.params.keyboardName;
  const keyboard = keyboards.find((keyboard) => keyboard.properties.name===keyboardName);
  if(keyboard){
    return res.json(keyboard);
  }
  else{
    return res.end("Keyboard is not found....");
  }

});

// this will delete a keyboard using the keyboard name. 
app.delete("/api/keyboards/:keyboardName", (req, res) => {
  const keyboardName = req.params.keyboardName;

  const updatedData = keyboards.filter((keyboard) => keyboard.properties.name !== keyboardName);
  keyboards = updatedData;

  fs.writeFile(
   "./data/Keyboards.json", 
    JSON.stringify(updatedData),
    (error, file) => {
      if (error) {
        console.log(error);
      } else {
        return res.end("Success: " + keyboardName);
      }
    }
  );
});

// this will add a new keyboards in the keyboards file. 
app.post("/api/keyboards/add", (req, res) => {
  const body = req.body;

  keyboards.push({ ...body});
  fs.writeFile(
    "./data/Keyboards.json", 
    JSON.stringify(keyboards),
    (error, file) => {
      if (error) {
        console.log(error);
      } else {
        return res.end("Success: ");
      }
    }
  );
});




app.listen(PORT, () => {
  console.log("Server is started...");
});
