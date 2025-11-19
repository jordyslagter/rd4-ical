# RD4 ICAL

Cloudflare worker that gives you garbage pickup dates as an ICAL.

## Usage

The worker runs on the URL `https://rd4-ical.jordyslagter.workers.dev`.
To make the URL usable in your calendar app, you need to add the needed
query parameters.

- _Postal code_: add `?pc=NNNNXX` to the URL.
- _House number_: add `&nr=XX` to the URL.
- _House number addition_: add `&t=X` to the URL.

So, for example for Teststraat 2 in 8787DS, this would be the url:

`https://rd4-ical.jordyslagter.workers.dev?pc=8787DS&nr=2`

If the address would have an addition, like Teststraat 2F in 8787DS, this would
be the url:

`https://rd4-ical.jordyslagter.workers.dev?pc=8787DS&nr=2&t=F`

## Compatibility

This project is compatible with any calendar that supports ICAL. To help keep
the project in Cloudflare's free tier I kindly ask to set your calendar's
polling rate to some low value like once a week or month.
