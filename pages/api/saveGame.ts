import { type NextApiRequest, type NextApiResponse } from "next";

import dbConnect from "config/mongoose";
import Game from "models/game.model";

const generateRandomUsername = () => {
  return `anonymous${Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000}`;
};

export default async function addPlayer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const username = generateRandomUsername();

  const newGame = new Game({
    username,
    gameMode: req.body.gameMode,
    time: req.body.time,
  });

  newGame.save();
  return res.status(200).json({
    message: `game added to the database as ${username}`,
    username,
  });
}
