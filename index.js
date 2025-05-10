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
    const rawCardData = JSON.parse(data);
    const cardData = rawCardData.cards;

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

app.listen(3000, () => {
  console.log("listening");
});
