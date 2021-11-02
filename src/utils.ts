import { State } from './state/useBoardReducer';
import { RANKS, FILES } from './Board';

export const calculateTileOffset = (index: number) =>
    (index + ~~(index / 8)) % 2;

export const buildFenString = (state: State): string => {
    const {
        board,
        playerToMove,
        blackCastleLong,
        blackCastleShort,
        whiteCastleLong,
        whiteCastleShort,
        enPassantTileIndex,
    } = state;
    let fenString = '';
    board.reverse().forEach((piece, index) => {
        if (index !== 0 && index % 8 === 0) fenString += '/';
        fenString += piece;
    });
    fenString += ' ';
    playerToMove === 'white' ? (fenString += 'w') : (fenString += 'b');
    fenString += ' ';
    if (
        !(
            whiteCastleLong ||
            whiteCastleShort ||
            blackCastleLong ||
            blackCastleShort
        )
    ) {
        fenString += '-';
    } else {
        if (whiteCastleShort) fenString += 'K';
        if (whiteCastleLong) fenString += 'Q';
        if (blackCastleShort) fenString += 'k';
        if (blackCastleLong) fenString += 'q';
    }
    fenString += ' ';
    if (enPassantTileIndex > 0) {
        const file = FILES.at(~~(enPassantTileIndex / 8)) || 'a';
        const rank = (enPassantTileIndex % 8) + 1;
        fenString += file.toLowerCase() + rank;
    }
    fenString += ' ';
    fenString += '1 2'; //TODO

    return fenString;
};
