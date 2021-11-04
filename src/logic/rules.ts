import { calculateTileOffset } from './../utils';
import { makeMove } from '../state/useBoardReducer';
import { Move, State } from '../types';

export const getLegalMoves = (state: State, payload: Move): number[] => {
    if (!(state.playerToMove[0] === payload.piece[0])) return [];
    const allPossibleMovesForPiece = calculateAllMovesForPiece(state, payload);

    return allPossibleMovesForPiece.filter((toTileIndex) => {
        const resultingState = makeMove(state, {
            ...payload,
            toTileIndex,
        });
        const allPossibleMovesInResultingState =
            calculateAllMovesInNewStateForPlayer(
                resultingState,
                resultingState.playerToMove[0]
            );

        if (
            payload.piece[1] === 'k' &&
            isSameRank(toTileIndex, payload.fromTileIndex) &&
            Math.abs(toTileIndex - payload.fromTileIndex) === 2
        )
            return (
                !allPossibleMovesInResultingState.includes(
                    resultingState.board.indexOf(payload.piece[0] + 'k')
                ) &&
                !allPossibleMovesInResultingState.includes(
                    (toTileIndex + payload.fromTileIndex) / 2
                ) &&
                !allPossibleMovesInResultingState.includes(
                    state.board.indexOf(payload.piece[0] + 'k')
                )
            );
        return !allPossibleMovesInResultingState.includes(
            resultingState.board.indexOf(payload.piece[0] + 'k')
        );
    });
};

const calculateAllLegalMovesInStateForPlayer = (state: State, player: string) =>
    state.board.flatMap((piece, index) =>
        getLegalMoves(state, { piece, fromTileIndex: index, toTileIndex: -1 })
    );

export const calculateAllMovesInNewStateForPlayer = (
    newState: State,
    player: string
) =>
    newState.board.flatMap((piece, index) =>
        player === piece[0]
            ? calculateAllMovesForPiece(newState, {
                  piece,
                  fromTileIndex: index,
                  toTileIndex: -1,
              })
            : []
    );

export const isCheck = (newState: State, playerWhoMoved: string) =>
    calculateAllMovesInNewStateForPlayer(newState, playerWhoMoved).includes(
        newState.board.indexOf(newState.playerToMove[0] + 'k')
    );

export const isCheckMate = (newState: State, playerWhoMoved: string) => {
    const legalMoves = calculateAllLegalMovesInStateForPlayer(
        newState,
        playerWhoMoved
    );
    return isCheck(newState, playerWhoMoved) && legalMoves.length === 0;
};

export const isStaleMate = (newState: State, playerWhoMoved: string) => {
    const legalMoves = calculateAllLegalMovesInStateForPlayer(
        newState,
        playerWhoMoved
    );
    return !isCheck(newState, playerWhoMoved) && legalMoves.length === 0;
};

const calculateAllMovesForPiece = (state: State, payload: Move) => {
    const { board, enPassantTileIndex } = state;
    const { piece, fromTileIndex } = payload;
    switch (piece) {
        case 'wp':
            return getLegalMovesWhitePawn(
                fromTileIndex,
                board,
                piece,
                enPassantTileIndex
            );
        case 'bp':
            return getLegalMovesBlackPawn(
                fromTileIndex,
                board,
                piece,
                enPassantTileIndex
            );
        case 'wkn':
        case 'bkn':
            return getLegalMovesKnight(fromTileIndex, board, piece);
        case 'wk':
        case 'bk':
            return getLegalMovesKing(fromTileIndex, state, piece);
        case 'wb':
        case 'bb':
            return getLegalMovesBishop(fromTileIndex, board, piece);
        case 'wr':
        case 'br':
            return getLegalMovesRook(fromTileIndex, board, piece);
        case 'wq':
        case 'bq':
            return getLegalMovesQueen(fromTileIndex, board, piece);
        default:
            return [];
    }
};

const getLegalMovesWhitePawn = (
    currentTileIndex: number,
    board: string[],
    piece: string,
    enPassantTileIndex: number
) => {
    const legalMoves = [];
    if (!isOccupied(currentTileIndex + 8, board)) {
        legalMoves.push(currentTileIndex + 8);
        if (
            7 < currentTileIndex &&
            currentTileIndex <= 15 &&
            !isOccupied(currentTileIndex + 16, board)
        ) {
            legalMoves.push(currentTileIndex + 16);
        }
    }

    const offsets = [7, 9];
    offsets.forEach((offset) => {
        const targetTileIndex = currentTileIndex + offset;
        if (
            isDiagonal(targetTileIndex, currentTileIndex) &&
            ((isOccupied(targetTileIndex, board) &&
                !isOccupiedByFriendlyPiece(targetTileIndex, board, piece)) ||
                targetTileIndex === enPassantTileIndex)
        )
            legalMoves.push(targetTileIndex);
    });
    return legalMoves;
};

const getLegalMovesBlackPawn = (
    currentTileIndex: number,
    board: string[],
    piece: string,
    enPassantTileIndex: number
) => {
    const legalMoves: number[] = [];
    if (!isOccupied(currentTileIndex - 8, board)) {
        legalMoves.push(currentTileIndex - 8);
        if (
            48 <= currentTileIndex &&
            currentTileIndex <= 55 &&
            !isOccupied(currentTileIndex - 16, board)
        ) {
            legalMoves.push(currentTileIndex - 16);
        }
    }

    const offsets = [-7, -9];
    offsets.forEach((offset) => {
        const targetTileIndex = currentTileIndex + offset;
        if (
            isDiagonal(targetTileIndex, currentTileIndex) &&
            ((isOccupied(targetTileIndex, board) &&
                !isOccupiedByFriendlyPiece(targetTileIndex, board, piece)) ||
                targetTileIndex === enPassantTileIndex)
        )
            legalMoves.push(targetTileIndex);
    });
    return legalMoves;
};

const getLegalMovesKnight = (
    currentTileIndex: number,
    board: string[],
    piece: string
) => {
    const legalMoves = [
        currentTileIndex + 15,
        currentTileIndex + 17,
        currentTileIndex + 6,
        currentTileIndex + 10,
        currentTileIndex - 6,
        currentTileIndex - 10,
        currentTileIndex - 15,
        currentTileIndex - 17,
    ];

    return legalMoves
        .filter(
            (targetTileIndex) =>
                !isOccupiedByFriendlyPiece(targetTileIndex, board, piece) &&
                calculateTileOffset(targetTileIndex) !==
                    calculateTileOffset(currentTileIndex)
        )
        .filter((index) => index > 0 && index < 63);
};

const getLegalMovesQueen = (
    currentTileIndex: number,
    board: string[],
    piece: string
) => [
    ...traverseDiagonals(currentTileIndex, board, piece),
    ...traverseLines(currentTileIndex, board, piece),
];

const getLegalMovesKing = (
    currentTileIndex: number,
    state: State,
    piece: string
) => {
    const legalMoves = [currentTileIndex - 8, currentTileIndex + 8];

    if (isSameRank(currentTileIndex + 1, currentTileIndex))
        legalMoves.push(currentTileIndex + 1);
    if (isSameRank(currentTileIndex - 1, currentTileIndex))
        legalMoves.push(currentTileIndex - 1);
    if (isDiagonal(currentTileIndex + 7, currentTileIndex))
        legalMoves.push(currentTileIndex + 7);
    if (isDiagonal(currentTileIndex - 7, currentTileIndex))
        legalMoves.push(currentTileIndex - 7);
    if (isDiagonal(currentTileIndex + 9, currentTileIndex))
        legalMoves.push(currentTileIndex + 9);
    if (isDiagonal(currentTileIndex - 9, currentTileIndex))
        legalMoves.push(currentTileIndex - 9);

    legalMoves.push(...getCastlingMoves(currentTileIndex, piece, state));

    return legalMoves
        .filter(
            (targetTileIndex) =>
                !isOccupiedByFriendlyPiece(targetTileIndex, state.board, piece)
        )
        .filter((index) => index > 0 && index < 63);
};

const getCastlingMoves = (
    currentTileIndex: number,
    piece: string,
    state: State
): number[] => {
    if (currentTileIndex === 3 && piece === 'wk')
        return getCastlingMovesWhite(state);
    if (currentTileIndex === 59 && piece === 'bk')
        return getCastlingMovesBlack(state);
    return [];
};

const getCastlingMovesWhite = ({
    board,
    whiteCastleLong,
    whiteCastleShort,
}: State) => {
    const legalMoves = [];
    if (whiteCastleShort && !isOccupied(1, board) && !isOccupied(2, board))
        legalMoves.push(1);
    if (
        whiteCastleLong &&
        !isOccupied(4, board) &&
        !isOccupied(5, board) &&
        !isOccupied(6, board)
    )
        legalMoves.push(5);
    return legalMoves;
};

const getCastlingMovesBlack = ({
    board,
    blackCastleLong,
    blackCastleShort,
}: State) => {
    const legalMoves = [];
    if (blackCastleShort && !isOccupied(57, board) && !isOccupied(58, board))
        legalMoves.push(57);
    if (
        blackCastleLong &&
        !isOccupied(60, board) &&
        !isOccupied(61, board) &&
        !isOccupied(62, board)
    )
        legalMoves.push(61);
    return legalMoves;
};

const getLegalMovesBishop = (
    currentTileIndex: number,
    board: string[],
    piece: string
): number[] => traverseDiagonals(currentTileIndex, board, piece);

const getLegalMovesRook = (
    currentTileIndex: number,
    board: string[],
    piece: string
): number[] => traverseLines(currentTileIndex, board, piece);

const traverseDiagonals = (
    currentIndex: number,
    board: string[],
    piece: string
) => {
    const legalMoves: number[] = [];
    const offsets = [7, 9, -7, -9];
    offsets.forEach((offset) => {
        let targetIndex = currentIndex + offset;
        while (
            isDiagonal(targetIndex, targetIndex - offset) &&
            0 <= targetIndex &&
            targetIndex <= 63
        ) {
            if (isOccupied(targetIndex, board)) {
                if (isOccupiedByFriendlyPiece(targetIndex, board, piece)) break;
                legalMoves.push(targetIndex);
                break;
            }
            legalMoves.push(targetIndex);
            targetIndex += offset;
        }
    });
    return legalMoves;
};

const traverseLines = (
    currentIndex: number,
    board: string[],
    piece: string
) => {
    const legalMoves: number[] = [];
    const offsetsFile = [8, -8];
    const offsetsRank = [1, -1];
    offsetsFile.forEach((offset) => {
        let targetIndex = currentIndex + offset;
        while (0 <= targetIndex && targetIndex <= 63) {
            if (isOccupied(targetIndex, board)) {
                if (isOccupiedByFriendlyPiece(targetIndex, board, piece)) break;
                legalMoves.push(targetIndex);
                break;
            }
            legalMoves.push(targetIndex);
            targetIndex += offset;
        }
    });
    offsetsRank.forEach((offset) => {
        let targetIndex = currentIndex + offset;
        while (
            0 <= targetIndex &&
            targetIndex <= 63 &&
            isSameRank(targetIndex, targetIndex - offset)
        ) {
            if (isOccupied(targetIndex, board)) {
                if (isOccupiedByFriendlyPiece(targetIndex, board, piece)) break;
                legalMoves.push(targetIndex);
                break;
            }
            legalMoves.push(targetIndex);
            targetIndex += offset;
        }
    });
    return legalMoves;
};

const isSameRank = (targetIndex: number, currentIndex: number) =>
    ~~(targetIndex / 8) === ~~(currentIndex / 8);

const isDiagonal = (targetIndex: number, currentIndex: number) =>
    Math.abs((targetIndex % 8) - (currentIndex % 8)) === 1;

const isOccupiedByFriendlyPiece = (
    targetTileIndex: number,
    board: string[],
    piece: string
) => (board[targetTileIndex] ? board[targetTileIndex][0] === piece[0] : false);

const isOccupied = (targetIndex: number, board: string[]) => {
    return !!board[targetIndex];
};

export const getEnPassantTileIndex = ({
    piece,
    fromTileIndex,
    toTileIndex,
}: Move) => {
    return piece[1] === 'p' && Math.abs(fromTileIndex - toTileIndex) === 16
        ? piece[0] === 'w'
            ? fromTileIndex + 8
            : fromTileIndex - 8
        : -1;
};
