import { Payload } from '../state/useBoardReducer';
import { DraggablePiece } from '../Tile';

export const isLegalMove = (
    piece: DraggablePiece,
    file: string,
    rank: number
) => {
    console.log(piece);
    return true;
};

export const getLegalMoves = (
    payload: Payload,
    board: Record<string, JSX.Element>
): string[] => {
    switch (payload.piece) {
        case 'wp':
            return getLegalMovesWhitePawn(payload.fromTile);
    }
    return [];
};

const getLegalMovesWhitePawn = (fromTile: string) => {
    const legalMoves = [];
    console.log(fromTile);

    if (fromTile[1] === '2') {
        legalMoves.push(fromTile[0] + '3', fromTile[0] + '4');
    } else {
        legalMoves.push(fromTile[0] + (parseInt(fromTile[1]) + 1));
    }
    console.log(legalMoves);

    return legalMoves;
};
