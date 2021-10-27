import { createContext, Dispatch, useContext, useReducer } from 'react';
import { INITIAL_BOARD } from '../Board';
import { getLegalMoves } from '../logic/rules';

interface State {
    playerToMove: 'white' | 'black';
    board: string[];
    legalMoves: number[];
}

export interface Payload {
    piece: string;
    fromTileIndex: number;
    toTileIndex: number;
}

interface Action {
    type: 'move' | 'dragStart' | 'dragStop';
    payload: Payload;
}

export const useBoardReducer = () =>
    useReducer(reducer, {
        playerToMove: 'white',
        board: INITIAL_BOARD,
        legalMoves: [],
    });

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'move':
            const newBoard = [...state.board];

            newBoard[action.payload.fromTileIndex] = '';
            newBoard[action.payload.toTileIndex] = action.payload.piece;

            return { ...state, board: newBoard, legalMoves: [] };
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
    { playerToMove: 'white', board: [], legalMoves: [] },
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
