import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import BlackBishop from './pieces/BlackBishop';
import BlackKing from './pieces/BlackKing';
import BlackKnight from './pieces/BlackKnight';
import BlackPawn from './pieces/BlackPawn';
import BlackQueen from './pieces/BlackQueen';
import BlackRook from './pieces/BlackRook';
import WhiteBishop from './pieces/WhiteBishop';
import WhiteKing from './pieces/WhiteKing';
import WhiteKnight from './pieces/WhiteKnight';
import WhitePawn from './pieces/WhitePawn';
import WhiteQueen from './pieces/WhiteQueen';
import WhiteRook from './pieces/WhiteRook';
import { useBoard } from './state/useBoardReducer';
import { DraggablePieceProps } from './types';

export const pieceSwitch = (piece?: string): JSX.Element => {
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

export const DraggablePiece = ({ piece, fromIndex }: DraggablePieceProps) => {
    const [_, dispatch] = useBoard();
    const [{ isDragging }, drag] = useDrag(
        {
            type: 'PIECE',
            item: { piece, fromIndex },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        },
        [piece]
    );

    useEffect(() => {
        isDragging
            ? dispatch({
                  type: 'dragStart',
                  payload: {
                      piece,
                      toTileIndex: -1,
                      fromTileIndex: fromIndex,
                  },
              })
            : dispatch({
                  type: 'dragStop',
                  payload: {
                      piece: '',
                      fromTileIndex: -1,
                      toTileIndex: -1,
                  },
              });
    }, [isDragging]);

    return (
        <div className="draggable-wrapper">
            <div style={{ opacity: isDragging ? 0.3 : 1 }} ref={drag}>
                {pieceSwitch(piece)}
            </div>
        </div>
    );
};
