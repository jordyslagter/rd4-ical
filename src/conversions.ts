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

// we need to generate a deterministic id for events to make sure calendars
// don't refresh unnecesarily
const makeId = async (event: GarbagePickupEvent) => {
  const data = new TextEncoder().encode(`${event.date}:${event.garbageType}`);

  const hashBuffer = await crypto.subtle.digest("SHA-1", data);

  return (
    [...new Uint8Array(hashBuffer)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("") + "@afvalkalender"
  );
};

export const garbagePickupEventsToIcal = async (
  garbagePickupEvents: Iterable<GarbagePickupEvent>,
) => {
  const calendar = ical({ name: "Afvalkalender" });

  for (const garbagePickupEvent of garbagePickupEvents) {
    const id = await makeId(garbagePickupEvent);

    calendar.createEvent({
      id,
      start: new Date(garbagePickupEvent.date),
      allDay: true,
      summary: garbagePickupEvent.garbageType,
    });
  }

  return calendar;
};
