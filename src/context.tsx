import React from "react";
import { rowSetType, playerType } from "./types";
import { dices, rowSet, players } from "./rules";

type boardState = {
  board: rowSetType;
  players: playerType[];
  dices: number[][];
  playerTurn: string;
  diceResult: number;
  throwDice(): void;
  movePiece(): void;
};
const boardState = {
  board: rowSet,
  players: players,
  dices: dices,
  diceResult: 0,
  playerTurn: "",
  throwDice: function() {
    this.diceResult = this.dices.reduce((acc, dice) => {
      return acc + dice[Math.floor(Math.random() * dice.length)];
    }, 0);
  },
  movePiece: function(tileIndex:number) {
  },
  removePiece: function() {}
};

const ContextWrapper = () => {
  const GameContext = React.createContext(boardState);
};

export default ContextWrapper;
