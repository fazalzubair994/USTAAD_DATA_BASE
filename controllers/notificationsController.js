const fs = require("fs");
const path = require("path"); // Add this line

// Load the user data from the JSON file
let notifications = require("../data/Notifications.json");

const getAllNotification = (req, res) => {
  console.log("Fetching all notifications...");
  if (notifications) {
    return res.status(201).json({ notifications: notifications });
  } else {
    return res.status(404).send("No Notification found.");
  }
};
const addNotification = (req, res) => {
  console.log("Adding a new notification...");
  const notification = req.body;
  if (notification) {
    notifications.push(notification);
    fs.writeFile(
      path.join(__dirname, "../data/Notifications.json"), // absolute path from this file,
      JSON.stringify(notifications),
      (error) => {
        if (error) {
          return res.status(404).send("Server Error: " + error);
        } else {
          return res.send("New Notification has been Added.....");
        }
      }
    );
  } else {
    return res
      .status(404)
      .send("Error in Adding the Notification: " + notification);
  }
};
const deleteNotification = (req, res) => {
  const id = req.params.id;
  console.log("Deleting notification with id:", id);
  if (id) {
    // Check if the card with the specified id exists first
    const cardExists = notifications.find((card) => card.id === id);

    if (cardExists) {
      // Proceed to filter out the card for deletion
      const updatedCards = notifications.filter((card) => card.id !== id);

      notifications = updatedCards;

      fs.writeFile(
        path.join(__dirname, "../data/Notifications.json"),
        JSON.stringify(notifications),
        (error) => {
          if (error) {
            console.log(error);
            return res.status(404).send("File not found.");
          } else {
            return res.json("Deletion successful for id: " + id);
          }
        }
      );
    } else {
      // If the card does not exist, send an appropriate message
      return res.json("No card available with id: " + id);
    }
  } else {
    return res.status(404).send("Invalid ID....: " + id);
  }
};

module.exports = {
  getAllNotification,
  addNotification,
  deleteNotification,
};
