import { NextApiRequest, NextApiResponse } from "next";
import poolsScraping from "scraping/pools";
import { Activity, ApiResponseError } from "types/common.types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Activity[] | ApiResponseError>
) => {
  try {
    const activitiesEndpoints = ["pools", "climb", "rock"];
    const pools = await poolsScraping();
    console.log("here", pools);
    // const activitiesPromises = activitiesEndpoints.map((endpoint) =>
    // );
    // TODO merge different activities responses and handle in switch, for now only pools
    switch (pools) {
      case []:
      case null:
        return res.status(404).send({ error: "No pools scraped" });
      default:
        return res.status(200).json(pools);
    }
  } catch (e) {
    return res.status(500).send({ error: (e as Error).message });
  }
};
