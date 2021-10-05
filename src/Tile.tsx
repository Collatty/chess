import React, { useState } from 'react';
import { useDrag, useDrop, DragPreviewImage } from 'react-dnd';

import { ITile } from './types';
import './style.css';
import BlackPawn from './pieces/BlackPawn';
import WhitePawn from './pieces/WhitePawn';
import BlackRook from './pieces/BlackRook';
import WhiteRook from './pieces/WhiteRook';
import BlackKnight from './pieces/BlackKnight';
import WhiteKnight from './pieces/WhiteKnight';
import BlackBishop from './pieces/BlackBishop';
import WhiteBishop from './pieces/WhiteBishop';
import BlackQueen from './pieces/BlackQueen';
import WhiteQueen from './pieces/WhiteQueen';
import BlackKing from './pieces/BlackKing';
import WhiteKing from './pieces/WhiteKing';

const pieceSwitch = (piece?: string): JSX.Element => {
    switch (piece) {
        case 'wp':
            return <WhitePawn />;
        case 'bp':
            return <BlackPawn />;
        case 'br':
            return <BlackRook />;
        case 'wr':
            return <WhiteRook />;
        case 'bkn':
            return <BlackKnight />;
        case 'wkn':
            return <WhiteKnight />;
        case 'bb':
            return <BlackBishop />;
        case 'wb':
            return <WhiteBishop />;
        case 'bq':
            return <BlackQueen />;
        case 'wq':
            return <WhiteQueen />;
        case 'bk':
            return <BlackKing />;
        case 'wk':
            return <WhiteKing />;
        default:
            return <></>;
    }
};

export interface DraggablePiece {
    piece: string;
    fromCell: string;
    clearPreviousTile: () => void;
}

const DraggablePiece = (
    piece: string,
    fromCell: string,
    clearPreviousTile: () => void
) => {
    const [{ isDragging }, drag] = useDrag(
        {
            type: 'PIECE',
            item: { piece, fromCell, clearPreviousTile },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        },
        [piece, clearPreviousTile]
    );

    return (
        <div className="draggable-wrapper">
            <div style={{ opacity: isDragging ? 0.3 : 1 }} ref={drag}>
                {pieceSwitch(piece)}
            </div>
        </div>
    );
};

const Tile = ({ piece, backgroundColor, file, rank }: ITile) => {
    const [pieceOnTile, setPieceOnTile] = useState<string>(piece);
    const [{ canDrop }, drop] = useDrop({
        accept: 'PIECE',
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        drop: (item: DraggablePiece) => {
            item.clearPreviousTile();
            setPieceOnTile(item.piece);
        },
        canDrop: (item: DraggablePiece) => item.fromCell[0] === file,
    });

    return (
        <div className={`tile ${backgroundColor}`} ref={drop} role={'Tile'}>
            {DraggablePiece(pieceOnTile, file + rank, () => setPieceOnTile(''))}
            {/* <div>{rank}</div>
            <div>{file}</div> */}
            {canDrop && <div>Drop</div>}
        </div>
    );
};

export default Tile;
