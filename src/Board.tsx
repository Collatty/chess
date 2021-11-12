import React from 'react';
import { Props } from './Chess';
import { useBoard } from './state/useBoardReducer';
import { Tile } from './Tile';
import { getBackgroundColor, generateBoardStateFromFenString } from './utils';

export const Board = ({
    primaryPlayer = 'white',
    autoQueen = false,
    highlightLegalMoves = true,
}: Props) => {
    const [state] = useBoard();
    const displayedBoard = (
        state.rewindIndex === -1
            ? state.boardState.board
            : generateBoardStateFromFenString(
                  state.gameState.history.slice(state.rewindIndex)[0],
              ).board
    ).map((piece, index) => (
        <Tile
            key={index}
            piece={piece}
            backgroundColor={getBackgroundColor(index)}
            index={index}
            autoQueen={autoQueen}
            highlightLegalMoves={highlightLegalMoves}
            primaryPlayer={primaryPlayer}
        ></Tile>
    ));
    return (
        <div className="board">
            {primaryPlayer === 'white'
                ? displayedBoard.reverse()
                : displayedBoard}
        </div>
    );
};

export default Board;
