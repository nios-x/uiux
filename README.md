# Mountain Retreat: Design Decode ’26 redesign

A single-screen redesign of the listing-detail screen, in a minimal, cool style.

| Deliverable | File |
|---|---|
| Final screen (PNG, @2x) | `design/export/s1.png` |
| Presentation boards (PNG) | `design/export/board-b1.png` (problem → solution), `design/export/board-b2.png` (design system) |
| Submission PDF (screen + boards) | `design/export/Mountain-Retreat-Redesign.pdf` |
| UX write-up | `design/UX-writeup.md` · `design/export/Mountain-Retreat-UX-Writeup.pdf` |
| Figma builder plugin | `design/figma-plugin/` |

## Get it into Figma (editable layers)
1. Open the Figma **desktop app** and your file.
2. Go to **Plugins → Development → Import plugin from manifest…** and pick `design/figma-plugin/manifest.json`.
3. Run **Plugins → Development → Mountain Retreat Redesign Builder**.

The plugin creates the following on the current page:
- Colour variables (*Glacier tokens*) and text styles
- Local components: Button/Primary, Spec item, Highlight row, Glass button, and icon components with instance-swap properties
- The editable **01 · Listing detail** screen (390 × 844), built with auto-layout
- The original screen (for before/after comparison) and both presentation boards

## Source
- `design/screens.html` and `design/board.html` are the HTML sources for the exports. `design/icons.js` holds the Lucide-style icons (ISC licence).
- To rebuild the plugin after changing an asset, run `node design/figma-plugin/build.js`.
