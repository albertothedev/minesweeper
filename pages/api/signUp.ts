import passport from "passport";
import jwt from "jsonwebtoken";
import express from "express";

module.exports = (app: express.Application) =>
  app.post("/signUp", (req: express.Request, res: express.Response) =>
    passport.authenticate("signUp", (err, user, info) => {
      if (err)
        return res.status(500).json({
          message:
            "there was a problem processing your request, please try again later",
        });

      if (info)
        return res.status(404).json({
          message: "the username is already in use",
        });

      if (user)
        req.login(user, { session: false }, (err2) => {
          if (err2)
            return res.status(500).json({
              message:
                "there was a problem processing your request, please try again later",
            });

          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET as string
          );

          res.cookie("jwt", token).status(200).json({
            username: user.username,
            message: `your account has been created`,
          });
        });
    })(req, res)
  );
