import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from './Board';
import { BoardContext, useBoardReducer } from './state/useBoardReducer';

export const Chess = () => {
    const [state, dispatch] = useBoardReducer();

    return (
        <DndProvider backend={HTML5Backend}>
            <BoardContext.Provider value={[state, dispatch]}>
                <div className="chess">
                    <h1 className="header-primary">Collatty chess</h1>
                    <Board></Board>
                </div>
            </BoardContext.Provider>
        </DndProvider>
    );
};
