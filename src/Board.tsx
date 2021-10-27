import React, { useEffect, useState } from 'react';
import { useBoard, useBoardReducer } from './state/useBoardReducer';
import { Tile } from './Tile';
import { calculateTileOffset } from './utils';

export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const secondInitBoard = () => {
    const board: string[] = ['wr', 'wkn', 'wb', 'wk', 'wq', 'wb', 'wkn', 'wr'];
    board.push(...Array(8).fill('wp'));
    board.push(...Array(32).fill(''));
    board.push(...Array(8).fill('bp'));
    board.push('br', 'bkn', 'bb', 'bk', 'bq', 'bb', 'bkn', 'br');
    return board;
};
export const INITIAL_BOARD = secondInitBoard();

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

export const getBackgroundColor = (index: number) =>
    calculateTileOffset(index) === 0 ? 'white' : 'black'; // magic formula :))

export const Board = () => {
    const [state] = useBoard();
    useEffect(() => {
        console.log(state.legalMoves);
    }, [state]);
    return (
        <div className="board">
            {state.board.map((piece, index) => (
                <Tile
                    key={index}
                    piece={piece}
                    backgroundColor={getBackgroundColor(index)}
                    index={index}
                ></Tile>
            ))}
        </div>
    );
};

export default Board;
