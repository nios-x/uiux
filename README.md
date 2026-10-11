# Mountain Retreat: Design Decode ’26 redesign

A single-screen redesign of the listing-detail screen, in a minimal, cool style.

| Deliverable | File |
|---|---|
| Final screen (PNG, @2x) | `design/export/s1.png` |
| Presentation boards (PNG) | `design/export/board-b1.png` (problem → solution), `design/export/board-b2.png` (design system) |
| Submission PDF (screen + boards) | `design/export/Mountain-Retreat-Redesign.pdf` |
| UX write-up | `design/UX-writeup.md` · `design/export/Mountain-Retreat-UX-Writeup.pdf` |
| Editable screen for Figma (SVG) | `design/export/Mountain-Retreat-screen.svg` |
| Figma builder plugin (desktop app) | `design/figma-plugin/` |

## Get it into Figma in the browser (no app needed)
1. Open the Figma file in your browser.
2. Drag `design/export/Mountain-Retreat-screen.svg` onto the canvas. It imports as editable layers: text you can edit, vector shapes and icons, with the photo as one background image.
3. Drag `design/export/board-b1.png` and `design/export/board-b2.png` next to it.
4. Click **Share**, then set **Anyone with the link → can view**, and copy the link.

To regenerate the SVG after changing `screens.html`, run `node design/tools/html2svg.js` from `design/`.

## Alternative: Figma desktop plugin (adds components, variables and text styles)
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
