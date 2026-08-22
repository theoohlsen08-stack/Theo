// Floor plan reconstruction for:
// Tegefjällsvägen 79, lgh A, Tegefjäll, Åre kommun (Hemnet #21668279)
//
// The listing photos/floor-plan drawing could not be fetched directly in this
// environment (hemnet.se and booli.se are both blocked by network egress
// policy here), so this layout is reconstructed from the facts recoverable
// via search snippets of the listing text: 4 rum (rooms), 57 m², floor 1/3,
// no elevator, 3 bedrooms (1 large + 2 small), open-plan kitchen/living room
// with large windows facing the mountains, fully tiled bathroom with a sauna,
// parquet floors with underfloor heating throughout, a south-facing
// balcony/terrace, ski-in/ski-out next to Gunnilbacken, built 2017.
// Exact room shapes/adjacency are a plausible reconstruction, not a scan of
// the real drawing. See README.md for details and how to correct this once
// the real floor plan/photos are available.
//
// Coordinate system: meters. +X east, +Z north, +Y up. Z=0 is the south
// (view/balcony) façade.

export const CEILING_HEIGHT = 2.5;
export const WALL_THICKNESS = 0.12;
export const DOOR_HEAD_HEIGHT = 2.1;

// Axis-aligned room volumes (interior clear floor area).
export const rooms = [
  {
    id: "living",
    name: "Kök & Vardagsrum",
    x1: 0.0, z1: 0.0, x2: 6.0, z2: 3.2,
    floor: "parquet",
    label: "Open-plan kitchen & living room — large south windows, balcony access",
  },
  {
    id: "bedroom1",
    name: "Sovrum 1",
    x1: 6.0, z1: 0.0, x2: 8.6, z2: 3.2,
    floor: "parquet",
    label: "Largest bedroom, south + east windows",
  },
  {
    id: "corridor",
    name: "Hall",
    x1: 0.0, z1: 3.2, x2: 8.6, z2: 4.1,
    floor: "parquet",
    label: "Connecting corridor",
  },
  {
    id: "bathroom",
    name: "Badrum & Bastu",
    x1: 0.0, z1: 4.1, x2: 2.4, z2: 6.8,
    floor: "tile",
    label: "Fully tiled bathroom with sauna",
  },
  {
    id: "entry",
    name: "Entré",
    x1: 2.4, z1: 4.1, x2: 4.6, z2: 6.8,
    floor: "tile",
    label: "Front door, boot/ski storage",
  },
  {
    id: "bedroom2",
    name: "Sovrum 2",
    x1: 4.6, z1: 4.1, x2: 6.6, z2: 6.8,
    floor: "parquet",
    label: "Smaller bedroom",
  },
  {
    id: "bedroom3",
    name: "Sovrum 3",
    x1: 6.6, z1: 4.1, x2: 8.6, z2: 6.8,
    floor: "parquet",
    label: "Smaller bedroom",
  },
];

export const balcony = { x1: 0.0, z1: -1.5, x2: 6.0, z2: 0.0 };

// Wall segments. Each is either a horizontal run (axis 'z', constant z,
// spanning x from..to) or a vertical run (axis 'x', constant x, spanning z
// from..to). `exterior` marks the building perimeter (thicker, insulated
// look). `openings` are gaps cut into the segment: doors (floor to
// DOOR_HEAD_HEIGHT) or windows (sill..head).
export const walls = [
  // South façade (living room + bedroom1): big windows + balcony sliding door
  {
    id: "south-facade", axis: "z", at: 0.0, from: 0.0, to: 8.6, exterior: true,
    openings: [
      { type: "window", from: 0.3, to: 1.5, sill: 0.4, head: 2.3 },
      { type: "door", from: 2.0, to: 4.4, sill: 0.0, head: 2.15, name: "Balcony door" },
      { type: "window", from: 4.9, to: 5.8, sill: 0.4, head: 2.3 },
      { type: "window", from: 6.6, to: 8.0, sill: 0.4, head: 2.3 },
    ],
  },
  // living/bedroom1 <-> corridor
  {
    id: "mid-1", axis: "z", at: 3.2, from: 0.0, to: 8.6, exterior: false,
    openings: [
      { type: "door", from: 2.8, to: 4.3, sill: 0.0, head: 2.1, name: "Living ↔ hall" },
      { type: "door", from: 6.75, to: 7.75, sill: 0.0, head: 2.05, name: "Bedroom 1 ↔ hall" },
    ],
  },
  // corridor <-> bathroom/entry/bedroom2/bedroom3
  {
    id: "mid-2", axis: "z", at: 4.1, from: 0.0, to: 8.6, exterior: false,
    openings: [
      { type: "door", from: 0.5, to: 1.6, sill: 0.0, head: 2.05, name: "Bathroom door" },
      { type: "door", from: 3.0, to: 4.2, sill: 0.0, head: 2.1, name: "Entry ↔ hall" },
      { type: "door", from: 5.0, to: 6.2, sill: 0.0, head: 2.05, name: "Bedroom 2 door" },
      { type: "door", from: 7.0, to: 8.2, sill: 0.0, head: 2.05, name: "Bedroom 3 door" },
    ],
  },
  // North façade: front door + bedroom windows + small bathroom window
  {
    id: "north-facade", axis: "z", at: 6.8, from: 0.0, to: 8.6, exterior: true,
    openings: [
      { type: "window", from: 0.4, to: 1.2, sill: 1.2, head: 2.1, frosted: true },
      { type: "door", from: 3.05, to: 4.15, sill: 0.0, head: 2.1, name: "Front door" },
      { type: "window", from: 5.0, to: 6.2, sill: 0.9, head: 2.1 },
      { type: "window", from: 6.9, to: 8.2, sill: 0.9, head: 2.1 },
    ],
  },
  // West façade (exterior)
  {
    id: "west-facade", axis: "x", at: 0.0, from: 0.0, to: 6.8, exterior: true,
    openings: [
      { type: "window", from: 1.0, to: 2.2, sill: 0.4, head: 2.3 },
    ],
  },
  // East façade (exterior)
  {
    id: "east-facade", axis: "x", at: 8.6, from: 0.0, to: 6.8, exterior: true,
    openings: [
      { type: "window", from: 1.0, to: 2.2, sill: 0.4, head: 2.3 },
      { type: "window", from: 5.0, to: 6.2, sill: 0.9, head: 2.1 },
    ],
  },
  // Interior partitions (solid, no openings)
  { id: "part-living-bed1", axis: "x", at: 6.0, from: 0.0, to: 3.2, exterior: false, openings: [] },
  { id: "part-bath-entry", axis: "x", at: 2.4, from: 4.1, to: 6.8, exterior: false, openings: [] },
  { id: "part-entry-bed2", axis: "x", at: 4.6, from: 4.1, to: 6.8, exterior: false, openings: [] },
  { id: "part-bed2-bed3", axis: "x", at: 6.6, from: 4.1, to: 6.8, exterior: false, openings: [] },
];

// Balcony railing edges (line segments), drawn as a low glass/steel rail
// rather than a solid wall.
export const balconyRailing = [
  { axis: "z", at: balcony.z1, from: balcony.x1, to: balcony.x2 },
  { axis: "x", at: balcony.x1, from: balcony.z1, to: balcony.z2 },
  { axis: "x", at: balcony.x2, from: balcony.z1, to: balcony.z2 },
];

export function roomCenter(room) {
  return { x: (room.x1 + room.x2) / 2, z: (room.z1 + room.z2) / 2 };
}

// yaw 0 faces world -Z (three.js default camera forward), which from the
// entry looks south through the hall toward the living room/balcony.
export const SPAWN = { x: 3.5, z: 6.3, yaw: 0 };
