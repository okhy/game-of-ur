import { rowSetType, playerType } from "../src/types";
import { tileKind, pieceKind } from "../src/settings";

export const mockRowSet: rowSetType = [
  [
    {
      occupiedBy: null,
      kind: tileKind.single
    },
    {
      occupiedBy: null,
      kind: tileKind.single
    },
    {
      occupiedBy: null,
      kind: tileKind.single
    }
  ],
  [
    {
      occupiedBy: null,
      kind: tileKind.single
    },
    {
      occupiedBy: null,
      kind: tileKind.single
    },
    {
      occupiedBy: null,
      kind: tileKind.single
    }
  ]
];

export const mockPlayerSet: playerType[] = [
  {
    pieceKind: pieceKind.black,
    playerPath: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    piecesInBox: 4,
    piecesInEndgame: 0
  },
  {
    pieceKind: pieceKind.white,
    playerPath: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    piecesInBox: 4,
    piecesInEndgame: 0
  }
];

export const mockDiceSet: number[][] = [[1, 1, 0, 0]];
