import ical from "ical-generator";
import { GarbagePickupEvent } from "./types";

const dutchMonthMap: Record<string, number> = Object.freeze({
  januari: 0,
  februari: 1,
  maart: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  augustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  december: 11,
});

export const convertStringDate = (dateStr: string): Date | null => {
  // Example: "Vrijdag 7 januari 2025"
  const parts = dateStr.split(" ");
  if (parts.length < 4) return null;

  const day = parseInt(parts[1]);
  const month = dutchMonthMap[parts[2].toLowerCase()];
  const year = parseInt(parts[3]);

  if (isNaN(day) || month === undefined || isNaN(year)) return null;

  return new Date(Date.UTC(year, month, day));
};

export const garbagePickupEventsToIcal = (
  garbagePickupEvents: Iterable<GarbagePickupEvent>,
) => {
  const calendar = ical({ name: "Afvalkalender" });

  for (const garbagePickupEvent of garbagePickupEvents) {
    calendar.createEvent({
      start: new Date(garbagePickupEvent.date),
      allDay: true,
      summary: garbagePickupEvent.garbageType,
    });
  }

  return calendar;
};
