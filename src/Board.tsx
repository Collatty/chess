import React, { useState } from 'react';
import Tile from './Tile';

const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const mapInitialPiecePositions = (rank: number, file: string): string => {
  switch (rank + file) {
    case '1A' || '1H':
      return 'wr';
    case '1B' || '1G':
      return 'wkn';
    case '1C' || '1F':
      return 'wb';
    case '1D':
      return 'wq';
    case '1E':
      return 'wk';
    case '7A' || '7H':
      return 'br';
    case '7B' || '7G':
      return 'bkn';
    case '7C' || '7F':
      return 'bb';
    case '7D':
      return 'bq';
    case '7E':
      return 'bk';
  }
  switch (rank) {
    case 2:
      return 'wp';
    case 7:
      return 'bp';
  }
  throw new Error('Illegal rank or file given');
};

const initBoard = () => {
  return RANKS.flatMap((rank) => {
    console.log(rank);
    return FILES.map((file, index) => {
      console.log(file);
      const color = (index + rank) % 2 === 0 ? 'black' : 'white';
      return (
        <Tile
          key={Math.random()}
          piece={mapInitialPiecePositions(rank, file)}
          backgroundColor={color}
          file={file}
          rank={rank}
        ></Tile>
      );
    });
  });
};

export const Board = () => {
  const [tiles, setTiles] = useState<JSX.Element[]>(initBoard());
  console.log(tiles);

  return <div className="board">{tiles}</div>;
};

export default Board;
