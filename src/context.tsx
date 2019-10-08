import React from "react";
import { tilePositionType, rowSetType, playerType, diceType } from "./types";
import { dices, rowSet, playerSet, tileKind } from "./settings";

type initialGameStateType = {
  board: rowSetType;
  players: playerType[];
  dices: diceType[];
};

const initialGameState: initialGameStateType = {
  board: rowSet,
  players: playerSet,
  dices: dices
};

export interface gameStateType extends initialGameStateType {
  diceRolled: boolean;
  diceResult: number;
  currentPlayerIndex: number;
  changeTurn(): void;
  rollDice(): void;
  wasDiceRolled(): void;
  takePieceOffBoard(targetTile: tilePositionType): void;
  putPieceOnBoard(): void;
  movePiece(startingTileCords: tilePositionType): void;
  canPlayerMove(): boolean;
  resetGame(): void;
}

export const createGameState = (
  initialState: initialGameStateType
): gameStateType => {
  return {
    board: initialState.board,
    players: initialState.players,
    dices: initialState.dices,
    currentPlayerIndex: 0,
    diceResult: 0,
    diceRolled: false,
    changeTurn: function() {
      const isLastPlayer = this.currentPlayerIndex + 1 >= this.players.length;
      this.currentPlayerIndex = isLastPlayer ? 0 : this.currentPlayerIndex + 1;
      this.diceRolled = false;
    },
    rollDice: function() {
      if (!this.diceRolled) {
        this.diceRolled = true;
        this.diceResult = this.dices.reduce((acc, dice) => {
          return acc + dice[Math.floor(Math.random() * dice.length)];
        }, 0);
      }
    },
    wasDiceRolled: function() {
      if (!this.diceRolled) throw new Error("You have to roll the dice");
    },
    canPlayerMove: function() {
      return this.diceRolled && !!this.diceResult;
    },
    putPieceOnBoard: function() {
      this.wasDiceRolled();

      const currentPlayer = this.players[this.currentPlayerIndex];
      if (!currentPlayer.piecesInBox)
        throw new Error("Current Player has no pieces in box");

      const currentPlayerPath = currentPlayer.playerPath;

      this.players[this.currentPlayerIndex].piecesInBox--;
      this.board[currentPlayerPath[this.diceResult - 1].y][
        currentPlayerPath[this.diceResult - 1].x
      ].occupiedBy = currentPlayer.pieceKind;
    },
    takePieceOffBoard: function(targetTile) {
      this.players[this.currentPlayerIndex].piecesInEndgame++;
      this.board[targetTile.y][targetTile.x].occupiedBy = null;
    },
    movePiece: function(startingTileCords) {
      this.wasDiceRolled();

      const currentPlayer = this.players[this.currentPlayerIndex];
      const currentPlayerPath = currentPlayer.playerPath;

      const startingTile = this.board[startingTileCords.y][startingTileCords.x];
      const isOccupied = !!startingTile.occupiedBy;
      const tilePieceMatchesCurrentPlayer =
        isOccupied &&
        startingTile.occupiedBy ===
          this.players[this.currentPlayerIndex].pieceKind;

      if (!isOccupied || !tilePieceMatchesCurrentPlayer)
        throw new Error("tile has no piece on it");

      const startingTileIndexInPlayerPath = currentPlayerPath.findIndex(
        tile => startingTileCords.y === tile.y && startingTileCords.x === tile.x
      );
      const targetTileIndexInPlayerPath =
        startingTileIndexInPlayerPath + this.diceResult;

      if (targetTileIndexInPlayerPath > currentPlayerPath.length) {
        throw new Error("move exceeds path length");
      } else if (targetTileIndexInPlayerPath === currentPlayerPath.length) {
        // move piece to engame
        this.takePieceOffBoard(startingTileCords);
      } else {
        // move piece on board
        const targetTileCords = currentPlayerPath[targetTileIndexInPlayerPath];
        const targetTile = this.board[targetTileCords.y][targetTileCords.x];
        // check type
        const moveTile = () => {
          if (
            !targetTile.occupiedBy ||
            targetTile.occupiedBy !== currentPlayer.pieceKind
          ) {
            this.board[targetTileCords.y][targetTileCords.x].occupiedBy =
              currentPlayer.pieceKind;
            this.board[startingTileCords.y][
              startingTileCords.x
            ].occupiedBy = null;
          }
        };
        switch (targetTile.kind) {
          case tileKind.none:
            throw new Error("ERROR cannot place a piece on that tile");
          case tileKind.rosette:
            this.diceRolled = false;
            moveTile();
            break;
          default:
            moveTile();
            break;
        }
      }
    },
    resetGame: function() {
      this.board = initialState.board;
      this.players = initialState.players;
      this.dices = initialState.dices;
      this.currentPlayerIndex = 0;
      this.diceResult = 0;
      this.diceRolled = false;
    }
  };
};
const gameState = createGameState(initialGameState);

export const GameContext: any = React.createContext(gameState);

const GameContextProviderWrapper: React.SFC = ({ children }) => (
  <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
);

export default GameContextProviderWrapper;
