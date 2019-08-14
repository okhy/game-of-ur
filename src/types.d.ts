
export enum pieceType {
  first = 'black',
  second = 'white'
}

export type tileType = { pieces: string[], accepts: pieceType[], id: number, isRosette?: boolean }
