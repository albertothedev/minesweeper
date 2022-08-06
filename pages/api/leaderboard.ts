import { type NextApiRequest, type NextApiResponse } from "next";

import dbConnect from "config/mongoose";
import Game from "models/game.model";
import { TGame } from "types/index";

export default async function addPlayer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  Game.find({}).exec((err: any, results: Array<TGame>) => {
    if (err) return res.status(500).send(err);

    let games: Array<TGame> = [];

    results.forEach((result: TGame) => games.push(result));
    return res.send(games);
  });
}