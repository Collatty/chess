import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Board } from './Board';
import { BoardContext, useBoardReducer } from './state/useBoardReducer';
import type { Action, State } from './types';

export interface Props {
    primaryPlayer?: 'black' | 'white';
    autoQueen?: boolean;
    externalStateHandler?: [State, React.Dispatch<Action>];
    highlightLegalMoves?: boolean;
}

const isMobile = 'ontouchstart' in document.documentElement;

export const Chess = ({
    primaryPlayer,
    autoQueen,
    externalStateHandler,
    highlightLegalMoves,
}: Props) => {
    const [state, dispatch] = useBoardReducer();
    console.log(isMobile);

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <BoardContext.Provider
                value={externalStateHandler ?? [state, dispatch]}
            >
                <Board
                    primaryPlayer={primaryPlayer}
                    autoQueen={autoQueen}
                    highlightLegalMoves={highlightLegalMoves}
                ></Board>
            </BoardContext.Provider>
        </DndProvider>
    );
};
