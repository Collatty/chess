import React, { useEffect, useState } from 'react';
import { Props } from './Chess';
import { useBoard, useBoardReducer } from './state/useBoardReducer';
import { Tile } from './Tile';
import { calculateTileOffset } from './utils';

export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const initBoard = () => {
    const board: string[] = ['wr', 'wkn', 'wb', 'wk', 'wq', 'wb', 'wkn', 'wr'];
    board.push(...Array(8).fill('wp'));
    board.push(...Array(32).fill(''));
    board.push(...Array(8).fill('bp'));
    board.push('br', 'bkn', 'bb', 'bk', 'bq', 'bb', 'bkn', 'br');
    return board;
};
export const INITIAL_BOARD = initBoard();

export const getBackgroundColor = (index: number) =>
    calculateTileOffset(index) === 0 ? 'white' : 'black'; // magic formula :))

export const Board = ({ primaryPlayer, autoQueen = false }: Props) => {
    const [state] = useBoard();
    return (
        <div className="board">
            {primaryPlayer === 'white'
                ? state.board
                      .map((piece, index) => (
                          <Tile
                              key={index}
                              piece={piece}
                              backgroundColor={getBackgroundColor(index)}
                              index={index}
                              autoQueen={autoQueen}
                          ></Tile>
                      ))
                      .reverse()
                : state.board.map((piece, index) => (
                      <Tile
                          key={index}
                          piece={piece}
                          backgroundColor={getBackgroundColor(index)}
                          index={index}
                          autoQueen={autoQueen}
                      ></Tile>
                  ))}
        </div>
    );
};

export default Board;
