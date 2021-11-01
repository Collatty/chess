import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from './Board';
import { BoardContext, useBoardReducer } from './state/useBoardReducer';

export interface Props {
    primaryPlayer: 'black' | 'white';
}

export const Chess = ({ primaryPlayer = 'white' }: Props) => {
    const [state, dispatch] = useBoardReducer();

    return (
        <DndProvider backend={HTML5Backend}>
            <BoardContext.Provider value={[state, dispatch]}>
                <Board primaryPlayer={primaryPlayer}></Board>
            </BoardContext.Provider>
        </DndProvider>
    );
};
