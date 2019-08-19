import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import GameContextProviderWrapper from "./context";

ReactDOM.render(
  <GameContextProviderWrapper>
    <App />
  </GameContextProviderWrapper>,
  document.getElementById("root")
);
