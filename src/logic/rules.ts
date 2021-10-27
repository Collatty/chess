import { calculateTileOffset } from './../utils';
import { Payload } from '../state/useBoardReducer';

export const getLegalMoves = (payload: Payload, board: string[]): number[] => {
    console.log(payload.fromTileIndex);
    const { piece, fromTileIndex } = payload;
    switch (payload.piece) {
        case 'wp':
            return getLegalMovesWhitePawn(fromTileIndex);
        case 'bp':
            return getLegalMovesBlackPawn(fromTileIndex);
        case 'wkn':
        case 'bkn':
            return getLegalMovesKnight(fromTileIndex, board, piece);
        case 'wk':
        case 'bk':
            return getLegalMovesKing(fromTileIndex, board, piece);
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

const getLegalMovesWhitePawn = (currentTileIndex: number) => {
    const legalMoves = [];
    if (7 < currentTileIndex && currentTileIndex <= 15) {
        legalMoves.push(currentTileIndex + 8, currentTileIndex + 16);
    } else {
        legalMoves.push(currentTileIndex + 8);
    }
    return legalMoves;
};

const getLegalMovesBlackPawn = (currentTileIndex: number) => {
    const legalMoves = [];
    if (48 <= currentTileIndex && currentTileIndex <= 55) {
        legalMoves.push(currentTileIndex - 8, currentTileIndex - 16);
    } else {
        legalMoves.push(currentTileIndex + -8);
    }
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

    return legalMoves.filter(
        (targetTileIndex) =>
            !isOccupiedByFriendlyPiece(targetTileIndex, board, piece) &&
            calculateTileOffset(targetTileIndex) !==
                calculateTileOffset(currentTileIndex)
    );
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
    board: string[],
    piece: string
) => {
    const legalMoves = [
        currentTileIndex - 7,
        currentTileIndex - 8,
        currentTileIndex - 9,
        currentTileIndex - 1,
        currentTileIndex + 1,
        currentTileIndex + 7,
        currentTileIndex + 8,
        currentTileIndex + 9,
    ];

    return legalMoves.filter(
        (targetTileIndex) =>
            !isOccupiedByFriendlyPiece(targetTileIndex, board, piece)
    );
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
            Math.abs((targetIndex % 8) - ((targetIndex - offset) % 8)) === 1 &&
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
            }
            legalMoves.push(targetIndex);
            targetIndex += offset;
        }
    });
    return legalMoves;
};

const isSameRank = (targetIndex: number, currentIndex: number) =>
    ~~(targetIndex / 8) === ~~(currentIndex / 8);

const isOccupiedByFriendlyPiece = (
    targetTileIndex: number,
    board: string[],
    piece: string
) => (board[targetTileIndex] ? board[targetTileIndex][0] === piece[0] : false);

const isOccupied = (targetIndex: number, board: string[]) => {
    return !!board[targetIndex];
};
