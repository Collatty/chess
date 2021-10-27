import React, { useEffect, useState } from 'react';
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
import { useBoard } from './state/useBoardReducer';

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
    fromIndex: number;
}

const DraggablePiece = (piece: string, fromIndex: number) => {
    const [state, dispatch] = useBoard();
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

export const Tile = ({ piece, backgroundColor, index }: ITile) => {
    const [state, dispatch] = useBoard();

    const [_, drop] = useDrop(
        () => ({
            accept: 'PIECE',
            drop: (item: DraggablePiece) => {
                dispatch({
                    type: 'move',
                    payload: {
                        piece: item.piece,
                        fromTileIndex: item.fromIndex,
                        toTileIndex: index,
                    },
                });
            },
            canDrop: () => state.legalMoves.includes(index),
        }),
        [state]
    );

    return (
        <div className={`tile ${backgroundColor}`} ref={drop} role={'Tile'}>
            {DraggablePiece(piece, index)}
            {state.legalMoves.includes(index) && <div>Drop</div>}
            {index}
        </div>
    );
};
