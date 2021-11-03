import { createContext, Dispatch, useContext, useReducer } from 'react';
import { getLegalMoves, getEnPassantTileIndex } from '../logic/rules';
import { Action, Payload, State } from '../types';
import { buildFenString } from '../utils';

const initBoard = () => {
    const board: string[] = ['wr', 'wkn', 'wb', 'wk', 'wq', 'wb', 'wkn', 'wr'];
    board.push(...Array(8).fill('wp'));
    board.push(...Array(32).fill(''));
    board.push(...Array(8).fill('bp'));
    board.push('br', 'bkn', 'bb', 'bk', 'bq', 'bb', 'bkn', 'br');
    return board;
};
const INITIAL_BOARD = initBoard();

const initialState: State = {
    playerToMove: 'white',
    board: INITIAL_BOARD,
    legalMoves: [],
    enPassantTileIndex: -1,
    blackCastleShort: true,
    blackCastleLong: true,
    whiteCastleShort: true,
    whiteCastleLong: true,
    fenString: '',
    plyWithoutPawnAdvanceOrCapture: 0,
    fullMoves: 1,
};

export const useBoardReducer = () => useReducer(reducer, initialState);

export const makeMove = (state: State, payload: Payload): State => {
    const newBoard = [...state.board];
    const playerToMove = payload.piece[0] === 'w' ? 'black' : 'white';

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
                playerToMove,
            };
        case 3:
            return {
                ...state,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                whiteCastleShort: false,
                whiteCastleLong: false,
                playerToMove,
            };
        case 7:
            return {
                ...state,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                whiteCastleLong: false,
                playerToMove,
            };
        case 56:
            return {
                ...state,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                blackCastleShort: false,
                playerToMove,
            };
        case 59:
            return {
                ...state,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                blackCastleShort: false,
                blackCastleLong: false,
                playerToMove,
            };
        case 63:
            return {
                ...state,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                blackCastleLong: false,
                playerToMove,
            };
        default:
            return {
                ...state,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                playerToMove,
            };
    }
};

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case 'move':
            const movedState = makeMove(state, payload);
            const isCaptureOrPawnMove =
                state.board[payload.toTileIndex] !== '' ||
                payload.piece[1] === 'p';
            return {
                ...movedState,
                fenString: buildFenString(movedState),
                fullMoves:
                    movedState.playerToMove === 'white'
                        ? movedState.fullMoves + 1
                        : movedState.fullMoves,
                plyWithoutPawnAdvanceOrCapture: isCaptureOrPawnMove
                    ? 0
                    : state.plyWithoutPawnAdvanceOrCapture + 1,
            };
        case 'dragStart':
            const legalMoves = getLegalMoves(state, payload);
            return { ...state, legalMoves };
        case 'dragStop':
            return { ...state, legalMoves: [] };
        case 'clearTile':
            const board = [...state.board];
            board[payload.fromTileIndex] = '';
            return { ...state, board };
        default:
            return state;
    }
};

export const BoardContext = createContext<[State, Dispatch<Action>]>([
    initialState,
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
