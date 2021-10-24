import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from './Board';
import { CollattyChessLogo } from './logo';
import { BoardContext, useBoardReducer } from './state/useBoardReducer';

export const Chess = () => {
    const [state, dispatch] = useBoardReducer();

    return (
        <>
            <div className="header">
                <div className="logo">
                    <CollattyChessLogo></CollattyChessLogo>
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <BoardContext.Provider value={[state, dispatch]}>
                    <div className="chess">
                        <h1 className="header-primary">Collatty chess</h1>
                        <Board></Board>
                    </div>
                </BoardContext.Provider>
            </DndProvider>
        </>
    );
};
