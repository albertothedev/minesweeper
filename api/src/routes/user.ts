import passport from "passport";
import express from "express";

module.exports = (app: express.Application) =>
  app.get("/user", (req: express.Request, res: express.Response) =>
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) return res.status(500).send(err);

      if (info) return res.status(400).send(info);

      if (user) return res.status(200).json({ username: user.username });
    })(req, res)
  );
