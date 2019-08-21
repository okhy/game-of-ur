import { playerType, tilePositionType, diceType, tileType } from "./types";

// import { tileType, playerType, tileKind, pieceKind } from "./types";
// import Board from "./components/Board";

export enum pieceKind {
  black, white
}
export enum tileKind {
  rosette,
  none,
  single
}

const midLane: tilePositionType[] = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 7, y: 1 }
];

export const playerSet: playerType[] = [
  {
    pieceKind: pieceKind.black,
    playerPath: [{ x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }, ...midLane, { x: 7, y: 0 }, { x: 6, y: 0 }],
    piecesInBox: 7,
    piecesInEndgame: 0
  },
  {
    pieceKind: pieceKind.white,
    playerPath: [{ x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }, ...midLane, { x: 7, y: 2 }, { x: 6, y: 2 }],
    piecesInBox: 7,
    piecesInEndgame: 0
  }
];

const dice: diceType = [0, 0, 1, 1];
export const dices: diceType[] = [dice, dice, dice, dice];

export const rowSet: tileType[][] = [
  [
    { occupiedBy: null, kind: tileKind.rosette },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.none },
    { occupiedBy: null, kind: tileKind.none },
    { occupiedBy: null, kind: tileKind.rosette },
    { occupiedBy: null, kind: tileKind.single }
  ],
  [
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.rosette },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single }
  ],
  [
    { occupiedBy: null, kind: tileKind.rosette },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.single },
    { occupiedBy: null, kind: tileKind.none },
    { occupiedBy: null, kind: tileKind.none },
    { occupiedBy: null, kind: tileKind.rosette },
    { occupiedBy: null, kind: tileKind.single }
  ]
];
