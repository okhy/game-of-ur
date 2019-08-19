import React from "react";
import { GameContext, gameStateType } from "./context";

const App: React.SFC = () => {
  return (
    <GameContext.Consumer>
      {(gameState: gameStateType) => {
        return <span>Andrzej {gameState.diceResult}</span>;
      }}
    </GameContext.Consumer>
  );
};

export default App;
