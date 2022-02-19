require("dotenv").config();

import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app: express.Application = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.MINESWEEPER_UI_URL || "http://localhost:8080",
  })
);

app.use(cookieParser());
app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MINESWEEPER_MONGODB_URI as string);
}

require("./config/passport");

require("./routes/signUp")(app);
require("./routes/signIn")(app);
require("./routes/saveGame")(app);
require("./routes/leaderboard")(app);
require("./routes/user")(app);
require("./routes/logOut")(app);

app.listen(process.env.MINESWEEPER_PORT || 5002, () => console.log(`Listening on PORT ${process.env.MINESWEEPER_PORT || 5002}`));
