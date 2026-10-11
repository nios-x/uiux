// Exports the #s1 screen of screens.html as a layered SVG for Figma import.
// The photographic background becomes one image layer. Every card element becomes
// a vector shape, a live <text> layer, or an inline icon.
// Usage: node tools/html2svg.js   (run from design/)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');

(async () => {
  const dir = path.join(__dirname, '..');
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1500, height: 1000 } });
  await p.goto('file://' + path.join(dir, 'screens.html'));
  await p.waitForLoadState('networkidle');
  await p.evaluate(() => document.fonts.ready);

  // 1) background layer: hide everything that will be vector, screenshot the rest
  await p.addStyleTag({ content: '#s1 .card,#s1 .topbar,#s1 .status,#s1 .dynamic,#s1 .home-ind{visibility:hidden!important}' });
  const bgPng = await (await p.$('#s1')).screenshot();
  await p.addStyleTag({ content: '#s1 .card,#s1 .topbar,#s1 .status,#s1 .dynamic,#s1 .home-ind{visibility:visible!important}' });

  // 2) walk the DOM and collect shapes, text and icons
  const data = await p.evaluate(() => {
    const root = document.querySelector('#s1');
    const R = root.getBoundingClientRect();
    const out = [];
    const px = v => parseFloat(v) || 0;
    const rel = r => ({ x: r.left - R.left, y: r.top - R.top, w: r.width, h: r.height });
    const skip = new Set(['hero', 'phone']);
    const walk = el => {
      if (el.classList && [...el.classList].some(c => skip.has(c))) { if (!el.classList.contains('phone')) return; }
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (el.tagName.toLowerCase() === 'svg') {
        const r = rel(el.getBoundingClientRect());
        out.push({ kind: 'icon', ...r, color: cs.color, svg: el.outerHTML, name: el.parentElement.getAttribute('aria-label') || el.parentElement.dataset.i || 'icon' });
        return;
      }
      if (el !== root) {
        const r = rel(el.getBoundingClientRect());
        const bg = cs.backgroundColor, bgi = cs.backgroundImage;
        const hasBg = bg && bg !== 'rgba(0, 0, 0, 0)';
        const hasImg = bgi && bgi.startsWith('url(');
        const bw = px(cs.borderTopWidth), hasBorder = bw > 0 && cs.borderTopStyle !== 'none';
        const ow = px(cs.outlineWidth), hasOutline = ow > 0 && cs.outlineStyle !== 'none';
        if (hasBg || hasImg || hasBorder || hasOutline || cs.boxShadow !== 'none') {
          out.push({ kind: 'box', ...r, name: (el.getAttribute('aria-label') || el.className || el.tagName).toString(),
            bg: hasBg ? bg : null, img: hasImg ? bgi.slice(5, -2).replace(/^.*assets\//, 'assets/') : null,
            radii: [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(v => Math.min(px(v), r.w / 2, r.h / 2)),
            border: hasBorder ? { w: bw, c: cs.borderTopColor, dashed: cs.borderTopStyle === 'dashed' } : null,
            outline: hasOutline ? { w: ow, c: cs.outlineColor, off: px(cs.outlineOffset) } : null,
            shadow: cs.boxShadow !== 'none' ? cs.boxShadow : null, opacity: cs.opacity });
        }
      }
      for (const ch of el.childNodes) {
        if (ch.nodeType === 3 && ch.textContent.trim()) {
          const pcs = getComputedStyle(el);
          const range = document.createRange();
          const t = ch.textContent;
          // split into rendered lines by measuring each character
          let lines = [], cur = null;
          for (let i = 0; i < t.length; i++) {
            range.setStart(ch, i); range.setEnd(ch, i + 1);
            const rr = range.getClientRects()[0];
            if (!rr) continue;
            if (!cur || Math.abs(rr.top - cur.top) > 3) { cur = { top: rr.top, left: rr.left, h: rr.height, s: '' }; lines.push(cur); }
            cur.s += t[i];
          }
          let fam = pcs.fontFamily.split(',')[0].replace(/"/g, '').trim();
          for (const ln of lines) {
            let s = ln.s.replace(/\s+$/, '');
            if (!s.trim()) continue;
            if (pcs.textTransform === 'uppercase') s = s.toUpperCase();
            const lead = ln.s.length - ln.s.trimStart().length;
            out.push({ kind: 'text', x: ln.left - R.left, y: ln.top - R.top, h: ln.h, s: s.trimStart(), lead,
              family: fam, size: px(pcs.fontSize), weight: pcs.fontWeight, style: pcs.fontStyle, color: pcs.color,
              ls: pcs.letterSpacing === 'normal' ? 0 : px(pcs.letterSpacing),
              underline: pcs.textDecorationLine.includes('underline') || getComputedStyle(el.parentElement).textDecorationLine.includes('underline'),
              strike: pcs.textDecorationLine.includes('line-through') });
          }
        } else if (ch.nodeType === 1) walk(ch);
      }
    };
    walk(root);
    return out;
  });
  await b.close();

  // 3) emit SVG
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rgba = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return { c, a: 1 }; const v = m[1].split(',').map(x => x.trim()); return { c: `rgb(${v[0]},${v[1]},${v[2]})`, a: v[3] !== undefined ? +v[3] : 1 }; };
  const rr = (x, y, w, h, [tl, tr, br, bl]) =>
    `M${x + tl},${y}H${x + w - tr}${tr ? `A${tr},${tr} 0 0 1 ${x + w},${y + tr}` : ''}V${y + h - br}${br ? `A${br},${br} 0 0 1 ${x + w - br},${y + h}` : ''}H${x + bl}${bl ? `A${bl},${bl} 0 0 1 ${x},${y + h - bl}` : ''}V${y + tl}${tl ? `A${tl},${tl} 0 0 1 ${x + tl},${y}` : ''}Z`;
  const imgB64 = f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
  let defs = [], body = [], id = 0;
  body.push(`<image id="Background photo" x="0" y="0" width="390" height="844" href="data:image/png;base64,${bgPng.toString('base64')}"/>`);
  const shadowFilter = sh => {
    // take the first shadow layer: "rgba(...) 0px -10px 40px 0px"
    const m = sh.match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/);
    if (!m || sh.includes('inset') && !sh.split('),').slice(1).length) return '';
    const parts = sh.split(/,(?![^(]*\))/).filter(x => !x.includes('inset'));
    const p0 = parts[0].match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/);
    if (!p0) return '';
    const col = rgba(p0[1]); const fid = 'shadow' + (++id);
    defs.push(`<filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%" filterUnits="objectBoundingBox"><feDropShadow dx="${p0[2]}" dy="${p0[3]}" stdDeviation="${+p0[4] / 2}" flood-color="${col.c}" flood-opacity="${col.a}"/></filter>`);
    return ` filter="url(#${fid})"`;
  };
  const nice = n => n.replace(/[^\w\- ·]/g, ' ').trim().split(' ')[0] || 'shape';
  for (const o of data) {
    if (o.kind === 'box') {
      const d = rr(o.x, o.y, o.w, o.h, o.radii);
      const name = nice(o.name);
      if (o.bg || o.shadow) {
        const f = rgba(o.bg || 'rgb(255,255,255)');
        body.push(`<path id="${name}" d="${d}" fill="${o.bg ? f.c : 'none'}"${o.bg && f.a < 1 ? ` fill-opacity="${f.a}"` : ''}${o.shadow ? shadowFilter(o.shadow) : ''}/>`);
      }
      if (o.img) {
        const cid = 'clip' + (++id);
        defs.push(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`);
        body.push(`<image id="${name} photo" x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${cid})" href="${imgB64(o.img)}"/>`);
      }
      if (o.border) {
        const c = rgba(o.border.c), hw = o.border.w / 2;
        body.push(`<path id="${name} border" d="${rr(o.x + hw, o.y + hw, o.w - o.border.w, o.h - o.border.w, o.radii.map(r => Math.max(r - hw, 0)))}" fill="none" stroke="${c.c}"${c.a < 1 ? ` stroke-opacity="${c.a}"` : ''} stroke-width="${o.border.w}"${o.border.dashed ? ' stroke-dasharray="4 3"' : ''}/>`);
      }
      if (o.outline) {
        const c = rgba(o.outline.c), w = o.outline.w, inset = -o.outline.off - w / 2;
        body.push(`<path id="${name} selected ring" d="${rr(o.x + inset, o.y + inset, o.w - 2 * inset, o.h - 2 * inset, o.radii.map(r => Math.max(r - inset, 0)))}" fill="none" stroke="${c.c}" stroke-width="${w}"/>`);
      }
    } else if (o.kind === 'icon') {
      const c = rgba(o.color);
      const inner = o.svg.replace(/currentColor/g, c.c).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      const vb = (o.svg.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 24 24';
      const attrs = (o.svg.match(/^<svg([^>]*)>/) || [])[1].replace(/\s(width|height|xmlns|viewBox)="[^"]*"/g, '').replace(/currentColor/g, c.c);
      body.push(`<svg id="Icon ${esc(o.name)}" x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" viewBox="${vb}"${attrs}>${inner}</svg>`);
    } else if (o.kind === 'text') {
      const c = rgba(o.color);
      const base = o.y + o.h * 0.8;
      const fam = o.family === 'Instrument Serif' ? "Instrument Serif" : 'Inter';
      const deco = o.underline ? ' text-decoration="underline"' : o.strike ? ' text-decoration="line-through"' : '';
      body.push(`<text font-family="${fam}" font-size="${o.size}" font-weight="${o.weight}"${o.style === 'italic' ? ' font-style="italic"' : ''} fill="${c.c}"${c.a < 1 ? ` fill-opacity="${c.a}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${deco} x="${o.x.toFixed(2)}" y="${base.toFixed(2)}" xml:space="preserve">${esc(o.s)}</text>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="390" height="844" viewBox="0 0 390 844">
<defs>${defs.join('')}<clipPath id="screen"><rect width="390" height="844"/></clipPath></defs>
<g id="Mountain Retreat · Listing detail" clip-path="url(#screen)">
${body.join('\n')}
</g>
</svg>`;
  fs.writeFileSync(path.join(dir, 'export/Mountain-Retreat-screen.svg'), svg);
  console.log('svg', (svg.length / 1024).toFixed(0) + ' KB', data.length, 'nodes');
})();
