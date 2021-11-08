import { createContext, Dispatch, useContext, useReducer } from 'react';
import {
    getLegalMoves,
    getEnPassantTileIndex,
    isCheck,
    isCheckMate,
    isStaleMate,
} from '../logic/rules';
import { Action, BoardState, FenString, Move, State } from '../types';
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
    boardState: {
        playerToMove: 'white',
        board: INITIAL_BOARD,
        legalMoves: [],
        enPassantTileIndex: -1,
        blackCastleShort: true,
        blackCastleLong: true,
        whiteCastleShort: true,
        whiteCastleLong: true,
        plyWithoutPawnAdvanceOrCapture: 0,
        fullMoves: 1,
    },
    gameState: {
        fenString: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        isCheck: false,
        isCheckMate: false,
        isStaleMate: false,
    },
};

export const useBoardReducer = () => useReducer(reducer, initialState);

export const makeMove = (boardState: BoardState, payload: Move): BoardState => {
    const newBoard = [...boardState.board];
    const playerToMove = payload.piece[0] === 'w' ? 'black' : 'white';

    newBoard[payload.fromTileIndex] = '';
    newBoard[payload.toTileIndex] = payload.piece;

    if (payload.toTileIndex === boardState.enPassantTileIndex) {
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
                ...boardState,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                whiteCastleShort: false,
                playerToMove,
            };
        case 3:
            return {
                ...boardState,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                whiteCastleShort: false,
                whiteCastleLong: false,
                playerToMove,
            };
        case 7:
            return {
                ...boardState,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                whiteCastleLong: false,
                playerToMove,
            };
        case 56:
            return {
                ...boardState,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                blackCastleShort: false,
                playerToMove,
            };
        case 59:
            return {
                ...boardState,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                blackCastleShort: false,
                blackCastleLong: false,
                playerToMove,
            };
        case 63:
            return {
                ...boardState,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                blackCastleLong: false,
                playerToMove,
            };
        default:
            return {
                ...boardState,
                board: newBoard,
                legalMoves: [],
                enPassantTileIndex,
                playerToMove,
            };
    }
};

const reducer = (state: State, { type, payload }: Action): State => {
    switch (type) {
        case 'move':
            const movedState = makeMove(state.boardState, payload as Move);
            const isCaptureOrPawnMove =
                state.boardState.board[(payload as Move).toTileIndex] !== '' ||
                (payload as Move).piece[1] === 'p';
            return {
                boardState: {
                    ...movedState,
                    fullMoves:
                        movedState.playerToMove === 'white'
                            ? movedState.fullMoves + 1
                            : movedState.fullMoves,
                    plyWithoutPawnAdvanceOrCapture: isCaptureOrPawnMove
                        ? 0
                        : state.boardState.plyWithoutPawnAdvanceOrCapture + 1,
                },
                gameState: {
                    fenString: buildFenString(movedState),
                    isCheck: isCheck(movedState, (payload as Move).piece[0]),
                    isCheckMate: isCheckMate(
                        movedState,
                        (payload as Move).piece[0]
                    ),
                    isStaleMate: isStaleMate(
                        movedState,
                        (payload as Move).piece[0]
                    ),
                },
            };
        case 'dragStart':
            const legalMoves = getLegalMoves(state.boardState, payload as Move);
            return {
                gameState: state.gameState,
                boardState: { ...state.boardState, legalMoves: legalMoves },
            };
        case 'dragStop':
            return {
                gameState: state.gameState,
                boardState: { ...state.boardState, legalMoves: [] },
            };
        case 'clearTile':
            const board = [...state.boardState.board];
            board[(payload as Move).fromTileIndex] = '';
            return {
                gameState: state.gameState,
                boardState: { ...state.boardState, board },
            };
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
