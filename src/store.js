import { writable } from "svelte/store";

/** Tile type:
 *  {
 *    piece: [pieceTypeReference], // some rules might allow piece stacking
 *    accepts: [pieceTypeReference],
 *    id: number,
 *    isRosette: boolean
 *  },
 */
let rowSet = [
  [
    { pieces: [], accepts: [pieceType[1]], id: 1, isRosette: true },
    { pieces: [], accepts: [pieceType[1]], id: 2 },
    { pieces: [], accepts: [pieceType[1]], id: 3 },
    { pieces: [], accepts: [pieceType[1]], id: 4 },
    { pieces: [], accepts: [], id: 5 },
    { pieces: [], accepts: [], id: 6 },
    { pieces: [], accepts: [pieceType[1]], id: 7, isRosette: true },
    { pieces: [], accepts: [pieceType[1]], id: 8 }
  ],
  [
    { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 9 },
    { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 10 },
    { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 11 },
    {
      pieces: [],
      accepts: [pieceType[1], pieceType[2]],
      id: 12,
      isRosette: true
    },
    { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 13 },
    { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 14 },
    { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 15 },
    { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 16 }
  ],
  [
    { pieces: [], accepts: [pieceType[2]], id: 17, isRosette: true },
    { pieces: [], accepts: [pieceType[2]], id: 18 },
    { pieces: [], accepts: [pieceType[2]], id: 19 },
    { pieces: [], accepts: [pieceType[2]], id: 20 },
    { pieces: [], accepts: [], id: 21 },
    { pieces: [], accepts: [], id: 22 },
    { pieces: [], accepts: [pieceType[2]], id: 23, isRosette: true },
    { pieces: [], accepts: [pieceType[2]], id: 24 }
  ]
];

export const boardState = writable(rowSet);
