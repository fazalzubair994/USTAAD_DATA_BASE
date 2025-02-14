const express = require("express");
const {
  getAllUsers,
  singleUser,
  checkUser,
  updateUserResults,
  deleteUser,
  updateSettings,
  updateUserData,
} = require("../controllers/userController");

const router = express.Router();

router.get("/getAll", getAllUsers);
router.post("/checkUser", checkUser);
router.patch("/updateUserResults", updateUserResults);
router.patch("/updateUserInfo/:id", updateUserData);
router.patch("/updateUserSettings/:id", updateSettings);
router.get("/:id", singleUser);
router.delete("/:id", deleteUser);
// Other user routes...

module.exports = router;
