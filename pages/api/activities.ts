import {NextApiRequest, NextApiResponse} from 'next';
import * as cheerio from 'cheerio';

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
    const swimDates: string[] = $(searchSwimDates)
      .map((i, element) => {
        return $(element).text().trim().toString();
      })
      .get();

    // Hardcoded to only retrieve data-ids of Suzanne Berlioux=2916, Jacqueline Auriol=17349 and Bernard Lafay=2940
    const poolsDataIds = ['2916', '17349', '2940'];
    // TODO use or change type Activity
    const mappedSwimSlots = poolsDataIds.map((dataId) => {
        const searchSwimSlots = `tr[data-id=${dataId}] td.paris-table-td.parts`;
        const swimSlots: string[] = Array.from(
          $(searchSwimSlots)
            .map((i, element) => {
              return $(element).text().trim().toString();
            })
            .get()
        );
        // Hours regex : /\d{1,2}:\d{2}\sà\s\d{1,2}:\d{2}/gm to extract XX:XX
        return swimSlots.flatMap((swimSlot, swimSlotIndex) => {
          return swimSlot
            .match(/\d{1,2}:\d{2}\sà\s\d{1,2}:\d{2}/gm)?.map((matchedSwimSlot) => ({
              pool: dataId,
              swimDate: swimDates[swimSlotIndex],
              swimSlot: matchedSwimSlot
            }))
        })

        return {dataId, swimSlots}

      }
    );
    res.statusCode = 200;

    return res.json(mappedSwimSlots.flat());
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    // TODO better handling
    return res.json({ message: "ERROR" });
  }
};
