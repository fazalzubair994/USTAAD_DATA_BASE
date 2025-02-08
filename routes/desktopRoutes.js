const express = require("express");
const { getAllUsers, checkUser } = require("../controllers/desktopController");

const router = express.Router();

router.get("/getAll", getAllUsers);
router.post("/checkUser", checkUser);
// Other user routes...

module.exports = router;
