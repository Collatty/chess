export interface TileProps {
    piece: string;
    backgroundColor: string;
    index: number;
    autoQueen: boolean;
    highlightLegalMoves: boolean;
    primaryPlayer: 'white' | 'black';
}

export interface State {
    boardState: BoardState;
    gameState: GameState;
    rewindIndex: number;
}

export interface BoardState {
    playerToMove: 'white' | 'black';
    board: string[];
    legalMoves: number[];
    enPassantTileIndex: number;
    blackCastleShort: boolean;
    blackCastleLong: boolean;
    whiteCastleShort: boolean;
    whiteCastleLong: boolean;
    plyWithoutPawnAdvanceOrCapture: number;
    fullMoves: number;
    selectedPieceTileIndex: number;
}

export interface GameState {
    fenString: string;
    history: string[];
    moveHistory: string[];
    isCheck: boolean;
    isCheckMate: boolean;
    isStaleMate: boolean;
    isThreefoldRepetitionDraw: boolean;
    isFiftyMoveRuleDraw: boolean;
    isDrawClaimed: boolean;
    isGameOver: boolean;
}

export interface Move {
    piece: string;
    fromTileIndex: number;
    toTileIndex: number;
    promotionPiece?: string;
}

export interface Action {
    type:
        | 'move'
        | 'selectPiece'
        | 'unselectPiece'
        | 'clearTile'
        | 'setStateFromFenString'
        | 'reset'
        | 'claimDraw'
        | 'rewindMove'
        | 'forwardMove';
    payload: Move | FenString | AlgebraicMove | null;
}

export interface AlgebraicMove {
    algebraicMove: string;
}

export interface FenString {
    fenString: string;
}

export interface MovingPieceProps {
    piece: string;
    fromIndex: number;
}
