let languageCards = require("../data/languageCards.json");

const fs = require("fs");

const getAllCards = (req, res) => {
  if (languageCards) {
    return res.json(languageCards);
  } else {
    return res.status(404).send("No Language Cards found.");
  }
};
const addCard = (req, res) => {
  const newCard = req.body;
  if (newCard) {
    languageCards.push(newCard);
    fs.writeFile(
      "./data/languageCards.json",
      JSON.stringify(languageCards),
      (error) => {
        if (error) {
          return res.status(404).send("Server Error: " + error);
        } else {
          return res.send("New Card has been Added.....");
        }
      }
    );
  } else {
    return res.status(404).send("Error in Language Card: " + newCard);
  }
};

const singleCard = (req, res) => {
  const id = req.params.id;
  if (id) {
    const card = languageCards.find((card) => card.id === Number(id));
    if (card) {
      return res.json(card);
    } else {
      return res.status(404).send("No card Available with this id: " + id);
    }
  } else {
    return res.status(404).send("Invalid ID....");
  }
};
const deleteCard = (req, res) => {
  const id = req.params.id;
  if (id) {
    // Check if the card with the specified id exists first
    const cardExists = languageCards.find((card) => card.id === Number(id));

    if (cardExists) {
      // Proceed to filter out the card for deletion
      const updatedCards = languageCards.filter(
        (card) => card.id !== Number(id)
      );

      languageCards = updatedCards;

      fs.writeFile(
        "./data/languageCards.json",
        JSON.stringify(languageCards),
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

module.exports = { getAllCards, addCard, deleteCard, singleCard };
