// Shared positions keep the WebGL room, illustrated room and flat map in sync.
export type TableKind = 'plate'|'napkin'|'fork'|'knife'|'spoon'|'water'|'wine'|'cup';
export const tableLayout: {x:number;z:number;kind:TableKind;scale:number;angle?:number}[] = [
  {x:0,z:0,kind:'plate',scale:1},
  {x:0,z:0,kind:'napkin',scale:1},
  {x:-.82,z:0,kind:'fork',scale:.88},
  {x:-.5,z:0,kind:'fork',scale:1},
  {x:.5,z:0,kind:'knife',scale:1},
  {x:.84,z:0,kind:'spoon',scale:1},
  {x:-.7,z:-.72,kind:'plate',scale:.5},
  {x:.5,z:-.62,kind:'water',scale:1},
  {x:-.66,z:0,kind:'fork',scale:.92},
  {x:.67,z:0,kind:'knife',scale:.92},
  {x:-.7,z:-.72,kind:'knife',scale:.62,angle:.65},
  {x:0,z:-.54,kind:'fork',scale:.7,angle:-Math.PI/2},
  {x:0,z:-.71,kind:'spoon',scale:.72,angle:Math.PI/2},
  {x:.77,z:-.5,kind:'wine',scale:1},
  {x:1.02,z:-.37,kind:'wine',scale:.82},
  {x:1.17,z:.37,kind:'spoon',scale:.58},
  {x:.91,z:.4,kind:'cup',scale:1},
];
