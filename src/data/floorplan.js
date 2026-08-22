// Floor plan for Tegefjällsvägen 79, lgh A, Tegefjäll, Åre kommun
// (Hemnet #21668279), reconstructed from the listing's own floor-plan
// drawing and photos (both supplied directly by the user, since hemnet.se
// itself is blocked by network egress policy in this environment).
//
// Real layout (confirmed from the floor-plan image): the three bedrooms sit
// in a row along the north wall and each opens directly onto Allrum — there
// is NO separate hall/corridor. Allrum and Kök are one open-plan space
// (confirmed by the listing photo caption "Kök och allrum i öppen
// planlösning"). Entré meets Allrum at an open threshold (drawn as a dashed
// line on the plan, i.e. no door/wall). Bastu is entered from inside
// Badrum. The plan has no printed dimensions, so room sizes below are
// scaled proportionally from the drawing to match the listing's stated
// total of 57 m² — treat exact numbers as approximate, not measured.
//
// Coordinate system: meters. +X east, +Z north, +Y up. Z=0 is the south
// (entry/exterior) side; Z max is the north wall behind the bedrooms.

export const CEILING_HEIGHT = 2.5;
export const WALL_THICKNESS = 0.12;
export const DOOR_HEAD_HEIGHT = 2.1;

export const rooms = [
  {
    id: "sovrum1",
    name: "Sovrum 1",
    x1: 0.0, z1: 4.7, x2: 3.2, z2: 7.3,
    floor: "wood",
    label: "Största sovrummet — träpanelvägg med skidor, utsikt",
  },
  {
    id: "sovrum2",
    name: "Sovrum 2",
    x1: 3.2, z1: 4.7, x2: 5.7, z2: 7.3,
    floor: "wood",
    label: "Sovrum med rutig gardin",
  },
  {
    id: "sovrum3",
    name: "Sovrum 3",
    x1: 5.7, z1: 4.7, x2: 8.2, z2: 7.3,
    floor: "wood",
    label: "Sovrum med björnmotiv",
  },
  {
    id: "allrum",
    name: "Allrum",
    x1: 0.0, z1: 1.6, x2: 4.9, z2: 4.7,
    floor: "wood",
    label: "Öppet vardags-/matrum, hörnsoffa, rentaljuskrona",
  },
  {
    id: "kok",
    name: "Kök",
    x1: 4.9, z1: 2.2, x2: 8.2, z2: 4.7,
    floor: "wood",
    label: "Grått kök i enkel rad, kakel, rostfria vitvaror",
  },
  {
    id: "entre",
    name: "Entré",
    x1: 0.0, z1: 0.0, x2: 4.9, z2: 1.6,
    floor: "tile_dark",
    label: "Hall med bänk, klädkrokar och förvaringsfack",
  },
  {
    id: "badrum",
    name: "Badrum",
    x1: 4.9, z1: 0.0, x2: 7.0, z2: 2.2,
    floor: "tile_gray",
    label: "Helkaklat badrum, dusch, tvättmaskin",
  },
  {
    id: "bastu",
    name: "Bastu",
    x1: 7.0, z1: 0.0, x2: 8.2, z2: 2.2,
    floor: "tile_gray",
    label: "Bastu med glasdörr, nås från badrummet",
  },
];

export const balcony = { x1: -1.5, z1: 1.8, x2: 0.0, z2: 4.4 };

// Wall segments, as in apartment.js's builder: horizontal runs (axis 'z',
// constant z, spanning x) or vertical runs (axis 'x', constant x, spanning
// z). `open: true` segments have no wall at all (open-plan thresholds).
export const walls = [
  // North façade — behind the three bedrooms, each with its own window.
  {
    id: "north-facade", axis: "z", at: 7.3, from: 0.0, to: 8.2, exterior: true,
    openings: [
      { type: "window", from: 1.0, to: 2.2, sill: 0.9, head: 2.1 },
      { type: "window", from: 4.0, to: 4.9, sill: 0.9, head: 2.1 },
      { type: "window", from: 6.5, to: 7.4, sill: 0.9, head: 2.1 },
    ],
  },
  // Bedrooms <-> Allrum/Kök (the wood accent wall in every living-room photo).
  {
    id: "bedroom-wall", axis: "z", at: 4.7, from: 0.0, to: 8.2, exterior: false,
    wood: true,
    openings: [
      { type: "door", from: 1.2, to: 2.2, sill: 0.0, head: 2.1, name: "Sovrum 1 dörr" },
      { type: "door", from: 3.8, to: 4.8, sill: 0.0, head: 2.1, name: "Sovrum 2 dörr" },
      { type: "door", from: 6.45, to: 7.45, sill: 0.0, head: 2.1, name: "Sovrum 3 dörr" },
    ],
  },
  // Sovrum1 <-> Sovrum2, Sovrum2 <-> Sovrum3 partitions (solid).
  { id: "part-sov1-sov2", axis: "x", at: 3.2, from: 4.7, to: 7.3, exterior: false, openings: [] },
  { id: "part-sov2-sov3", axis: "x", at: 5.7, from: 4.7, to: 7.3, exterior: false, openings: [] },

  // Allrum <-> Kök: fully open-plan, no wall at all.
  { id: "allrum-kok", axis: "x", at: 4.9, from: 2.2, to: 4.7, exterior: false, open: true, openings: [] },
  // Entré/Allrum <-> Badrum partition (solid — Badrum is entered from Kök).
  { id: "part-entre-badrum-x", axis: "x", at: 4.9, from: 0.0, to: 2.2, exterior: false, openings: [] },

  // Allrum <-> Entré: open threshold (dashed line on the plan = no wall).
  { id: "allrum-entre", axis: "z", at: 1.6, from: 0.0, to: 4.9, exterior: false, open: true, openings: [] },

  // Kök <-> Badrum (door, per the swing arc drawn on the plan).
  {
    id: "kok-badrum", axis: "z", at: 2.2, from: 4.9, to: 8.2, exterior: false,
    openings: [{ type: "door", from: 5.3, to: 6.1, sill: 0.0, head: 2.05, name: "Badrum dörr" }],
  },
  // Badrum <-> Bastu (dark glass sauna door).
  {
    id: "badrum-bastu", axis: "x", at: 7.0, from: 0.0, to: 2.2, exterior: false,
    openings: [{ type: "door", from: 1.0, to: 1.7, sill: 0.0, head: 1.95, name: "Bastu dörr", glass: true, dark: true }],
  },

  // West façade — Allrum's big view window (+ balcony door) and Entré's window.
  {
    id: "west-facade", axis: "x", at: 0.0, from: 0.0, to: 7.3, exterior: true,
    openings: [
      { type: "window", from: 0.35, to: 1.3, sill: 0.9, head: 2.1 },
      { type: "door", from: 1.9, to: 4.3, sill: 0.0, head: 2.2, name: "Balkongdörr", glass: true },
    ],
  },
  // East façade — small kitchen window.
  {
    id: "east-facade", axis: "x", at: 8.2, from: 0.0, to: 7.3, exterior: true,
    openings: [{ type: "window", from: 3.0, to: 3.8, sill: 1.0, head: 2.0 }],
  },
  // South façade — Entré's front door, small frosted Badrum window.
  {
    id: "south-facade", axis: "z", at: 0.0, from: 0.0, to: 8.2, exterior: true,
    openings: [
      { type: "door", from: 2.0, to: 3.0, sill: 0.0, head: 2.1, name: "Ytterdörr" },
      { type: "window", from: 5.4, to: 6.0, sill: 1.4, head: 2.05, frosted: true },
    ],
  },
];

export const balconyRailing = [
  { axis: "x", at: balcony.x1, from: balcony.z1, to: balcony.z2 },
  { axis: "z", at: balcony.z1, from: balcony.x1, to: balcony.x2 },
  { axis: "z", at: balcony.z2, from: balcony.x1, to: balcony.x2 },
];

export function roomCenter(room) {
  return { x: (room.x1 + room.x2) / 2, z: (room.z1 + room.z2) / 2 };
}

// Spawn in Entré facing north into Allrum (yaw 0 = world -Z, so PI faces +Z).
export const SPAWN = { x: 2.4, z: 0.75, yaw: Math.PI };
