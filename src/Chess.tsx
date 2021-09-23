import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from './Board';

export const Chess = () => (
    <DndProvider backend={HTML5Backend}>
        <div className="chess">
            <h1 className="header-primary">Collatty chess</h1>
            <Board></Board>
        </div>
    </DndProvider>
);
