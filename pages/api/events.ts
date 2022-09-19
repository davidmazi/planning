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
    const searchSwimDates = `th.paris-table-th.parts`;
    const searchSwimHours = `a[href=""]`;
    const swimDates: string[] = $(searchSwimDates)
      .map((i, element) => {
        return $(element).text().trim().toString();
      })
      .get();
    console.log(swimDates);
    res.statusCode = 200;
    return res.json({
      swimDates,
    });
  } catch (e) {
    // 5
    console.error(e);
    res.statusCode = 500;
    // TODO better handling
    return res.json({ message: "ERROR" });
  }
};
