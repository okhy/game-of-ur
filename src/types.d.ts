export type diceType = number[]
export type tilePositionType = { x: number, y: number }
export type pieceType = {
  position: number[] | 'box' | 'endgame'
}
export type playerType = {
  pieceKind: pieceKind;
  playerPath: tilePositionType[];
  piecesInBox: number,
  piecesInEndgame: number
};


export type tileType = {
  kind: tileKind;
  occupiedBy: pieceKind | null;
};

export type rowSetType = tileType[][];
