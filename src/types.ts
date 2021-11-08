export interface TileProps {
    piece: string;
    backgroundColor: string;
    index: number;
    autoQueen: boolean;
    highlightLegalMoves: boolean;
}

export interface State {
    boardState: BoardState;
    gameState: GameState;
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
}

export interface GameState {
    fenString: string;
    isCheck: boolean;
    isCheckMate: boolean;
    isStaleMate: boolean;
}

export interface Move {
    piece: string;
    fromTileIndex: number;
    toTileIndex: number;
}

export interface Action {
    type:
        | 'move'
        | 'dragStart'
        | 'dragStop'
        | 'clearTile'
        | 'setStateFromFenString';
    payload: Move | FenString;
}

export interface FenString {
    fenString: string;
}

export interface DraggablePieceProps {
    piece: string;
    fromIndex: number;
}
