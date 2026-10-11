// Mountain Retreat — Design Decode '26
// Figma plugin that builds the redesign as editable layers:
// colour variables, text styles, local components, the listing screen and the presentation boards.
// Built by build.js, which inlines the image assets + icons below.

/*__ASSETS__*/

const ROOT_X = 0, ROOT_Y = 0;
const C = {
  ink: '#0F1B26', ink2: '#3B4954', muted: '#5E6B76', faint: '#8A96A0', line: '#E6EBEF',
  surface: '#F3F6F8', page: '#EAEFF3', accent: '#1E5BC6', accentSoft: '#E7EFFB', star: '#E5A019',
  ok: '#147A4B', okSoft: '#E5F4EC', white: '#FFFFFF', divider: '#DDE4E9', stepper: '#CFD8DE'
};
const hex = h => { h = h.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }; };

// ---------- fonts ----------
let SERIF = { family: 'Instrument Serif', style: 'Regular' };
let SERIF_I = { family: 'Instrument Serif', style: 'Italic' };
const F = { r: { family: 'Inter', style: 'Regular' }, m: { family: 'Inter', style: 'Medium' }, s: { family: 'Inter', style: 'Semi Bold' }, b: { family: 'Inter', style: 'Bold' } };
async function loadFonts() {
  for (const f of Object.values(F)) await figma.loadFontAsync(f);
  try { await figma.loadFontAsync(SERIF); await figma.loadFontAsync(SERIF_I); }
  catch (e) { SERIF = F.r; SERIF_I = F.r; }
}

// ---------- variables (colour tokens) ----------
const VARS = {};
function makeVariables() {
  try {
    const col = figma.variables.createVariableCollection('Glacier tokens');
    const mode = col.modes[0].modeId;
    col.renameMode(mode, 'Light');
    const tokens = { 'color/ink': C.ink, 'color/ink-2': C.ink2, 'color/muted': C.muted, 'color/line': C.line, 'color/surface': C.surface,
      'color/page': C.page, 'color/accent': C.accent, 'color/accent-soft': C.accentSoft, 'color/star': C.star,
      'color/success': C.ok, 'color/success-soft': C.okSoft, 'color/white': C.white };
    for (const [name, value] of Object.entries(tokens)) {
      const v = figma.variables.createVariable(name, col, 'COLOR');
      v.setValueForMode(mode, Object.assign(hex(value), { a: 1 }));
      v.scopes = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'];
      VARS[value.toUpperCase()] = v;
    }
  } catch (e) { /* variables unavailable: fall back to raw colours */ }
}
function paint(h, opacity) {
  const p = { type: 'SOLID', color: hex(h) };
  if (opacity !== undefined) p.opacity = opacity;
  const v = VARS[h.toUpperCase()];
  if (v) { try { return figma.variables.setBoundVariableForPaint(p, 'color', v); } catch (e) {} }
  return p;
}

// ---------- text styles ----------
const TS = {};
async function makeTextStyles() {
  const defs = {
    'Display/Title': [SERIF, 38, 40, -1], 'Display/Section': [SERIF, 30, 34, -0.5],
    'Price': [F.b, 22, 28, -1], 'Heading/Section': [F.s, 15, 20, 0], 'Body/Strong': [F.s, 14, 20, 0],
    'Body/Regular': [F.r, 14, 21, 0], 'Body/Location': [F.r, 15, 20, 0], 'Caption': [F.r, 13, 18, 0],
    'Label/Small': [F.r, 12, 16, 0], 'Eyebrow': [F.s, 12, 16, 9], 'Button': [F.s, 16, 20, 0]
  };
  for (const [name, [font, size, lh, ls]] of Object.entries(defs)) {
    const s = figma.createTextStyle();
    s.name = name; s.fontName = font; s.fontSize = size;
    s.lineHeight = { unit: 'PIXELS', value: lh };
    s.letterSpacing = { unit: 'PERCENT', value: ls };
    TS[name] = s;
  }
}

// ---------- primitives ----------
async function T(str, o = {}) {
  const t = figma.createText();
  const style = o.style ? TS[o.style] : null;
  t.fontName = o.font || (style ? style.fontName : F.r);
  t.characters = str;
  if (style) await t.setTextStyleIdAsync(style.id);
  if (o.font) t.fontName = o.font;
  if (o.size) t.fontSize = o.size;
  if (o.lh) t.lineHeight = { unit: 'PIXELS', value: o.lh };
  if (o.ls !== undefined) t.letterSpacing = { unit: 'PERCENT', value: o.ls };
  t.fills = [paint(o.color || C.ink)];
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.underline) t.textDecoration = 'UNDERLINE';
  if (o.upper) t.textCase = 'UPPER';
  if (o.width) { t.resize(o.width, t.height); t.textAutoResize = 'HEIGHT'; }
  if (o.name) t.name = o.name;
  return t;
}
function AL(dir, o = {}) {
  const f = figma.createFrame();
  f.layoutMode = dir;
  f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO';
  f.fills = o.fill ? [paint(o.fill, o.fillOpacity)] : [];
  f.itemSpacing = o.gap || 0;
  const [pt, pr, pb, pl] = o.pad || [0, 0, 0, 0];
  f.paddingTop = pt; f.paddingRight = pr; f.paddingBottom = pb; f.paddingLeft = pl;
  if (o.radius) f.cornerRadius = o.radius;
  if (o.align) f.counterAxisAlignItems = o.align;
  if (o.justify) f.primaryAxisAlignItems = o.justify;
  if (o.stroke) { f.strokes = [paint(o.stroke)]; f.strokeWeight = 1; f.strokeAlign = 'INSIDE'; }
  if (o.name) f.name = o.name;
  f.clipsContent = !!o.clip;
  return f;
}
function add(parent, child, sizing) {
  parent.appendChild(child);
  if (sizing && sizing.h) child.layoutSizingHorizontal = sizing.h;
  if (sizing && sizing.v) child.layoutSizingVertical = sizing.v;
  return child;
}
function rect(w, h, o = {}) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = o.fills || (o.fill ? [paint(o.fill, o.opacity)] : []);
  if (o.radius !== undefined) r.cornerRadius = o.radius;
  if (o.name) r.name = o.name;
  return r;
}
function img(key, scaleMode, transform) {
  const hash = figma.createImage(figma.base64Decode(ASSETS[key])).hash;
  const p = { type: 'IMAGE', imageHash: hash, scaleMode: scaleMode || 'FILL' };
  if (transform) p.imageTransform = transform;
  return p;
}
const shadow = (y, r, a, spread = 0) => ({ type: 'DROP_SHADOW', color: Object.assign(hex('#0C1C2C'), { a }), offset: { x: 0, y }, radius: r, spread, visible: true, blendMode: 'NORMAL' });

// ---------- icons as components ----------
const ICON = {};
function iconSvg(name, size, color) {
  const sw = size <= 16 ? 2 : 1.75;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>`;
}
function makeIcons(container) {
  for (const name of Object.keys(ICON_PATHS)) {
    const svg = figma.createNodeFromSvg(iconSvg(name, 24, C.ink));
    const comp = figma.createComponent();
    comp.name = 'Icon/' + name; comp.resize(24, 24); comp.fills = [];
    for (const ch of [...svg.children]) { comp.appendChild(ch); ch.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }; }
    svg.remove();
    container.appendChild(comp);
    ICON[name] = comp;
  }
}
function recolor(node, h) {
  const SHAPES = ['VECTOR', 'ELLIPSE', 'LINE', 'POLYGON', 'STAR', 'BOOLEAN_OPERATION', 'RECTANGLE'];
  const all = 'findAll' in node ? node.findAll(n => SHAPES.includes(n.type)) : [];
  for (const n of all) {
    if (n.strokes && n.strokes.length) n.strokes = [paint(h)];
    if (n.fills && n.fills.length && n.fills[0].type === 'SOLID' && n.name !== 'keep') n.fills = [paint(h)];
  }
}
function icon(name, size, color) {
  const i = ICON[name].createInstance();
  i.resize(size, size);
  if (color && name !== 'star') recolor(i, color);
  return i;
}

// ---------- components ----------
const COMP = {};
async function makeComponents(container) {
  // Button / Primary
  {
    const c = figma.createComponent();
    c.name = 'Button/Primary';
    c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
    c.resize(150, 56); c.paddingLeft = c.paddingRight = 22; c.itemSpacing = 10;
    c.primaryAxisAlignItems = 'CENTER'; c.counterAxisAlignItems = 'CENTER';
    c.cornerRadius = 18; c.fills = [paint(C.ink)]; c.effects = [shadow(10, 22, 0.22)];
    const label = await T('Book now', { style: 'Button', color: C.white, name: 'Label' });
    c.appendChild(label);
    const arrow = icon('arrow', 20, C.white); arrow.name = 'Trailing icon'; c.appendChild(arrow);
    const kL = c.addComponentProperty('Label', 'TEXT', 'Book now');
    const kI = c.addComponentProperty('Trailing icon', 'BOOLEAN', true);
    label.componentPropertyReferences = { characters: kL };
    arrow.componentPropertyReferences = { visible: kI };
    c.description = 'Primary action. One per screen, always in the bottom thumb zone. Min height 56.';
    container.appendChild(c); COMP.button = { c, kL, kI };
  }
  // Spec item
  {
    const c = figma.createComponent();
    c.name = 'Spec item';
    c.layoutMode = 'VERTICAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
    c.resize(80, 80); c.itemSpacing = 3; c.counterAxisAlignItems = 'CENTER'; c.fills = [];
    const ic = icon('users', 22, C.ink2); ic.name = 'Icon'; c.appendChild(ic);
    const sp = rect(1, 3); sp.name = 'spacer'; c.appendChild(sp);
    const v = await T('4', { font: F.s, size: 16, lh: 20, name: 'Value' }); c.appendChild(v);
    const l = await T('Guests', { style: 'Label/Small', color: C.muted, name: 'Label' }); c.appendChild(l);
    const kV = c.addComponentProperty('Value', 'TEXT', '4');
    const kL = c.addComponentProperty('Label', 'TEXT', 'Guests');
    const kI = c.addComponentProperty('Icon', 'INSTANCE_SWAP', ICON.users.id);
    v.componentPropertyReferences = { characters: kV };
    l.componentPropertyReferences = { characters: kL };
    ic.componentPropertyReferences = { mainComponent: kI };
    c.description = 'Key property fact. Always icon + value + label: never a bare number.';
    container.appendChild(c); COMP.spec = { c, kV, kL, kI };
  }
  // Highlight row
  {
    const c = figma.createComponent();
    c.name = 'Highlight row';
    c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'AUTO';
    c.resize(330, 40); c.itemSpacing = 12; c.counterAxisAlignItems = 'CENTER'; c.fills = [];
    const tile = AL('HORIZONTAL', { fill: C.surface, radius: 12, name: 'Icon tile', align: 'CENTER', justify: 'CENTER' });
    tile.primaryAxisSizingMode = 'FIXED'; tile.counterAxisSizingMode = 'FIXED'; tile.resize(40, 40);
    const ic = icon('mountain', 22, C.ink); ic.name = 'Icon'; tile.appendChild(ic);
    c.appendChild(tile);
    const col = AL('VERTICAL', { gap: 1, name: 'Text' });
    const t = await T('Views to the horizon', { style: 'Body/Strong', name: 'Title' }); col.appendChild(t);
    const s = await T('High-altitude cabin, peaks on every side', { style: 'Caption', color: C.muted, name: 'Subtitle' }); col.appendChild(s);
    add(c, col, { h: 'FILL' });
    const kT = c.addComponentProperty('Title', 'TEXT', 'Views to the horizon');
    const kS = c.addComponentProperty('Subtitle', 'TEXT', 'High-altitude cabin, peaks on every side');
    const kI = c.addComponentProperty('Icon', 'INSTANCE_SWAP', ICON.mountain.id);
    t.componentPropertyReferences = { characters: kT };
    s.componentPropertyReferences = { characters: kS };
    ic.componentPropertyReferences = { mainComponent: kI };
    c.description = 'Scannable selling point extracted from long-form description.';
    container.appendChild(c); COMP.hl = { c, kT, kS, kI };
  }
  // Glass icon button
  {
    const c = figma.createComponent();
    c.name = 'Glass button';
    c.resize(44, 44); c.cornerRadius = 22;
    c.fills = [paint(C.white, 0.22)]; c.strokes = [{ type: 'SOLID', color: hex(C.white), opacity: 0.35 }]; c.strokeWeight = 1;
    c.effects = [{ type: 'BACKGROUND_BLUR', radius: 14, visible: true }];
    c.layoutMode = 'HORIZONTAL'; c.primaryAxisAlignItems = 'CENTER'; c.counterAxisAlignItems = 'CENTER';
    c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(44, 44);
    const ic = icon('back', 22, C.white); ic.name = 'Icon'; c.appendChild(ic);
    const kI = c.addComponentProperty('Icon', 'INSTANCE_SWAP', ICON.back.id);
    ic.componentPropertyReferences = { mainComponent: kI };
    c.description = 'Neutral control over photography. 44pt hit target.';
    container.appendChild(c); COMP.glass = { c, kI };
  }
}
function inst(def, props) {
  const i = def.c.createInstance();
  if (props) i.setProperties(props);
  return i;
}

// ---------- shared screen chrome ----------
function heroImage(h) {
  // Crop of the original photo focusing on the cabin.
  return img('hero', 'CROP', [[0.667, 0, 0.17], [0, 0.578 * h / 250, 0.296]]);
}
async function phone(name, x) {
  const f = figma.createFrame();
  f.name = name; f.resize(390, 844); f.x = x; f.y = ROOT_Y; f.clipsContent = true;
  f.fills = [paint(C.page)];
  const bg = rect(470, 924, { fills: [img('hero', 'FILL')], name: 'Ambient photo (blurred)' });
  bg.x = -40; bg.y = -40; bg.opacity = 0.55; bg.effects = [{ type: 'LAYER_BLUR', radius: 30, visible: true }];
  f.appendChild(bg);
  const wash = rect(390, 844, { fill: C.white, opacity: 0.25, name: 'Wash' }); f.appendChild(wash);
  const hero = rect(390, 250, { fills: [heroImage(250)], name: 'Hero photo' });
  f.appendChild(hero);
  const fade = rect(390, 250, { name: 'Hero scrim' });
  fade.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [
    { position: 0, color: { r: 0.03, g: 0.07, b: 0.11, a: 0.42 } }, { position: 0.34, color: { r: 0.03, g: 0.07, b: 0.11, a: 0 } },
    { position: 1, color: { r: 0.03, g: 0.07, b: 0.11, a: 0 } }] }];
  f.appendChild(fade);
  // status bar
  const island = rect(122, 35, { fill: '#000000', radius: 18, name: 'Dynamic Island' }); island.x = 134; island.y = 11; f.appendChild(island);
  const time = await T('9:41', { font: F.s, size: 16, lh: 20, color: C.white, name: 'Time' }); time.x = 34; time.y = 17; f.appendChild(time);
  const sys = figma.createNodeFromSvg(SYS_SVG); sys.name = 'Status icons'; sys.x = 286; sys.y = 21; f.appendChild(sys);
  return f;
}
function paperCard(parent) {
  const card = figma.createFrame();
  card.name = 'Paper card · 80% height';
  card.resize(370, 675); card.x = 10; card.y = 159; card.cornerRadius = 32;
  card.fills = [paint(C.white)]; card.clipsContent = false;
  card.effects = [shadow(-10, 40, 0.16), shadow(2, 6, 0.06)];
  parent.appendChild(card);
  return card;
}
function homeIndicator(parent) {
  const h = rect(134, 5, { fill: C.ink, radius: 3, name: 'Home indicator' }); h.x = 128; h.y = 831; parent.appendChild(h);
}
// ---------- 01 Listing detail ----------
async function screen1(x) {
  const f = await phone('01 · Listing detail', x);
  // top controls
  const back = inst(COMP.glass); back.name = 'Back'; back.x = 16; back.y = 58; f.appendChild(back);
  const share = inst(COMP.glass, { [COMP.glass.kI]: ICON.share.id }); share.name = 'Share'; share.x = 330; share.y = 58; f.appendChild(share);
  recolor(share, C.white);
  const card = paperCard(f);

  // gallery thumbnails breaking out of the card
  const thumbs = AL('HORIZONTAL', { gap: 8, name: 'Gallery thumbnails' });
  for (const [k, i] of [['t1', 0], ['t2', 1], ['t3', 2], ['t4', 3]]) {
    const t = figma.createFrame(); t.name = i === 0 ? 'Thumb · selected' : 'Thumb';
    t.resize(58, 58); t.cornerRadius = 16; t.fills = [img(k)]; t.clipsContent = true;
    t.strokes = [paint(i === 0 ? C.ink : C.white)]; t.strokeWeight = i === 0 ? 2.5 : 3; t.strokeAlign = 'INSIDE';
    t.effects = [shadow(8, 18, 0.18)];
    if (i === 3) {
      const ov = rect(58, 58, { fill: '#0A141E', opacity: 0.52, name: 'Overlay' }); t.appendChild(ov);
      const more = await T('+4', { font: F.s, size: 15, lh: 20, color: C.white, align: 'CENTER', name: 'More count' });
      more.resize(58, 20); more.y = 19; t.appendChild(more);
    }
    thumbs.appendChild(t);
  }
  thumbs.x = 20; thumbs.y = -30; card.appendChild(thumbs);

  const fab = figma.createFrame(); fab.name = 'Save (heart)'; fab.resize(48, 48); fab.cornerRadius = 24; fab.fills = [paint(C.white)];
  fab.effects = [shadow(8, 20, 0.16)];
  fab.layoutMode = 'HORIZONTAL'; fab.primaryAxisAlignItems = 'CENTER'; fab.counterAxisAlignItems = 'CENTER';
  fab.primaryAxisSizingMode = 'FIXED'; fab.counterAxisSizingMode = 'FIXED'; fab.resize(48, 48);
  fab.appendChild(icon('heart', 22, C.ink));
  fab.x = 302; fab.y = -22; card.appendChild(fab);

  // body
  const body = AL('VERTICAL', { gap: 20, name: 'Content' });
  body.primaryAxisSizingMode = 'AUTO'; body.counterAxisSizingMode = 'FIXED'; body.resize(330, 100);
  body.x = 20; body.y = 46; card.appendChild(body);

  const ident = AL('VERTICAL', { gap: 10, name: 'Identity' }); add(body, ident, { h: 'FILL' });
  const tb = AL('VERTICAL', { gap: 4, name: 'Title block' }); add(ident, tb, { h: 'FILL' });
  tb.appendChild(await T('Entire cabin · Snowy Mountains', { style: 'Eyebrow', color: C.muted, upper: true, name: 'Eyebrow' }));
  tb.appendChild(await T('Mountain Retreat', { style: 'Display/Title', name: 'Title' }));

  const loc = AL('HORIZONTAL', { gap: 6, align: 'CENTER', name: 'Location' }); add(ident, loc, { h: 'FILL' });
  loc.appendChild(icon('pin', 18, C.ink2));
  const locT = await T('Snowy Peaks, NSW, Australia', { style: 'Body/Location', color: C.ink2 }); add(loc, locT, { h: 'FILL' });
  const map = AL('HORIZONTAL', { gap: 4, align: 'CENTER', name: 'Map link' });
  map.appendChild(await T('Map', { font: F.s, size: 14, lh: 20, color: C.accent }));
  map.appendChild(icon('arrowur', 14, C.accent)); loc.appendChild(map);

  const rat = AL('HORIZONTAL', { gap: 8, align: 'CENTER', name: 'Rating' }); add(ident, rat);
  rat.appendChild(icon('star', 16));
  rat.appendChild(await T('5.0', { font: F.s, size: 14, lh: 20 }));
  rat.appendChild(await T('23 reviews', { font: F.r, size: 14, lh: 20, underline: true, name: 'Reviews link' }));
  const dot = figma.createEllipse(); dot.resize(3, 3); dot.fills = [paint('#B9C3CB')]; rat.appendChild(dot);
  const badge = AL('HORIZONTAL', { gap: 5, pad: [4, 10, 4, 10], radius: 999, fill: C.accentSoft, align: 'CENTER', name: 'Badge' });
  badge.appendChild(icon('award', 13, C.accent));
  badge.appendChild(await T('Guest favourite', { font: F.s, size: 12, lh: 16, color: C.accent }));
  rat.appendChild(badge);

  const specs = AL('HORIZONTAL', { fill: C.surface, radius: 20, pad: [14, 4, 14, 4], align: 'CENTER', name: 'Key facts' });
  add(body, specs, { h: 'FILL' });
  const sd = [['users', '4', 'Guests'], ['bed', '2', 'Bedrooms'], ['bath', '1', 'Bathroom'], ['car', '1', 'Parking']];
  sd.forEach(([ic, v, l], i) => {
    if (i) { const d = rect(1, 44, { fill: C.divider, name: 'Divider' }); specs.appendChild(d); }
    const s = inst(COMP.spec, { [COMP.spec.kV]: v, [COMP.spec.kL]: l, [COMP.spec.kI]: ICON[ic].id });
    recolor(s, C.ink2);
    add(specs, s, { h: 'FILL' });
  });

  const love = AL('VERTICAL', { gap: 12, name: 'Why you\'ll love it' }); add(body, love, { h: 'FILL' });
  love.appendChild(await T('Why you\'ll love it', { style: 'Heading/Section' }));
  const hd = [['mountain', 'Views to the horizon', 'High-altitude cabin, peaks on every side'],
    ['fish', 'Hike & fish nearby', 'Snow trails and a river close by'],
    ['flame', 'Warm, cosy interior', 'Made for slow evenings after adventure']];
  for (const [ic, t, s] of hd) {
    const h = inst(COMP.hl, { [COMP.hl.kT]: t, [COMP.hl.kS]: s, [COMP.hl.kI]: ICON[ic].id });
    add(love, h, { h: 'FILL' });
  }
  const aboutStr = 'An intimate escape into the wilderness, sleeping four, high above the valley… Read more';
  const about = await T(aboutStr, { style: 'Body/Regular', color: C.ink2, name: 'About' });
  add(body, about, { h: 'FILL' }); about.textAutoResize = 'HEIGHT';
  const rm = aboutStr.indexOf('Read more');
  about.setRangeFontName(rm, aboutStr.length, F.s);
  about.setRangeFills(rm, aboutStr.length, [paint(C.ink)]);
  about.setRangeTextDecoration(rm, aboutStr.length, 'UNDERLINE');

  // sticky booking bar
  const bar = figma.createFrame(); bar.name = 'Booking bar (sticky)';
  bar.resize(370, 92); bar.x = 0; bar.y = 583; bar.fills = [paint(C.white)];
  bar.bottomLeftRadius = 32; bar.bottomRightRadius = 32; bar.clipsContent = false;
  const hair = rect(370, 1, { fill: C.line, name: 'Hairline' }); bar.appendChild(hair);
  const pcol = AL('VERTICAL', { gap: 2, name: 'Price + dates' });
  const priceStr = '$299 / night';
  const price = await T(priceStr, { style: 'Price', name: 'Price' });
  price.setRangeFontName(4, priceStr.length, F.m); price.setRangeFontSize(4, priceStr.length, 14);
  price.setRangeFills(4, priceStr.length, [paint(C.muted)]);
  price.setRangeLetterSpacing(4, priceStr.length, { unit: 'PERCENT', value: 0 });
  pcol.appendChild(price);
  pcol.appendChild(await T('12 – 14 Dec · 2 guests', { style: 'Caption', color: C.ink2, underline: true, name: 'Dates (editable)' }));
  pcol.x = 20; pcol.y = 22; bar.appendChild(pcol);
  const btn = inst(COMP.button, { [COMP.button.kL]: 'Book now' });
  bar.appendChild(btn); btn.x = 370 - 16 - btn.width; btn.y = 18;
  card.appendChild(bar);
  homeIndicator(f);
  return f;
}

// ---------- boards (rendered presentation) ----------
function boardImage(key, name, x, y, w, h) {
  const r = rect(w, h, { fills: [img(key, 'FIT')], name }); r.x = x; r.y = y;
  figma.currentPage.appendChild(r); return r;
}

// ---------- run ----------
(async () => {
  try {
    await loadFonts();
    makeVariables();
    await makeTextStyles();
    figma.currentPage.name = 'Mountain Retreat · Redesign';

    // components area
    const lib = AL('VERTICAL', { gap: 32, pad: [40, 40, 40, 40], fill: C.white, radius: 24, name: 'Components & tokens' });
    lib.x = ROOT_X - 700; lib.y = ROOT_Y;
    figma.currentPage.appendChild(lib);
    lib.appendChild(await T('Components', { style: 'Display/Section' }));
    const iconRow = AL('HORIZONTAL', { gap: 16, name: 'Icons' }); iconRow.layoutWrap = 'WRAP'; iconRow.counterAxisSpacing = 16;
    iconRow.primaryAxisSizingMode = 'FIXED'; iconRow.resize(560, 24);
    lib.appendChild(iconRow);
    makeIcons(iconRow);
    const compRow = AL('VERTICAL', { gap: 24, name: 'UI components' }); lib.appendChild(compRow);
    await makeComponents(compRow);

    const s1 = await screen1(ROOT_X);
    const before = rect(390, 693, { fills: [img('original', 'FIT')], name: 'Before · original brief' });
    before.x = ROOT_X - 470; before.y = ROOT_Y + 900; figma.currentPage.appendChild(before);

    boardImage('board1', 'Board 1 · Problem → Solution', ROOT_X + 520, ROOT_Y, 1920, 1951);
    boardImage('board2', 'Board 2 · Design system', ROOT_X + 520, ROOT_Y + 2050, 1920, 1432);

    figma.viewport.scrollAndZoomIntoView([s1]);
    figma.closePlugin('Mountain Retreat redesign created ✓');
  } catch (e) {
    figma.closePlugin('Error: ' + (e && e.message ? e.message : e));
  }
})();
