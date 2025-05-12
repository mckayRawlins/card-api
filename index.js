const express = require("express");

const app = express();

const fs = require("fs");

const jwt = require("jsonwebtoken");
const secret = "secretstring";

const { expressjwt } = require("express-jwt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readFile("cards.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return;
    }

    const cardData = JSON.parse(data);

    res.json(cardData);
  });
});

app.get("/filtered", (req, res) => {
  fs.readFile("cards.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return;
    }
    /* const rawCardData = JSON.parse(data);
    const cardData = rawCardData.cards; */
    const cardData = JSON.parse(data);

    const { id, name, set, cardNumber, type, power, toughness, rarity, cost } =
      req.query;

    let filteredCards = cardData;

    if (id) {
      filteredCards = filteredCards.filter((card) => card.id === parseInt(id));
    }

    if (name) {
      filteredCards = filteredCards.filter((card) =>
        card.name.toLowerCase().includes(name)
      );
    }

    if (set) {
      filteredCards = filteredCards.filter(
        (card) => card.set.toLowerCase() === set
      );
    }

    if (cardNumber) {
      filteredCards = filteredCards.filter(
        (card) => card.cardNumber === parseInt(cardNumber)
      );
    }

    if (type) {
      filteredCards = filteredCards.filter((card) =>
        card.type.toLowerCase().includes(type)
      );
    }

    if (power) {
      filteredCards = filteredCards.filter(
        (card) => card.power === parseInt(power)
      );
    }

    if (toughness) {
      filteredCards = filteredCards.filter(
        (card) => card.toughness === parseInt(toughness)
      );
    }

    if (rarity) {
      filteredCards = filteredCards.filter(
        (card) => card.rarity.toLowerCase() === rarity
      );
    }

    if (cost) {
      filteredCards = filteredCards.filter(
        (card) => card.cost === parseInt(cost)
      );
    }

    res.json(filteredCards);
  });
});

/* app.put("/card/:id", (req, res) => {
  fs.readFile("cards.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return;
    }

    const rawCardData = JSON.parse(data);
    const cardData = rawCardData.cards;

    const cardId = req.params.id;
    const cardIndex = cardData.findIndex(
      (card) => card.id === parseInt(cardId)
    );

    if (cardIndex === -1) {
      return res.status(404).send("Card not found");
    }

    cardData[cardIndex] = {
      ...cardData[cardIndex],
      ...req.body,
    };

    rawCardData.cards = cardData;
    fs.writeFile("cards.json", JSON.stringify(rawCardData, null, 2), (err) => {
      if (err) {
        console.log("Error writing file", err);
        return res.status(500).send("Error updating card");
      }

      res.json(cardData[cardIndex]);
    });
  });
}); */

app.get("/update", (req, res) => {
  fs.readFile("cards.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return res.status(500).send("Error reading file");
    }

    /* const rawCardData = JSON.parse(data);
    const cardData = rawCardData.cards; */

    const cardData = JSON.parse(data);

    const { id, name, set, cardNumber, type, power, toughness, rarity, cost } =
      req.query;

    if (!id) {
      return res.status(404).send("Card ID is required");
    }
    console.log(cardData);

    const cardIndex = cardData.findIndex((card) => card.id === parseInt(id));

    if (cardIndex === -1) {
      return res.status(404).send("Card not found");
    }

    if (name) cardData[cardIndex].name = name;
    if (set) cardData[cardIndex].set = set;
    if (cardNumber) cardData[cardIndex].cardNumber = cardNumber;
    if (type) cardData[cardIndex].type = type;
    if (power) cardData[cardIndex].power = power;
    if (toughness) cardData[cardIndex].toughness = toughness;
    if (rarity) cardData[cardIndex].rarity = rarity;
    if (cost) cardData[cardIndex].cost = cost;

    fs.writeFile("cards.json", JSON.stringify(cardData, null, 2), (err) => {
      if (err) {
        console.log("Error writing file", err);
        return res.status(500).send("Error updating card");
      }

      res.json(cardData[cardIndex]);
    });
  });
});

app.get("/create", (req, res) => {
  fs.readFile("cards.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return res.status(500).send("Error reading file");
    }

    /* const rawCardData = JSON.parse(data);
    const cardData = rawCardData.cards; */
    const cardData = JSON.parse(data);

    const { name, set, cardNumber, type, power, toughness, rarity, cost } =
      req.query;

    if (name || set || type || power || toughness || rarity || cost) {
      const newCard = {
        id: cardData.length + 2,
        name: name,
        set: set,
        cardNumber: cardNumber,
        type: type,
        power: power,
        toughness: toughness,
        rarity: rarity,
        cost: cost,
      };
      cardData.push(newCard);

      const updateCardsJson = JSON.stringify(cardData, null, 2);
      fs.writeFile("cards.json", updateCardsJson, "utf8", (err) => {
        if (err) {
          console.error("Failed to write:", err);
          rerturn;
        }
        console.log("File written");
        res.send("Card created", newCard);
      });
    }
  });
});

app.listen(3000, () => {
  console.log("listening");
});
