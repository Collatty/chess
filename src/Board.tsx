import React, { useState } from 'react';
import Tile from './Tile';

const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const mapInitialPiecePositions = (rank: number, file: string): string => {
    switch (rank + file) {
        case '1A':
        case '1H':
            return 'wr';
        case '1B':
        case '1G':
            return 'wkn';
        case '1C':
        case '1F':
            return 'wb';
        case '1D':
            return 'wq';
        case '1E':
            return 'wk';
        case '8A':
        case '8H':
            return 'br';
        case '8B':
        case '8G':
            return 'bkn';
        case '8C':
        case '8F':
            return 'bb';
        case '8D':
            return 'bq';
        case '8E':
            return 'bk';
    }
    switch (rank) {
        case 2:
            return 'wp';
        case 7:
            return 'bp';
    }
    return '';
};

const initBoard = () => {
    return RANKS.reverse().flatMap((rank) => {
        console.log(rank);

        return FILES.map((file, index) => {
            const color = (index + rank) % 2 === 0 ? 'white' : 'black';
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
    const [primaryPlayer, setPrimaryPlayer] = useState<'white' | 'black'>(
        'white'
    );
    const [tiles, setTiles] = useState<JSX.Element[]>(initBoard());

    return <div className="board">{tiles}</div>;
};

export default Board;
