export interface TileProps {
    piece: string;
    backgroundColor: string;
    index: number;
    autoQueen: boolean;
}

export interface State {
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
    fenString: string;
}

export interface Payload {
    piece: string;
    fromTileIndex: number;
    toTileIndex: number;
}

export interface Action {
    type: 'move' | 'dragStart' | 'dragStop' | 'clearTile';
    payload: Payload;
}

export interface DraggablePieceProps {
    piece: string;
    fromIndex: number;
}
