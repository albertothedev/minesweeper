import { type NextApiRequest, type NextApiResponse } from "next";

import passport from "passport";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  passport.authenticate(
    "JWTFromCookie",
    { session: false },
    (err, user, info) => {
      if (err) return res.status(500).send(err);

      if (info) return res.status(400).send(info);

      if (user) return res.status(200).json({ username: user.username });
    }
  )(req, res);
}
