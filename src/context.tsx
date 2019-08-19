import React from "react";
import { rowSetType, playerType } from "./types";
import { dices, rowSet, playerSet } from "./rules";

export const throwDice = (diceSet: number[][]): number => {
  return diceSet.reduce((acc, dice) => {
    return acc + dice[Math.floor(Math.random() * dice.length)];
  }, 0);
};

export const movePiece = (
  board: rowSetType,
  tileIndex: number,
  moves: number,
  path: number[]
): rowSetType => {
  return board;
};

export const changeTurn = (
  currentPlayerID: number,
  players: playerType[]
): number => {
  const currentPlayerIndex = players.findIndex(
    player => player.id === currentPlayerID
  );

  if (currentPlayerIndex + 1 >= players.length) {
    return players[0].id;
  }
  return players[currentPlayerIndex + 1].id;
};

type initialGameStateType = {
  board: rowSetType;
  players: playerType[];
  dices: number[][];
};
const initialGameState: initialGameStateType = {
  board: rowSet,
  players: playerSet,
  dices: dices
};

export interface gameStateType extends initialGameStateType {
  diceResult: number;
  currentPlayerID: number;
  changeTurn(): void;
  throwDice(): void;
  movePiece(tileStart?: number): void;
}

export const createGameState = (
  initialState: initialGameStateType
): gameStateType => {
  return {
    board: initialState.board,
    players: initialState.players,
    dices: initialState.dices,
    currentPlayerID: initialState.players[0].id,
    diceResult: 0,
    changeTurn: function() {
      this.currentPlayerID = changeTurn(this.currentPlayerID, this.players);
    },
    throwDice: function() {
      this.diceResult = throwDice(this.dices);
    },
    movePiece: function(tileStart) {
      const moves = tileStart
        ? this.diceResult > 0
          ? this.diceResult - 1
          : 0
        : 0;

      this.board = movePiece(
        this.board,
        tileStart || this.players[this.currentPlayerID].playerPath[0],
        moves,
        this.players[this.currentPlayerID].playerPath
      );
      this.changeTurn();
    }
  };
};
const gameState = createGameState(initialGameState);

export const GameContext: any = React.createContext(gameState);

const GameContextProviderWrapper: React.SFC = ({ children }) => (
  <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
);

export default GameContextProviderWrapper;
