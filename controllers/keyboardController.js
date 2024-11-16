const fs = require("fs");
let keyboards = require("../data/Keyboards.json");

const getAllKeyboards = (req, res) => {
  if (keyboards && keyboards.length > 0) {
    return res.json(keyboards);
  } else {
    return res.status(404).send("No keyboards found.");
  }
};

const getKeyboardByName = (req, res) => {
  const keyboardName = req.params.keyboardName;
  const keyboard = keyboards.find((kb) => kb.properties.name === keyboardName);
  if (keyboard) {
    return res.json(keyboard);
  } else {
    return res.status(404).send("Keyboard not found.");
  }
};

const addKeyboard = (req, res) => {
  const body = req.body;
  keyboards.push({ ...body });
  fs.writeFile("./data/Keyboards.json", JSON.stringify(keyboards), (error) => {
    if (error) {
      console.log(error);
    } else {
      return res.end("Success: ");
    }
  });
};

const deleteKeyboard = (req, res) => {
  const keyboardName = req.params.keyboardName;
  keyboards = keyboards.filter((kb) => kb.properties.name !== keyboardName);
  fs.writeFile("./data/Keyboards.json", JSON.stringify(keyboards), (error) => {
    if (error) {
      console.log(error);
    } else {
      return res.end("Deleted: " + keyboardName);
    }
  });
};

module.exports = {
  getAllKeyboards,
  getKeyboardByName,
  addKeyboard,
  deleteKeyboard,
};
