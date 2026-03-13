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
