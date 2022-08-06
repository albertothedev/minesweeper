import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  username: String,
  gameMode: String,
  time: Number,
});

export default mongoose.models.Game || mongoose.model("Game", GameSchema);
