import { NextApiRequest, NextApiResponse } from "next";
import poolsScraping from "./pools";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseTypeTODO>
) => {
  try {
    const activitiesEndpoints = ["pools", "climb", "rock"];
    const test = await poolsScraping();
    // const activitiesPromises = activitiesEndpoints.map((endpoint) =>
    // );
    res.statusCode = 200;

    return res.json(test);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    // TODO better handling
    return res.json({ message: "ERROR" });
  }
};
