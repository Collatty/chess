import { initBoard } from '../Board';
import React, {
    createContext,
    Dispatch,
    useContext,
    useReducer,
    cloneElement,
} from 'react';
import { getLegalMoves } from '../logic/rules';

interface State {
    playerToMove: 'white' | 'black';
    board: Record<string, JSX.Element>;
    legalMoves: string[];
}

export interface Payload {
    piece: string;
    fromTile: string;
    toTile: string;
}

interface Action {
    type: 'move' | 'dragStart' | 'dragStop';
    payload: Payload;
}

export const useBoardReducer = () =>
    useReducer(reducer, {
        playerToMove: 'white',
        board: initBoard(),
        legalMoves: [],
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
        case 'dragStart':
            const legalMoves = getLegalMoves(action.payload, state.board);
            return { ...state, legalMoves };
        case 'dragStop':
            return { ...state, legalMoves: [] };
        default:
            return state;
    }
};

export const BoardContext = createContext<[State, Dispatch<Action>]>([
    { playerToMove: 'white', board: {}, legalMoves: [] },
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
