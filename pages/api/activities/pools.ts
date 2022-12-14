import { DateTime } from "luxon";
import * as cheerio from "cheerio";
import { Activity, ActivityType } from "../../../types/common.types";
import { poolNames } from "../../../types/activities.types";

// TODO see if there is an improvement by making this a dedicated endpoint, and Promise.racing all different sources to prevent loading
async function poolsScraping(): Promise<Activity[] | null> {
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
  const mappedSwimSlots = poolNames.flatMap(({ id }) => {
    const searchSwimSlots = `tr[data-id=${id}] td.paris-table-td.parts`;
    const swimSlots: string[] = Array.from(
      $(searchSwimSlots)
        .map((i, element) => {
          return $(element).text().trim().toString();
        })
        .get()
    );
    // Hours regex : /\d{1,2}:\d{2}\sà\s\d{1,2}:\d{2}/gm to extract XX:XX
    return swimSlots.map((swimSlot, swimSlotIndex) => {
      return swimSlot
        .match(/\d{1,2}:\d{2}\sà\s\d{1,2}:\d{2}/gm)
        ?.map((matchedSwimSlot) => ({
          pool: id,
          swimDate: swimDates[swimSlotIndex],
          swimSlot: matchedSwimSlot,
        }));
    });
  });
  return mappedSwimSlots.flatMap((mappedSingleDaySwimSlots) => {
    const swimmingDates = mappedSingleDaySwimSlots?.flatMap(
      (singleDaySwimSlot) => {
        return singleDaySwimSlot.swimSlot.split(/\s.\s/).map((swimSlot) => {
          // map  mer.21/09 et 12:00 à une date
          const formattedSwimDate = singleDaySwimSlot.swimDate
            .split(".")[1]
            .trim();
          const dateString = `${formattedSwimDate}/${new Date().getFullYear()} ${swimSlot}`;
          return DateTime.fromFormat(dateString, "dd/MM/yyyy hh:mm", {
            zone: "Europe/Paris",
          }).toJSDate();
        });
      }
    );

    const activitiesArray: Activity[] = [];
    // Final mapping of swimming dates
    if (swimmingDates) {
      for (let i = 0; i < swimmingDates.length; i = i + 2) {
        activitiesArray.push({
          type: ActivityType.pool,
          poolId: mappedSingleDaySwimSlots
            ? mappedSingleDaySwimSlots[0].pool
            : "",
          start: swimmingDates[i].toString(),
          end: swimmingDates[i + 1].toString(),
        });
      }
    }
    return activitiesArray;
  });
}

export default poolsScraping;
