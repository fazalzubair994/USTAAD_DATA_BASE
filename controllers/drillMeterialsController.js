const fs = require('fs');
let drillsData = require("../data/dirllMeterials.json")


const getAllDrills = (req, res) => {
    if (drillsData) {
      return res.json(drillsData);
    } else {
      return res.status(404).send("No Drill Data found.");
    }
  };
  
  const addNewDrill = (req, res) => {
      const body = req.body;
      // Assuming userInterfaces is an object
  if (!drillsData[body.id]) {
      // Add the body with the key being body.id
      drillsData[body.id] = body;
    
      // Optionally save it to the file system if necessary
      fs.writeFile(
        "./data/dirllMeterials.json", 
        JSON.stringify(drillsData, null, 2), 
        (error) => {
          if (error) {
            console.error("Error writing file:", error);
            return res.status(500).send("Server Error: " + error);
          }
          res.status(201).send("New entry added successfully");
        }
      );
    } else {
      // If the key already exists
      res.status(409).send("Entry with this ID already exists");
    }
    };
  
   const getDrillMeterialById =  (req, res) => {
      const id = req.params.id;
    
      // Check if the id exists in userInterfaces
      if (drillsData[id]) {
        return res.json(drillsData[id]);
        
      } else {
        // If the id does not exist, return a 404 status
        res.status(404).send(`Drill Meterials with ID ${id} not found`);
      }
    };
   const deleteDrillMeterialbyID =  (req, res) => {
      const id = req.params.id;
    
      // Check if the id exists in userInterfaces
      if (drillsData[id]) {
        // Delete the entry from userInterfaces
        delete drillsData[id];
    
        // Save the updated object to the file system
        fs.writeFile(
          "./data/dirllMeterials.json", 
          JSON.stringify(drillsData, null, 2), 
          (error) => {
            if (error) {
              console.error("Error writing file:", error);
              return res.status(500).send("Server Error");
            }
            res.status(200).send(`Drill Meterials with ID ${id} deleted successfully`);
          }
        );
      } else {
        // If the id does not exist, return a 404 status
        res.status(404).send(`Drill Meterials with ID ${id} not found`);
      }
    };
    
  
  // Other user methods...
  
  module.exports = { deleteDrillMeterialbyID, addNewDrill,getAllDrills,getDrillMeterialById};
  