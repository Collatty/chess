import { createContext, Dispatch, useContext, useReducer } from 'react';
import {
    getLegalMoves,
    getEnPassantTileIndex,
    isCheck,
    isCheckMate,
    isStaleMate,
} from '../logic/rules';
import {
    Action,
    BoardState,
    FenString,
    Move,
    State,
    AlgebraicMove,
} from '../types';
import {
    buildFenString,
    generateBoardStateFromFenString,
    mapMoveToAlgebraicNotation,
    translateAlgebraicStringToMove,
} from '../utils';

const initBoard = () => {
    const board: string[] = ['wr', 'wn', 'wb', 'wk', 'wq', 'wb', 'wn', 'wr'];
    board.push(...Array(8).fill('wp'));
    board.push(...Array(32).fill(''));
    board.push(...Array(8).fill('bp'));
    board.push('br', 'bn', 'bb', 'bk', 'bq', 'bb', 'bn', 'br');
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
        selectedPieceTileIndex: -1,
    },
    gameState: {
        fenString: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        history: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
        moveHistory: [],
        isCheck: false,
        isCheckMate: false,
        isStaleMate: false,
        isThreefoldRepetitionDraw: false,
        isFiftyMoveRuleDraw: false,
        isDrawClaimed: false,
        isGameOver: false,
    },
    rewindIndex: -1,
};

export const useBoardReducer = () => useReducer(reducer, initialState);

export const makeMove = (boardState: BoardState, payload: Move): BoardState => {
    const newBoard = [...boardState.board];
    const playerToMove = payload.piece[0] === 'w' ? 'black' : 'white';

    newBoard[payload.fromTileIndex] = '';
    newBoard[payload.toTileIndex] = payload.promotionPiece || payload.piece;

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

const checkThreefoldRepetitionDraw = (history: string[]): boolean =>
    [...history.slice(0, history.length - 1)].filter(
        (fen) => fen.split(' ')[0] === history.slice(-1)[0].split(' ')[0],
    ).length >= 2;

const reducer = (state: State, { type, payload }: Action): State => {
    switch (type) {
        case 'move': {
            const move =
                payload && 'algebraicMove' in payload
                    ? translateAlgebraicStringToMove(
                          { ...state },
                          (payload as AlgebraicMove).algebraicMove,
                      )
                    : (payload as Move);

            const movedState = makeMove(state.boardState, move);
            const isCaptureOrPawnMove =
                state.boardState.board[move.toTileIndex] !== '' ||
                move.piece[1] === 'p';
            const newBoardState = {
                ...movedState,
                fullMoves:
                    movedState.playerToMove === 'white'
                        ? movedState.fullMoves + 1
                        : movedState.fullMoves,
                plyWithoutPawnAdvanceOrCapture: isCaptureOrPawnMove
                    ? 0
                    : state.boardState.plyWithoutPawnAdvanceOrCapture + 1,
            };

            const fenString = buildFenString(newBoardState);
            const history = [...state.gameState.history, fenString];
            const checkMate = isCheckMate(newBoardState, move.piece[0]);
            const staleMate = isStaleMate(newBoardState, move.piece[0]);
            const check = isCheck(newBoardState, move.piece[0]);
            let alg = mapMoveToAlgebraicNotation({ ...state }, move);
            if (checkMate) alg += '#';
            else if (check) alg += '+';

            return {
                ...state,
                boardState: { ...newBoardState, selectedPieceTileIndex: -1 },
                gameState: {
                    ...state.gameState,
                    fenString,
                    isCheck: check,
                    isCheckMate: checkMate,
                    isStaleMate: staleMate,
                    isGameOver:
                        checkMate || staleMate || state.gameState.isDrawClaimed,
                    history,
                    moveHistory: [...state.gameState.moveHistory, alg],
                    isThreefoldRepetitionDraw:
                        checkThreefoldRepetitionDraw(history),

                    isFiftyMoveRuleDraw:
                        parseInt(fenString.split(' ')[-2]) >= 50,
                },
            };
        }
        case 'selectPiece': {
            const legalMoves = getLegalMoves(state.boardState, payload as Move);
            return {
                ...state,
                gameState: state.gameState,
                boardState: {
                    ...state.boardState,
                    legalMoves: legalMoves,
                    selectedPieceTileIndex: (payload as Move).fromTileIndex,
                },
            };
        }
        case 'unselectPiece':
            return {
                ...state,
                gameState: state.gameState,
                boardState: {
                    ...state.boardState,
                    legalMoves: [],
                    selectedPieceTileIndex: -1,
                },
            };
        case 'clearTile': {
            const board = [...state.boardState.board];
            board[(payload as Move).fromTileIndex] = '';
            return {
                ...state,
                gameState: state.gameState,
                boardState: { ...state.boardState, board, legalMoves: [] },
            };
        }
        case 'setStateFromFenString': {
            const newBoardState = generateBoardStateFromFenString(
                (payload as FenString).fenString,
            );
            const history: string[] = [
                ...state.gameState.history,
                (payload as FenString).fenString,
            ];

            const checkMate = isCheckMate(
                newBoardState,
                newBoardState.playerToMove === 'white' ? 'b' : 'w',
            );
            const staleMate = isStaleMate(
                newBoardState,
                newBoardState.playerToMove === 'white' ? 'b' : 'w',
            );
            return {
                ...state,
                boardState: newBoardState,
                gameState: {
                    ...state.gameState,
                    fenString: (payload as FenString).fenString,
                    isCheck: isCheck(
                        newBoardState,
                        newBoardState.playerToMove === 'white' ? 'b' : 'w',
                    ),
                    isCheckMate: checkMate,
                    isStaleMate: staleMate,
                    isGameOver:
                        checkMate || staleMate || state.gameState.isDrawClaimed,
                    history,
                    moveHistory: [...state.gameState.moveHistory, 'todo'],
                    isThreefoldRepetitionDraw:
                        checkThreefoldRepetitionDraw(history),
                    isFiftyMoveRuleDraw:
                        parseInt(
                            (payload as FenString).fenString.split(' ')[-2],
                        ) >= 50,
                },
            };
        }
        case 'reset':
            return initialState;
        case 'claimDraw':
            return {
                ...state,
                boardState: state.boardState,
                gameState: {
                    ...state.gameState,
                    isDrawClaimed: true,
                    isGameOver: true,
                },
            };
        case 'forwardMove':
            return {
                ...state,
                rewindIndex:
                    state.rewindIndex === -1 ? -1 : state.rewindIndex + 1,
            };
        case 'rewindMove':
            return {
                ...state,
                rewindIndex:
                    state.rewindIndex <= -state.gameState.history.length
                        ? state.rewindIndex
                        : state.rewindIndex - 1,
            };
        default:
            return state;
    }
};

export const BoardContext = createContext<[State, Dispatch<Action>]>([
    initialState,
    () => null,
]);

export const useBoard = () => useContext(BoardContext);
