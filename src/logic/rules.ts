import { Payload } from '../state/useBoardReducer';

export const getLegalMoves = (
    payload: Payload,
    board: Record<string, JSX.Element>
): number[] => {
    console.log(payload.index);

    switch (payload.piece) {
        case 'wp':
            return getLegalMovesWhitePawn(payload.index);
        case 'wkn':
        case 'bkn':
            return getLegalMovesKnight(payload.index);
        case 'wk':
        case 'bk':
            return getLegalMovesKing(payload.index);
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

const getLegalMovesKnight = (index: number) => {
    const legalMoves: number[] = [];
    legalMoves.push(
        index + 15,
        index + 17,
        index + 6,
        index + 10,
        index - 6,
        index - 10,
        index - 15,
        index - 17
    );

    return legalMoves;
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
