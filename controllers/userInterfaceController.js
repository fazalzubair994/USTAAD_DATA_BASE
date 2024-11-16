const fs = require("fs");
let userInterfaces = require("../data/userInterface.json");

const getAllInterfaces = (req, res) => {
  if (userInterfaces) {
    return res.json(userInterfaces);
  } else {
    return res.status(404).send("No Interface is found.");
  }
};

const addInterface = (req, res) => {
  const body = req.body;
  // Assuming userInterfaces is an object
  if (!userInterfaces[body.id]) {
    // Add the body with the key being body.id
    userInterfaces[body.id] = body;

    // Optionally save it to the file system if necessary
    fs.writeFile(
      "./data/userInterface.json",
      JSON.stringify(userInterfaces, null, 2),
      (error) => {
        if (error) {
          console.error("Error writing file:", error);
          return res.status(500).send("Server Error");
        }
        res.status(201).send("New entry added successfully");
      }
    );
  } else {
    // If the key already exists
    res.status(409).send("Entry with this ID already exists");
  }
};

const getInterfacebyId = (req, res) => {
  const id = req.params.id;

  // Check if the id exists in userInterfaces
  if (userInterfaces[id]) {
    return res.json(userInterfaces[id]);
  } else {
    // If the id does not exist, return a 404 status
    res.status(404).send(`Interface with ID ${id} not found`);
  }
};
const deleteInterfaceById = (req, res) => {
  const id = req.params.id;

  // Check if the id exists in userInterfaces
  if (userInterfaces[id]) {
    // Delete the entry from userInterfaces
    delete userInterfaces[id];

    // Save the updated object to the file system
    fs.writeFile(
      "./data/userInterfaces.json",
      JSON.stringify(userInterfaces, null, 2),
      (error) => {
        if (error) {
          console.error("Error writing file:", error);
          return res.status(500).send("Server Error");
        }
        res.status(200).send(`Interface with ID ${id} deleted successfully`);
      }
    );
  } else {
    // If the id does not exist, return a 404 status
    res.status(404).send(`Interface with ID ${id} not found`);
  }
};

// Other user methods...

module.exports = {
  deleteInterfaceById,
  addInterface,
  getAllInterfaces,
  getInterfacebyId,
};
