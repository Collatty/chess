import { initBoard } from '../Board';
import React, {
    createContext,
    Dispatch,
    useContext,
    useReducer,
    cloneElement,
} from 'react';

interface State {
    playerToMove: 'white' | 'black';
    board: Record<string, JSX.Element>;
}

interface Action {
    type: 'move';
    payload: {
        piece: string;
        fromTile: string;
        toTile: string;
    };
}

export const useBoardReducer = () =>
    useReducer(reducer, {
        playerToMove: 'white',
        board: initBoard(),
    });

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'move':
            const newBoard = { ...state.board };

            newBoard[action.payload.fromTile] = cloneElement(
                newBoard[action.payload.fromTile],
                { piece: '' }
            );

            newBoard[action.payload.toTile] = cloneElement(
                newBoard[action.payload.toTile],
                { piece: action.payload.piece }
            );

            return { ...state, board: newBoard };
        default:
            return state;
    }
};

export const BoardContext = createContext<[State, Dispatch<Action>]>([
    { playerToMove: 'white', board: {} },
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
