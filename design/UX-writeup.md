# Mountain Retreat: UX write-up
**Design Decode ’26 · Single-screen redesign (listing detail, iOS 390 × 844)**

## 1. What the screen must do
This is a holiday-stay listing. A visitor needs to answer four questions quickly, in this order: *What does it look like? Where is it, and can I trust it? Does it fit my group? What does it cost, and how do I book?* The redesign keeps all of the original content and both of its actions (Back and Book now) and reorders the page around those four questions.

## 2. Key problems in the original
| # | Problem | Why it hurts |
|---|---|---|
| 1 | **No visual hierarchy.** A red-on-yellow title, five differently tinted boxes, gradients and roughly five typefaces all compete with each other. | The eye has no entry point, so users scan randomly and the screen feels cheap and untrustworthy. |
| 2 | **False affordances.** The location is an all-caps pink pill that looks like a button, and “(23 reviews)” is underlined purple like a web link. | Users tap things that do nothing, and all caps reduces legibility. |
| 3 | **An inefficient rating.** Five oversized stars fill a row just to say “5.0”. | They take space away from content that matters, and the yellow stars on a pale background fail contrast. |
| 4 | **Unlabelled facts.** “2 · 1 · 1” sits under icons with no labels, and each tile uses a different colour. | Users have to guess (is 1 a car, a garage, or a car hire?). Colour is used without meaning. |
| 5 | **Buried and repeated content.** Two paragraphs repeat “cozy” and the setting. Key facts such as *sleeps four*, hiking and fishing are hidden in prose. | Low scannability: the most decision-relevant fact (capacity) is the hardest to find. |
| 6 | **Accessibility failures.** The grey italic text on lavender is about 2.4:1, and the stars on yellow are about 1.3:1. | Both fail WCAG AA (4.5:1 for body text). |
| 7 | **Competing calls to action.** A neon-green “Book now” and a hot-pink price block look equally important. The price has no dates or guest context. | Users aren’t sure what the primary action is or what they will pay. |
| 8 | **Inconsistent controls.** The back button is red (a colour normally used for errors or deletion). “1 / 8” is the only hint that there are more photos. There is no save or share. | Colour sends the wrong signal, and the gallery is hard to discover. |

## 3. Principal solutions
1. **A paper card at 80% height.** The listing sits on one white card (inset 10 pt, 32 pt radius) over the photo, so there is one surface and one reading order. The photo stays visible above the card, and the gallery thumbnails break out of its top edge. That signals more photos and makes the image feel tangible.
2. **One loud element.** Only the title is expressive (Instrument Serif, 38 pt). Everything else uses Inter on a four-step neutral ink scale. Hierarchy comes from size, weight and spacing, not from colour.
3. **Honest affordances.** The location is plain text with a pin icon. The only tappable parts are the blue **Map ↗** link and the underlined **23 reviews**. Glacier blue is reserved for things you can interact with.
4. **A compact trust line.** ★ 5.0 · 23 reviews · *Guest favourite* badge, all on one line.
5. **Labelled facts.** A single grouped row shows icon + value + label: **4 Guests · 2 Bedrooms · 1 Bathroom · 1 Parking**. “Sleeps four” moves out of the paragraph and becomes the first fact users see.
6. **Content design.** The two repeated paragraphs become three scannable highlights (*Views to the horizon*, *Hike & fish nearby*, *Warm, cosy interior*), followed by one short summary with **Read more**.
7. **A single sticky action with context.** The bottom bar shows **$299 / night**, the chosen **dates and guests** (tappable to edit), and one dark **Book now** button in the thumb zone. There are no competing colours.
8. **Consistent controls.** Neutral glass Back and Share buttons sit over the photo. Save is a floating heart. The “+4” thumbnail replaces the tiny “1 / 8” counter.

## 4. Design rationale
- **Flow:** the page reads top to bottom as *look → identify → trust → fit → feel → act*. The primary action is always visible, so a user can book at any point without scrolling back.
- **Hierarchy and layout:** a 4-pt spacing grid with 20 pt side margins. Spacing groups related items (identity, facts, highlights) instead of boxing everything. Radii step up from 12 to 16, 18, 20 and 32 by component size.
- **Typography:** two families with clear roles. Instrument Serif gives the listing name an editorial, premium feel. Inter covers all UI text: 15/14 pt body, 12 pt labels and an uppercase tracked eyebrow for category.
- **Colour (minimal, cool):** glacier neutrals taken from the photo’s snow and slate. Ink #0F1B26, Ink-2 #3B4954, Muted #5E6B76, one accent (Glacier #1E5BC6, used only for interactive elements), and warm amber reserved for the star.
- **Accessibility:** every text/background pair meets WCAG 2.2 AA. Ink is 17.4:1, body text 9.3:1, muted text 5.5:1 and the link colour 6.2:1. Every tap target is at least 44 pt (the primary button is 56 pt). No information depends on colour alone: facts have labels and links are underlined or have arrows. Controls carry accessible labels (Back, Share, Save to wishlist).
- **Consistency and components:** in Figma, the screen uses local components (Button/Primary, Spec item, Highlight row, Glass button, and a set of icons with instance-swap properties), colour variables (*Glacier tokens*) and text styles. Every repeated element is an instance.

## 5. Result
The redesign keeps the same content and the same purpose (view a cabin and book it), but the page now has a clear entry point, scannable facts, accessible contrast and a single obvious next step.
