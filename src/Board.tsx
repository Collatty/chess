import React, { useState } from 'react';
import Tile from './Tile';

const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const Board = () => {
  return (
    <div className="board">
      {RANKS.map((rank) => {
        return FILES.map((file, index) => {
          const color = (index + rank) % 2 === 0 ? 'black' : 'white';
          return (
            <Tile
              key={rank + index}
              piece={undefined}
              backgroundColor={color}
              file={file}
              rank={rank}
            ></Tile>
          );
        });
      })}
    </div>
  );
};

export default Board;
