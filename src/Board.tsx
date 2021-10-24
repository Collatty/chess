import React, { useState } from 'react';
import { useBoard, useBoardReducer } from './state/useBoardReducer';
import { Tile } from './Tile';

export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const mapInitialPiecePositions = (rank: string, file: string): string => {
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
        case '2':
            return 'wp';
        case '7':
            return 'bp';
    }
    return '';
};

export const initBoard = () => {
    const board: Record<string, JSX.Element> = {};
    RANKS.reverse().flatMap((rank, firstIndex) => {
        FILES.map((file, index) => {
            const color = (index + firstIndex) % 2 === 0 ? 'white' : 'black';
            board[file + rank] = (
                <Tile
                    key={file + rank}
                    piece={mapInitialPiecePositions(rank, file)}
                    backgroundColor={color}
                    file={file}
                    rank={rank}
                ></Tile>
            );
        });
    });
    return board;
};

export const Board = () => {
    const [state] = useBoard();
    console.log(state.board.values);
    return <div className="board">{Object.values(state.board)}</div>;
};

export default Board;
