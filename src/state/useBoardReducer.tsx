import { createContext, Dispatch, useContext, useReducer } from 'react';
import { INITIAL_BOARD } from '../Board';
import { getLegalMoves, getEnPassantTileIndex } from '../logic/rules';

interface State {
    playerToMove: 'white' | 'black';
    board: string[];
    legalMoves: number[];
    enPassantTileIndex: number;
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
        enPassantTileIndex: -1,
    });

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'move':
            const newBoard = [...state.board];

            newBoard[action.payload.fromTileIndex] = '';
            newBoard[action.payload.toTileIndex] = action.payload.piece;

            if (action.payload.toTileIndex === state.enPassantTileIndex) {
                action.payload.piece[0] === 'w'
                    ? (newBoard[action.payload.toTileIndex - 8] = '')
                    : (newBoard[action.payload.toTileIndex + 8] = '');
            }

            const enPassantTileIndex = getEnPassantTileIndex(action.payload);
            console.log(enPassantTileIndex);

            return {
                ...state,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
            };
        case 'dragStart':
            const legalMoves = getLegalMoves(
                action.payload,
                state.board,
                state.enPassantTileIndex
            );
            return { ...state, legalMoves };
        case 'dragStop':
            return { ...state, legalMoves: [] };
        default:
            return state;
    }
};

export const BoardContext = createContext<[State, Dispatch<Action>]>([
    {
        playerToMove: 'white',
        board: [],
        legalMoves: [],
        enPassantTileIndex: -1,
    },
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
