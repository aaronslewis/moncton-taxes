# Weekly themes workflow

The `/voices` page renders themes from `src/data/voices.json`. That file is
updated manually each week from the raw Netlify Forms submissions. The site
publishes themes, never raw messages.

## Cadence

Once per week (Monday morning works). Skip the week if there aren't enough new
submissions to summarize honestly — better to publish nothing than to invent
patterns from three messages.

## Steps

1. **Export submissions** from the Netlify dashboard:
   - Netlify → site → *Forms*
   - Two forms: `category-feedback` and `big-picture-feedback`
   - For each, export the last 7 days as CSV.

2. **Summarize with Claude** (or do it by hand if volume is low). Suggested prompt:

   > Below are anonymous citizen submissions about Moncton's municipal budget,
   > collected during the week of `<DATE>`. Identify the top 3–6 recurring
   > themes. For each theme: name the category it relates to (or "Big picture"
   > if it's a general comment), write a one-paragraph summary in neutral
   > civic-journalism tone, and count the submissions that contributed to it.
   > Do not quote individual submissions. Do not include identifying details.
   > If fewer than ~5 submissions are present overall, respond with "Not enough
   > volume to summarize honestly this week."
   >
   > Return JSON in this shape:
   > `{ "themes": [ { "category": "...", "theme": "...", "sampleSize": N }, ... ] }`
   >
   > Submissions:
   > `<paste CSV rows here>`

3. **Update `src/data/voices.json`**: prepend the new week to the `weeks` array.
   `weekOf` is the ISO date of the Monday for that week.

   ```json
   {
     "weeks": [
       {
         "weekOf": "2026-05-18",
         "themes": [
           {
             "category": "Protective Services",
             "theme": "...",
             "sampleSize": 12
           }
         ]
       }
     ]
   }
   ```

4. **Commit and push.** Netlify rebuilds; the new week appears on `/voices`.

## Guardrails

- **Never** publish individual submissions or quotes. Themes only.
- **Never** include identifying details (names, addresses, employer references)
  even when paraphrasing.
- If a theme is just one or two people, don't publish it — it isn't a theme.
- If a week's submissions are dominated by spam or coordinated content (e.g., a
  single talking point repeated verbatim), discard them and note it internally;
  don't publish.
- The site is not a journalist; it's a transparency aggregator. Keep summaries
  descriptive ("residents asked about X"), not editorial ("residents are
  rightly frustrated by X").

## Why manual

At soft-launch volume, manual is the right pace. It keeps editorial control
local (no automated pipeline pushing sloppy summaries to a public page), and
the marginal cost per week is ~15 minutes. Automation can come later if volume
warrants it.
