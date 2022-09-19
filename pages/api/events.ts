import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseTypeTODO>
) => {
  try {
    const responseSwim = await fetch(
      `https://www.paris.fr/lieux/piscines/tous-les-horaires`
    );
    const htmlStringSwim = await responseSwim.text();
    const $ = cheerio.load(htmlStringSwim);
    const searchSwimDates = `thead[data-target="equipments-timetables.tableHeader"]`;
    const searchSwimHours = `a[href=""]`;
    const swimDate = $(searchSwimDates).text();

    res.statusCode = 200;
    return res.json({
      swimDate,
    });
  } catch (e) {
    // 5
    res.statusCode = 404;
    // TODO better handling
    return res.json({ message: "NOT FOUND" });
  }
};
