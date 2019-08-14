import { tileType, pieceType } from "./types";

const midLane: number[] = [9, 10, 11, 12, 13, 14, 15, 16];

type playerType = {
  id: number,
  pieceType: string,
  playerPath: number[]
};

const dice: number[] = [0, 0, 1, 1];
export const dices: number[][] = [dice, dice, dice, dice];

export const players: playerType[] = [
  {
    id: 1,
    pieceType: "black",
    playerPath: [4, 3, 2, 1, ...midLane, 8, 7]
  },
  {
    id: 2,
    pieceType: "white",
    playerPath: [20, 19, 18, 17, ...midLane, 24, 23]
  }
];

export const rowSet: tileType[][] = [
  [
    { id: 1, isRosette: true, pieces: [], accepts: [pieceType.first] },
    { id: 2, pieces: [], accepts: [pieceType.first] },
    { id: 3, pieces: [], accepts: [pieceType.first] },
    { id: 4, pieces: [], accepts: [pieceType.first] },
    { id: 5, pieces: [], accepts: [] },
    { id: 6, pieces: [], accepts: [] },
    { id: 7, isRosette: true, pieces: [], accepts: [pieceType.first] },
    { id: 8, pieces: [], accepts: [pieceType.first] }
  ],
  [
    { id: 9, pieces: [], accepts: [pieceType.first, pieceType.second] },
    { id: 10, pieces: [], accepts: [pieceType.first, pieceType.second] },
    { id: 11, pieces: [], accepts: [pieceType.first, pieceType.second] },
    {
      pieces: [],
      id: 12,
      accepts: [pieceType.first, pieceType.second],
      isRosette: true
    },
    { id: 13, pieces: [], accepts: [pieceType.first, pieceType.second] },
    { id: 14, pieces: [], accepts: [pieceType.first, pieceType.second] },
    { id: 15, pieces: [], accepts: [pieceType.first, pieceType.second] },
    { id: 16, pieces: [], accepts: [pieceType.first, pieceType.second] }
  ],
  [
    { id: 17, isRosette: true, pieces: [], accepts: [pieceType.second] },
    { id: 18, pieces: [], accepts: [pieceType.second] },
    { id: 19, pieces: [], accepts: [pieceType.second] },
    { id: 20, pieces: [], accepts: [pieceType.second] },
    { id: 21, pieces: [], accepts: [] },
    { id: 22, pieces: [], accepts: [] },
    { id: 23, isRosette: true, pieces: [], accepts: [pieceType.second] },
    { id: 24, pieces: [], accepts: [pieceType.second] }
  ]
];
