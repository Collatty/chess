import { getLegalMoves } from './logic/rules';
import { BoardState, Move, State } from './types';
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
        fenString += file + rank;
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
            return 'bn';
        case 'N':
            return 'wn';
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
        case 'wn':
            return 'N';
        case 'bn':
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
    7 - FILES.indexOf(tile[0]) + (parseInt(tile[1]) - 1) * 8;

export const isGameOver = (state: State) =>
    state.gameState.isCheckMate ||
    state.gameState.isStaleMate ||
    state.gameState.isDrawClaimed;

/**
 *
 * @param algMove - Expects a move based on algebraic notation as described in @link https://en.wikipedia.org/wiki/Algebraic_notation_(chess).
 *
 */
export const parseAlgebraicMove = (algMove: string) => {
    try {
        if (algMove.length < 2) throw new Error('Invalid move notation');
        const possibleMovingPieces = ['K', 'Q', 'N', 'B', 'R'];
        const shortCastle = ['0-0', 'O-O'];
        const longCastle = ['O-O-O', '0-0-0'];
        //strip en pessant notation
        let move = algMove.split(' ').shift() || '';
        let promotionPiece;
        let departingRank = null;
        let departingFile = null;
        let movingPiece = 'P';
        let castleLong = false;
        let castleShort = false;
        let targetTile = '';
        move = move.replace(/#|\+|\(|\)|=/g, '');

        if (longCastle.includes(move)) castleLong = true;
        else if (shortCastle.includes(move)) castleShort = true;
        else {
            const isPromotion = possibleMovingPieces.includes(move.slice(-1));

            if (isPromotion) {
                promotionPiece = move.slice(-1);
                move = move.slice(0, -1);
            }

            targetTile = move.slice(-2);
            move = move.slice(0, -2);
            move = move.replace('x', '');
            if (move.length > 0) {
                if (!isNaN(parseInt(move.slice(-1)))) {
                    departingRank = move.slice(-1);
                    move = move.slice(0, -1);
                }
                if (!possibleMovingPieces.includes(move.slice(-1))) {
                    departingFile = move.slice(-1);
                    move = move.slice(0, -1);
                }
                movingPiece = move || 'P';
            }
        }
        return {
            promotionPiece,
            departingFile,
            departingRank,
            movingPiece,
            targetTile,
            castleLong,
            castleShort,
        };
    } catch (error) {
        throw new Error('Something is fishy with the algebraic move parser');
    }
};

export const translateAlgebraicStringToMove = (
    state: State,
    algMove: string,
): Move => {
    const {
        promotionPiece,
        departingFile,
        departingRank,
        movingPiece,
        targetTile,
        castleLong,
        castleShort,
    } = parseAlgebraicMove(algMove);

    const { playerToMove } = state.boardState;

    if (castleLong) {
        return playerToMove[0] === 'w'
            ? { piece: 'wk', fromTileIndex: 3, toTileIndex: 5 }
            : { piece: 'bk', fromTileIndex: 59, toTileIndex: 61 };
    }
    if (castleShort) {
        return playerToMove[0] === 'w'
            ? { piece: 'wk', fromTileIndex: 3, toTileIndex: 1 }
            : { piece: 'bk', fromTileIndex: 59, toTileIndex: 57 };
    }

    let fromTileIndex = -1;
    state.boardState.board.forEach((piece, index) => {
        if (departingFile && departingFile !== mapIndexToTile(index)[0])
            return false;
        if (departingRank && departingRank !== mapIndexToTile(index)[1])
            return false;
        if (playerToMove[0] + movingPiece.toLowerCase() !== piece) return false;
        if (
            getLegalMoves(state.boardState, {
                piece,
                fromTileIndex: index,
                toTileIndex: -1,
            }).includes(mapTileToIndex(targetTile))
        )
            fromTileIndex = index;
    });

    return {
        piece: playerToMove[0] + movingPiece.toLowerCase(),
        fromTileIndex,
        toTileIndex: mapTileToIndex(targetTile),
        promotionPiece: promotionPiece
            ? playerToMove[0] + promotionPiece.toLowerCase()
            : '',
    };
};

const mapIndexToTile = (index: number) =>
    FILES[7 - (index % 8)] + (~~(index / 8) + 1);

export const mapMoveToAlgebraicNotation = (
    { boardState }: State,
    { fromTileIndex, toTileIndex, piece, promotionPiece }: Move,
): string => {
    let move = mapIndexToTile(toTileIndex);
    if (boardState.board[toTileIndex] !== '') move = 'x' + move;
    if (piece[1] === 'p' && toTileIndex === boardState.enPassantTileIndex)
        move = 'x' + move + ' e.p.';
    if (move.includes('x') && piece[1] === 'p')
        move = mapIndexToTile(fromTileIndex)[0] + move;
    if (piece[1] !== 'p') {
        const indiciesOfequalPiecesWithLegalMoveToSameTile: number[] =
            boardState.board.reduce<number[]>((prev, compPiece, index) => {
                if (
                    compPiece === piece &&
                    !(index === fromTileIndex) &&
                    getLegalMoves(
                        { ...boardState },
                        {
                            piece: compPiece,
                            fromTileIndex: index,
                            toTileIndex: -1,
                        },
                    ).includes(toTileIndex)
                )
                    return [...prev, index];
                return prev;
            }, []);
        if (indiciesOfequalPiecesWithLegalMoveToSameTile.length > 1)
            move = mapIndexToTile(fromTileIndex) + move;
        else if (indiciesOfequalPiecesWithLegalMoveToSameTile.length === 1) {
            if (
                indiciesOfequalPiecesWithLegalMoveToSameTile[0] % 8 ===
                fromTileIndex % 8
            )
                move = (fromTileIndex % 8) + move;
            else {
                move = mapIndexToTile(fromTileIndex)[0] + move;
            }
        }
        move = piece[1].toUpperCase() + move;
    } else {
        if (promotionPiece) move += promotionPiece[1].toUpperCase();
    }

    if (piece === 'wk' || piece === 'bk') {
        if (fromTileIndex - toTileIndex === 2) return '0-0';
        if (fromTileIndex - toTileIndex === -2) return '0-0-0';
    }

    return move;
};
