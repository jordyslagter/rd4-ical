import { garbagePickupEventsToIcal } from "./conversions";
import { parseCalendarHTML } from "./parsing";

export default {
  async fetch(request, _, __): Promise<Response> {
    const url = new URL(request.url);

    const postalCode = url.searchParams.get("pc");
    const houseNumber = url.searchParams.get("nr");
    // ex: Teststraat 4F <-- the F here is the addition
    const houseNumberAddition = url.searchParams.get("t");

    if (!postalCode)
      return new Response("You need to specify a postal code using ?pc=", {
        status: 400,
      });
    if (!houseNumber)
      return new Response("You need to specify a house number using &nr=", {
        status: 400,
      });

    let rd4CalendarUrl = `https://www.rd4info.nl/NSI/Burger/Aspx/afvalkalender_public_text.aspx?pc=${postalCode}&nr=${houseNumber}`;

    if (houseNumberAddition) rd4CalendarUrl += `&t=${houseNumberAddition}`;

    const rd4Calendar = await fetch(rd4CalendarUrl);
    const html = await rd4Calendar.text();

    const events = parseCalendarHTML(html);

    const ical = garbagePickupEventsToIcal(events);
    const icalText = ical.toString();

    // Return as response
    return new Response(icalText, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="afvalkalender.ics"`,
      },
    });
  },
} satisfies ExportedHandler<Env>;
