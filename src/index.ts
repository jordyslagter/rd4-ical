/**
 * Copyright 2026 Jordy Slagter
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { garbagePickupEventsToIcal } from "./conversions";
import { parseCalendarHTML } from "./parsing";

export default {
  async fetch(request, _, __): Promise<Response> {
    const url = new URL(request.url);

    const postalCode = url.searchParams.get("pc");
    const houseNumber = url.searchParams.get("nr");
    // ex: Teststraat 4F <-- the F here is the addition
    const houseNumberAddition = url.searchParams.get("t");

    if (!postalCode && !houseNumber) {
      return new Response(
        "You need to specify a postal code using ?pc= and a house number " +
          "using &nr=",
        {
          status: 400,
        },
      );
    }
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
