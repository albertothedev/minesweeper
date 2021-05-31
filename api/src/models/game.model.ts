import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  username: String,
  gameMode: String,
  time: Number,
});

const Game = mongoose.model("Game", gameSchema, "games");

module.exports = Game;
