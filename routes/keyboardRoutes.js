const express = require("express");
const { getAllKeyboards, getKeyboardByName, addKeyboard, deleteKeyboard } = require("../controllers/keyboardController");

const router = express.Router();

router.get("/allkeyboards", getAllKeyboards);
router.get("/:keyboardName", getKeyboardByName);
router.post("/add", addKeyboard);
router.delete("/:keyboardName", deleteKeyboard);

module.exports = router;
