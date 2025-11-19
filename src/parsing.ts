import { parseHTML } from "linkedom";
import { GarbagePickupEvent } from "./types";
import { convertStringDate } from "./conversions";

export const parseCalendarHTML = (html: any) => {
  const { document } = parseHTML(html);
  const rows = [...document.querySelectorAll("tr")];

  const events: GarbagePickupEvent[] = [];

  rows.forEach((row) => {
    const columns = row.querySelectorAll("td");
    if (columns.length === 2) {
      const dateString = columns[0].textContent?.trim();
      const garbageType = columns[1].textContent?.trim();

      if (!dateString) return;

      const jsDate = convertStringDate(dateString);

      if (!jsDate) return;

      events.push({ date: jsDate, garbageType });
    }
  });

  return Object.freeze(events);
};
