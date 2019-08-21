import React from "react";
import { rowSetType, tileType } from "./../../types";

type boardProps = {
  tileSet?: rowSetType;
};

const Board: React.SFC<boardProps> = props => {
  const boardRows =
    !!props.tileSet &&
    props.tileSet.map((row: tileType[]) => {
      const tiles = row.map(tile => {
        return <div className="tile">{tile.kind}</div>;
      });

      return <div className="row">{tiles}</div>;
    });

  return <div className="board">{boardRows}</div>;
};

export default Board;
