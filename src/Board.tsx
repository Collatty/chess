import React from 'react';
import { Props } from './Chess';
import { useBoard } from './state/useBoardReducer';
import { Tile } from './Tile';
import { getBackgroundColor } from './utils';

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
