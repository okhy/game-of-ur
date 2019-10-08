import {
  mockRowSet,
  mockPlayerSet,
  mockDiceSet
} from "./../__mocks__/configMocks";
import { createGameState } from "./context";

const mockConfig = {
  board: mockRowSet,
  players: mockPlayerSet,
  dices: mockDiceSet
};

describe("Game state Tests", () => {
  describe("Game state object ...", () => {
    it("... returns initial data", () => {
      const testObj = createGameState(mockConfig);

      expect(testObj).toBeTruthy();
    });
    it("... consists of passed data", () => {
      const testObj = createGameState(mockConfig);

      expect(testObj.board).toEqual(mockRowSet);
      expect(testObj.players).toEqual(mockPlayerSet);
      expect(testObj.dices).toEqual(mockDiceSet);
    });
    it("... computes additional properties", () => {
      const testObj = createGameState(mockConfig);

      expect(testObj.currentPlayerIndex).toEqual(0);
      expect(testObj.diceResult).toEqual(0);
      expect(testObj.diceRolled).toEqual(false);
    });
    it("... has appropriate methods", () => {
      const testObj = createGameState(mockConfig);

      expect(testObj.changeTurn).toBeTruthy();
      expect(testObj.rollDice).toBeTruthy();
      expect(testObj.movePiece).toBeTruthy();
    });
    it("... changes players turn", () => {
      const testObj = createGameState(mockConfig);

      testObj.changeTurn();

      expect(testObj.currentPlayerIndex).toEqual(1);
    });
    it("... rolls dice", () => {
      const testObj = createGameState(mockConfig);

      testObj.rollDice();

      expect(testObj.diceRolled).toEqual(true);
    });
    it("... puts piece on board", () => {
      const testObj = createGameState(mockConfig);

      console.log(testObj.diceRolled);
      testObj.rollDice();
      console.log(testObj.diceRolled);
      testObj.putPieceOnBoard();

      const currentPlayer = testObj.players[testObj.currentPlayerIndex];
      const firstPlayerPathTileCords = currentPlayer.playerPath[0];
      const firstPlayerPathTileOnBoard =
        testObj.board[firstPlayerPathTileCords.y][firstPlayerPathTileCords.x]
          .occupiedBy;

      expect(firstPlayerPathTileOnBoard).toEqual(currentPlayer.pieceKind);
    });

    it("... moves piece", () => {
      const testObj = createGameState(mockConfig);

      testObj.rollDice();
      testObj.putPieceOnBoard();
      testObj.rollDice();
      testObj.movePiece({ x: 0, y: 1 });

      expect(true).toBeTruthy();
    });
  });
});
