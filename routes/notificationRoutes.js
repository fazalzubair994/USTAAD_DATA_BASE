const express = require("express");
const {
  getAllNotification,
  addNotification,
  deleteNotification,
} = require("../controllers/notificationsController");

const router = express.Router();

router.get("/getAll", getAllNotification);
router.post("/add", addNotification);
router.delete("/:id", deleteNotification);
// Other user routes...

module.exports = router;
