import React from 'react';
import { Props } from './Chess';
import { useBoard } from './state/useBoardReducer';
import { Tile } from './Tile';
import { getBackgroundColor } from './utils';

export const Board = ({
    primaryPlayer = 'white',
    autoQueen = false,
    highlightLegalMoves = true,
}: Props) => {
    const [fullState] = useBoard();
    const { boardState: state } = fullState;
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
                              highlightLegalMoves={highlightLegalMoves}
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
                          highlightLegalMoves={highlightLegalMoves}
                      ></Tile>
                  ))}
        </div>
    );
};

export default Board;
