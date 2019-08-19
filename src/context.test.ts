import { mockRowSet, mockPlayerSet, mockDiceSet } from './../__mocks__/configMocks'
import { createGameState, changeTurn } from './context'

const mockConfig = { board: mockRowSet, players: mockPlayerSet, dices: mockDiceSet }

describe("Game state Tests", () => {
  describe('Game state object ...', () => {
    it("... returns initial data", () => {
      const testObj = createGameState(mockConfig)

      expect(testObj).toBeTruthy()
    });
    it('... consists of passed data', () => {
      const testObj = createGameState(mockConfig)

      expect(testObj.board).toEqual(mockRowSet)
      expect(testObj.players).toEqual(mockPlayerSet)
      expect(testObj.dices).toEqual(mockDiceSet)
    })
    it('... computes additional properties', () => {
      const testObj = createGameState(mockConfig)

      expect(testObj.currentPlayerID).toEqual(1)
      expect(testObj.diceResult).toEqual(0)
    })
    it('... has appropriate methods', () => {
      const testObj = createGameState(mockConfig)

      expect(testObj.changeTurn).toBeTruthy()
      expect(testObj.throwDice).toBeTruthy()
      expect(testObj.movePiece).toBeTruthy()
    })
    it("... changes players turn", () => {
      const testObj = createGameState(mockConfig)

      testObj.changeTurn()

      expect(testObj.currentPlayerID).toEqual(mockPlayerSet[1].id);
    });
    it("... throws dice", () => {
      const testObj = createGameState(mockConfig);

      testObj.throwDice()

      expect(testObj.diceResult).not.toEqual(0)
    });
    it.todo("... moves piece", () => {
      const testObj = createGameState(mockConfig);

      testObj.movePiece(0)

    });

    describe('Throw dice helper function ...', () => {
      it('changeTurn function', () => {
        const testPlayerID = changeTurn(mockPlayerSet[0].id, mockPlayerSet)

        expect(testPlayerID).toEqual(mockPlayerSet[1].id)
      })
    })
  })
});
