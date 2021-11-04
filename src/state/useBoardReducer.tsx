import { createContext, Dispatch, useContext, useReducer } from 'react';
import {
    getLegalMoves,
    getEnPassantTileIndex,
    isCheck,
    isCheckMate,
    isStaleMate,
} from '../logic/rules';
import { Action, FenString, Move, State } from '../types';
import { buildFenString, generateStateFromFenString } from '../utils';

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
    fenString: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    plyWithoutPawnAdvanceOrCapture: 0,
    fullMoves: 1,
    isCheck: false,
    isCheckMate: false,
    isStaleMate: false,
};

export const useBoardReducer = () => useReducer(reducer, initialState);

export const makeMove = (state: State, payload: Move): State => {
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
            const movedState = makeMove(state, payload as Move);
            const isCaptureOrPawnMove =
                state.board[(payload as Move).toTileIndex] !== '' ||
                (payload as Move).piece[1] === 'p';
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
                isCheck: isCheck(movedState, (payload as Move).piece[0]),
                isCheckMate: isCheckMate(
                    movedState,
                    (payload as Move).piece[0]
                ),
                isStaleMate: isStaleMate(
                    movedState,
                    (payload as Move).piece[0]
                ),
            };
        case 'dragStart':
            const legalMoves = getLegalMoves(state, payload as Move);
            return { ...state, legalMoves };
        case 'dragStop':
            return { ...state, legalMoves: [] };
        case 'clearTile':
            const board = [...state.board];
            board[(payload as Move).fromTileIndex] = '';
            return { ...state, board };
        case 'setStateFromFenString':
            return generateStateFromFenString((payload as FenString).fenString);
        default:
            return state;
    }
};

export const BoardContext = createContext<[State, Dispatch<Action>]>([
    initialState,
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
