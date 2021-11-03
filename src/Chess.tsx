import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from './Board';
import { BoardContext, useBoardReducer } from './state/useBoardReducer';
import type { Action, State } from './types';

export interface Props {
    primaryPlayer?: 'black' | 'white';
    autoQueen?: boolean;
    externalStateHandler?: [State, React.Dispatch<Action>];
}

export const Chess = ({
    primaryPlayer = 'white',
    autoQueen,
    externalStateHandler,
}: Props) => {
    const [state, dispatch] = useBoardReducer();

    return (
        <DndProvider backend={HTML5Backend}>
            <BoardContext.Provider
                value={externalStateHandler ?? [state, dispatch]}
            >
                <Board
                    primaryPlayer={primaryPlayer}
                    autoQueen={autoQueen}
                ></Board>
            </BoardContext.Provider>
        </DndProvider>
    );
};
