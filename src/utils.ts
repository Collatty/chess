import { State } from './state/useBoardReducer';
import { RANKS, FILES } from './Board';

export const calculateTileOffset = (index: number) =>
    (index + ~~(index / 8)) % 2;

export const buildFenString = (state: State): string => {
    const {
        playerToMove,
        blackCastleLong,
        blackCastleShort,
        whiteCastleLong,
        whiteCastleShort,
        enPassantTileIndex,
    } = state;
    const board = [...state.board];
    let fenString = '';
    let counter = 0;
    board.reverse().forEach((piece, index) => {
        if (index !== 0 && index % 8 === 0) {
            if (counter > 0) {
                fenString += counter;
            }
            fenString += '/';
            counter = 0;
        }
        if (piece === '') {
            counter += 1;
        } else {
            counter
                ? (fenString += counter + fenStringPieceMapper(piece))
                : (fenString += fenStringPieceMapper(piece));
            counter = 0;
        }
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
        const file = FILES.at(7 - (enPassantTileIndex % 8)) || '';
        const rank = ~~(enPassantTileIndex / 8) + 1;
        fenString += file.toLowerCase() + rank;
    } else {
        fenString += '-';
    }
    fenString += ' ';
    fenString += '1 2'; //TODO

    return fenString;
};

const fenStringPieceMapper = (piece: string) => {
    switch (piece) {
        case 'wp':
            return 'P';
        case 'bp':
            return 'p';
        case 'wkn':
            return 'N';
        case 'bkn':
            return 'n';
        case 'wb':
            return 'B';
        case 'bb':
            return 'b';
        case 'wq':
            return 'Q';
        case 'bq':
            return 'q';
        case 'wk':
            return 'K';
        case 'bk':
            return 'k';
        case 'wr':
            return 'R';
        case 'br':
            return 'r';
        default:
            return '';
    }
};
