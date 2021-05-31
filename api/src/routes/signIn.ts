import passport from "passport";
import jwt from "jsonwebtoken";
import express from "express";

module.exports = (app: express.Application) =>
  app.post("/signIn", (req: express.Request, res: express.Response) =>
    passport.authenticate("signIn", (err, user, info) => {
      if (err)
        return res.status(500).json({
          message:
            "there was a problem processing your request, please try again later",
        });

      if (info)
        return res.status(500).json({
          message:
            "there was a problem processing your request, please try again later",
        });

      if (user)
        req.login(user, { session: false }, (err2) => {
          if (err2) return res.status(500).send(err2);

          const token = jwt.sign(
            { _id: user._id },
            process.env.MINESWEEPER_JWT_SECRET as string
          );

          res.cookie("jwt", token, { httpOnly: false });
          res.status(200).json({
            username: user.username,
            token,
            message: `you are logged in as ${user.username}`,
          });
        });

      if (!user)
        return res.status(404).json({
          message:
            "we couldn't find a user with that username and password combination",
        });
    })(req, res)
  );
