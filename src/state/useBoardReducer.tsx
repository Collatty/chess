import { createContext, Dispatch, useContext, useReducer } from 'react';
import { INITIAL_BOARD } from '../Board';
import { getLegalMoves, getEnPassantTileIndex } from '../logic/rules';

export interface State {
    playerToMove: 'white' | 'black';
    board: string[];
    legalMoves: number[];
    enPassantTileIndex: number;
    blackCastleShort: boolean;
    blackCastleLong: boolean;
    whiteCastleShort: boolean;
    whiteCastleLong: boolean;
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
        blackCastleShort: true,
        blackCastleLong: true,
        whiteCastleShort: true,
        whiteCastleLong: true,
    });

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case 'move':
            const newBoard = [...state.board];

            newBoard[payload.fromTileIndex] = '';
            newBoard[payload.toTileIndex] = payload.piece;

            if (payload.toTileIndex === state.enPassantTileIndex) {
                payload.piece[0] === 'w'
                    ? (newBoard[payload.toTileIndex - 8] = '')
                    : (newBoard[payload.toTileIndex + 8] = '');
            }
            if (
                payload.piece === 'wk' &&
                payload.fromTileIndex === 3 &&
                payload.toTileIndex === 1
            ) {
                newBoard[0] = '';
                newBoard[2] = 'wr';
            }
            if (
                payload.piece === 'wk' &&
                payload.fromTileIndex === 3 &&
                payload.toTileIndex === 5
            ) {
                newBoard[7] = '';
                newBoard[4] = 'wr';
            }
            if (
                payload.piece === 'bk' &&
                payload.fromTileIndex === 59 &&
                payload.toTileIndex === 57
            ) {
                newBoard[56] = '';
                newBoard[58] = 'br';
            }
            if (
                payload.piece === 'bk' &&
                payload.fromTileIndex === 59 &&
                payload.toTileIndex === 61
            ) {
                newBoard[63] = '';
                newBoard[60] = 'br';
            }

            const enPassantTileIndex = getEnPassantTileIndex(payload);

            switch (payload.fromTileIndex) {
                case 0:
                    return {
                        ...state,
                        board: newBoard,
                        legalMoves: [],
                        enPassantTileIndex,
                        whiteCastleShort: false,
                    };
                case 3:
                    return {
                        ...state,
                        board: newBoard,
                        legalMoves: [],
                        enPassantTileIndex,
                        whiteCastleShort: false,
                        whiteCastleLong: false,
                    };
                case 7:
                    return {
                        ...state,
                        board: newBoard,
                        legalMoves: [],
                        enPassantTileIndex,
                        whiteCastleLong: false,
                    };
                case 56:
                    return {
                        ...state,
                        board: newBoard,
                        legalMoves: [],
                        enPassantTileIndex,
                        blackCastleShort: false,
                    };
                case 59:
                    return {
                        ...state,
                        board: newBoard,
                        legalMoves: [],
                        enPassantTileIndex,
                        blackCastleShort: false,
                        blackCastleLong: false,
                    };
                case 63:
                    return {
                        ...state,
                        board: newBoard,
                        legalMoves: [],
                        enPassantTileIndex,
                        blackCastleLong: false,
                    };
                default:
                    return {
                        ...state,
                        board: newBoard,
                        legalMoves: [],
                        enPassantTileIndex,
                    };
            }

        case 'dragStart':
            const legalMoves = getLegalMoves(payload, state);
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
        blackCastleShort: true,
        blackCastleLong: true,
        whiteCastleLong: true,
        whiteCastleShort: true,
    },
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
