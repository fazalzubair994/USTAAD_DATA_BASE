const express = require("express");
const { getAllCards,addCard,deleteCard, singleCard} = require("../controllers/languageCards");

const router = express.Router();
 
router.get("/getAll", getAllCards);
router.post("/add", addCard);
router.get("/:id", singleCard);
router.delete("/:id", deleteCard);
// Other user routes...

module.exports = router;
