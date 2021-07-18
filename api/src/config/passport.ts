import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import express from "express";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;

const User = require("../models/user.model");

passport.use(
  "signIn",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) =>
      User.where({ username })
        .findOne()
        .exec((err: any, user: any) => {
          if (err) return done(err);
          else if (user)
            user.validatePassword(password, (err2: any, match: any) => {
              if (err2) return done(err2);
              else if (!match) return done(null, false);
              else return done(null, user);
            });
          else return done(null, false);
        })
  )
);

passport.use(
  "signUp",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) =>
      User.where({ username })
        .findOne()
        .exec((err: any, user: any) => {
          if (err) return done(err);
          else if (user) return done(null, false, { message: "username already in use" });
          else {
            let newUser = new User({ username, password });
            newUser
              .save()
              .then((result: any) => done(null, result))
              .catch((err2: any) => done(err2));
          }
        })
  )
);

passport.use(
  "JWTFromCookie",
  new JwtStrategy(
    {
      jwtFromRequest: (req: express.Request) => req.cookies.jwt,
      secretOrKey: process.env.MINESWEEPER_JWT_SECRET,
      passReqToCallback: true,
    },
    (req: express.Request, jwt_payload: any, done: any) =>
      User.findOne()
        .where({ _id: jwt_payload._id })
        .exec((err: any, result: any) => (err ? done(err) : done(null, result)))
  )
);
