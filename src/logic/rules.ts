import { calculateTileOffset } from './../utils';
import { Payload } from '../state/useBoardReducer';

export const getLegalMoves = (payload: Payload, board: string[]): number[] => {
    console.log(payload.fromTileIndex);
    const { piece, fromTileIndex } = payload;
    switch (payload.piece) {
        case 'wp':
            return getLegalMovesWhitePawn(fromTileIndex);
        case 'wkn':
        case 'bkn':
            return getLegalMovesKnight(fromTileIndex, board, piece);
        case 'wk':
        case 'bk':
            return getLegalMovesKing(fromTileIndex);
    }
    return [];
};

const getLegalMovesWhitePawn = (index: number) => {
    const legalMoves = [];
    if (7 < index && index <= 15) {
        legalMoves.push(index + 8, index + 16);
    } else {
        legalMoves.push(index + 8);
    }
    return legalMoves;
};

const getLegalMovesKnight = (index: number, board: string[], piece: string) => {
    const legalMoves = [
        index + 15,
        index + 17,
        index + 6,
        index + 10,
        index - 6,
        index - 10,
        index - 15,
        index - 17,
    ];

    return legalMoves.filter((move) => {
        const pieceAtIndex = board[move];
        if (pieceAtIndex)
            return (
                !(pieceAtIndex[0] === piece[0]) &&
                calculateTileOffset(move) !== calculateTileOffset(index)
            );
        return calculateTileOffset(move) !== calculateTileOffset(index);
    });
};

const getLegalMovesKing = (index: number) => {
    const legalMoves = [];
    legalMoves.push(
        index - 7,
        index - 8,
        index - 9,
        index - 1,
        index + 1,
        index + 7,
        index + 8,
        index + 9
    );
    return legalMoves;
};
