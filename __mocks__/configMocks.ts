import { rowSetType, playerType } from "../src/types";

export const mockRowSet: rowSetType = [
  [
    {
      id: 1
    }
  ]
];

export const mockPlayerSet: playerType[] = [
  { id: 1, pieceType: "black", playerPath: [1, 2, 3], pieceCount: 4 },
  { id: 2, pieceType: "white", playerPath: [4, 2, 5], pieceCount: 4 }
];

export const mockDiceSet: number[][] = [[1, 1, 0, 0]];
