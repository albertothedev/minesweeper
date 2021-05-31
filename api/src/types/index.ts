import mongoose from "mongoose";

export interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
}

export type TGame = {
  username: string;
  gameMode: "easy" | "medium" | "hard";
  time: number;
};
