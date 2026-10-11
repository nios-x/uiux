// Stroke icons (Lucide-style, ISC licensed shapes), 24×24 grid, 1.75 stroke.
// Shared by screens.html (DOM) and the Figma plugin (createNodeFromSvg).
const ICONS = {
  paths: {
    back: '<path d="m15 18-6-6 6-6"/>',
    share: '<path d="M12 3v13"/><path d="m7 8 5-5 5 5"/><path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    pin: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    star: '<path fill="#E5A019" stroke="#E5A019" d="M11.5 2.9a.5.5 0 0 1 .9 0l2.3 4.7a2 2 0 0 0 1.5 1.1l5.2.8a.5.5 0 0 1 .3.9l-3.8 3.7a2 2 0 0 0-.6 1.8l.9 5.2a.5.5 0 0 1-.8.5l-4.6-2.5a2 2 0 0 0-1.9 0l-4.6 2.5a.5.5 0 0 1-.8-.5l.9-5.2a2 2 0 0 0-.6-1.8L1.8 10.4a.5.5 0 0 1 .3-.9l5.2-.8a2 2 0 0 0 1.5-1.1Z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
    arrowur: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    bath: '<path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 7.6 3.6A1.9 1.9 0 0 0 4.6 4 2 2 0 0 0 4 5.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.1 14.9 8 13l1.6 2.4 2.4-1.4"/>',
    fish: '<path d="M6.5 12c.9-4.4 5.5-6 10-4 1.6.7 3.3 2.1 5 4-1.7 1.9-3.4 3.3-5 4-4.5 2-9.1.4-10-4z"/><path d="M18 12v.5"/><path d="M6.5 12 2 8.5v7L6.5 12z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.2.4 1.6 1.4 2.7 2.5 2.7z"/>',
    img12: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.7 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.5 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>'
  },
  svg(name, size, color, strokeWidth) {
    if (name === 'sys') return ICONS.sys(color || '#fff');
    const c = color || 'currentColor';
    const sw = strokeWidth || (size <= 16 ? 2 : 1.75);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS.paths[name]}</svg>`;
  },
  sys(c) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="74" height="13" viewBox="0 0 74 13" fill="${c}"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="6" width="3" height="6" rx="1"/><rect x="10" y="3.5" width="3" height="8.5" rx="1"/><rect x="15" y="1" width="3" height="11" rx="1"/><path d="M31 3.2a9.6 9.6 0 0 1 6.6 2.6l1.3-1.3A11.5 11.5 0 0 0 31 1.3a11.5 11.5 0 0 0-7.9 3.2l1.3 1.3A9.6 9.6 0 0 1 31 3.2Zm0 3.7c1.5 0 2.9.6 4 1.6l1.3-1.3A7.6 7.6 0 0 0 31 5c-2 0-3.9.8-5.3 2.2L27 8.5c1.1-1 2.5-1.6 4-1.6Zm0 3.7c.6 0 1.1.2 1.5.6L31 12.8l-1.5-1.6c.4-.4.9-.6 1.5-.6Z"/><rect x="46.5" y=".5" width="24" height="12" rx="3.5" fill="none" stroke="${c}" stroke-opacity=".4"/><rect x="48.5" y="2.5" width="18" height="8" rx="2"/><path d="M72 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill-opacity=".45"/></svg>`;
  }
};
if (typeof module !== 'undefined') module.exports = ICONS;
