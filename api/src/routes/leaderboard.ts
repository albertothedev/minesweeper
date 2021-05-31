import express from "express";

const Game = require("../models/game.model");
import { TGame } from "../types/index";

module.exports = (app: express.Application) =>
  app.get("/leaderboard", (req: express.Request, res: express.Response) =>
    Game.find({}).exec((err: any, results: Array<TGame>) => {
      if (err) return res.status(500).send(err);

      let games: Array<TGame> = [];

      results.forEach((result: TGame) => games.push(result));
      return res.send(games);
    })
  );
