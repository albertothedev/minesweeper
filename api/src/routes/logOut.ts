import passport from "passport";
import express from "express";

module.exports = (app: express.Application) =>
  app.get("/logOut", (req: express.Request, res: express.Response) =>
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err)
        return res.status(500).json({
          status: 500,
          message:
            "there was a problem processing your request, please try again later",
        });
      else if (info || !user)
        return res.status(500).json({
          status: 500,
          message:
            "there was a problem processing your request, please try again later",
        });
      else {
        res.clearCookie("jwt");
        res.status(200).end();
      }
    })(req, res)
  );
