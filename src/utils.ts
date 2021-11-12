import { BoardState, State } from './types';
const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const getBackgroundColor = (index: number) =>
    calculateTileOffset(index) === 0 ? 'white' : 'black';

export const calculateTileOffset = (index: number) =>
    (index + ~~(index / 8)) % 2;

export const buildFenString = (boardState: BoardState): string => {
    const {
        playerToMove,
        blackCastleLong,
        blackCastleShort,
        whiteCastleLong,
        whiteCastleShort,
        enPassantTileIndex,
    } = boardState;
    const board = [...boardState.board];
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
    if (counter) fenString += counter;
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
        const file = FILES[7 - (enPassantTileIndex % 8)] || '';
        const rank = ~~(enPassantTileIndex / 8) + 1;
        fenString += file.toLowerCase() + rank;
    } else {
        fenString += '-';
    }
    fenString += ' ';
    fenString += '1 2'; //TODO

    return fenString;
};

export const generateBoardStateFromFenString = (
    fenString: string,
): BoardState => {
    const [
        boardString,
        playerToMove,
        castling,
        enPassant,
        halfMoves,
        fullMoves,
    ] = fenString.split(' ');
    const board: string[] = [...boardString]
        .filter((char) => char !== '/')
        .flatMap((char) => {
            if (parseInt(char)) {
                return Array(parseInt(char)).fill('');
            }
            return fromFenStringToPieceMapper(char);
        })
        .reverse();

    return {
        board,
        playerToMove: playerToMove === 'w' ? 'white' : 'black',
        enPassantTileIndex: enPassant === '-' ? -1 : mapTileToIndex(enPassant),
        blackCastleLong: castling.includes('q'),
        blackCastleShort: castling.includes('k'),
        whiteCastleLong: castling.includes('Q'),
        whiteCastleShort: castling.includes('K'),
        plyWithoutPawnAdvanceOrCapture: parseInt(halfMoves),
        fullMoves: parseInt(fullMoves),
        legalMoves: [],
        selectedPieceTileIndex: -1,
    };
};

const fromFenStringToPieceMapper = (fenPiece: string) => {
    switch (fenPiece) {
        case 'p':
            return 'bp';
        case 'P':
            return 'wp';
        case 'r':
            return 'br';
        case 'R':
            return 'wr';
        case 'n':
            return 'bkn';
        case 'N':
            return 'wkn';
        case 'b':
            return 'bb';
        case 'B':
            return 'wb';
        case 'q':
            return 'bq';
        case 'Q':
            return 'wq';
        case 'k':
            return 'bk';
        case 'K':
            return 'wk';
    }
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

const mapTileToIndex = (tile: string): number =>
    7 - FILES.indexOf(tile[0].toUpperCase()) + (parseInt(tile[1]) - 1) * 8;

export const isGameOver = (state: State) =>
    state.gameState.isCheckMate ||
    state.gameState.isStaleMate ||
    state.gameState.isDrawClaimed;
