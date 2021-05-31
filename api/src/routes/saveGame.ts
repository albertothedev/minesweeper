const User = require("../models/user.model");
const Game = require("../models/game.model");

import passport from "passport";
import express from "express";

module.exports = (app: express.Application) =>
  app.post("/saveGame", (req: express.Request, res: express.Response) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err)
        return res.status(500).json({
          message:
            "there was a problem processing your request, please try again later",
        });
      else if (info || !user)
        User.find().exec((err2: any, result: any) => {
          if (err2) return res.status(500).send(err2);

          let usernamesArray: any = [];

          result.forEach((user2: any) => usernamesArray.push(user2.username));

          let username = `anonymous${
            Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
          }`;

          while (usernamesArray.forEach((elm: any) => elm === username))
            username = `anonymous${
              Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
            }`;

          let newGame = new Game({
            username,
            gameMode: req.body.gameMode,
            time: req.body.time,
          });

          newGame.save();
          return res.status(200).json({
            message: `game added to the database as ${username}`,
            username,
          });
        });
      else {
        let newGame = new Game({
          username: user.username,
          gameMode: req.body.gameMode,
          time: req.body.time,
        });

        newGame.save();

        return res.status(200).json({
          message: `game added to the database as ${user.username}`,
          username: user.username,
        });
      }
    })(req, res);
  });
