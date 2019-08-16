import { tileType, playerType } from "./types";

const midLane: number[] = [9, 10, 11, 12, 13, 14, 15, 16];

const dice: number[] = [0, 0, 1, 1];
export const dices: number[][] = [dice, dice, dice, dice];

type pieceType = {
  id: number;
  position: number | null;
};

export const players: playerType[] = [
  {
    id: 1,
    pieceType: "black",
    playerPath: [4, 3, 2, 1, ...midLane, 8, 7],
    pieceCount: 7
  },
  {
    id: 2,
    pieceType: "white",
    playerPath: [20, 19, 18, 17, ...midLane, 24, 23],
    pieceCount: 7
  }
];

export const rowSet: tileType[][] = [
  [
    { id: 1, isOccupied: false, isRosette: true },
    { id: 2, isOccupied: false },
    { id: 3, isOccupied: false },
    { id: 4, isOccupied: false },
    { id: 5, isOccupied: false },
    { id: 6, isOccupied: false },
    { id: 7, isOccupied: false, isRosette: true },
    { id: 8, isOccupied: false }
  ],
  [
    { id: 9, isOccupied: false },
    { id: 10, isOccupied: false },
    { id: 11, isOccupied: false },
    {
      id: 12,
      isOccupied: false,
      isRosette: true
    },
    { id: 13, isOccupied: false },
    { id: 14, isOccupied: false },
    { id: 15, isOccupied: false },
    { id: 16, isOccupied: false }
  ],
  [
    { id: 17, isOccupied: false, isRosette: true },
    { id: 18, isOccupied: false },
    { id: 19, isOccupied: false },
    { id: 20, isOccupied: false },
    { id: 21, isOccupied: false },
    { id: 22, isOccupied: false },
    { id: 23, isOccupied: false, isRosette: true },
    { id: 24, isOccupied: false }
  ]
];
