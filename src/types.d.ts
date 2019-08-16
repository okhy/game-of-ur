export type playerType = {
  id: number;
  pieceType: string;
  playerPath: number[];
  pieceCount: number;
};

export type tileType = {
  id: number;
  isRosette?: boolean;
  isOccupied?: boolean;
};

export type rowSetType = tileType[][];
