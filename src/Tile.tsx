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
    fromCell: string;
    clearPreviousTile: () => void;
}

const DraggablePiece = (piece: string, fromCell: string, index: number) => {
    const [state, dispatch] = useBoard();
    const [{ isDragging }, drag] = useDrag(
        {
            type: 'PIECE',
            item: { piece, fromCell },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        },
        [piece]
    );

    useEffect(() => {
        if (isDragging) {
            dispatch({
                type: 'dragStart',
                payload: { fromTile: fromCell, piece, toTile: '', index },
            });
        }
    }, [isDragging]);

    return (
        <div className="draggable-wrapper">
            <div style={{ opacity: isDragging ? 0.3 : 1 }} ref={drag}>
                {pieceSwitch(piece)}
            </div>
        </div>
    );
};

export const Tile = ({ piece, backgroundColor, file, rank, index }: ITile) => {
    const [state, dispatch] = useBoard();

    const [{ canDrop }, drop] = useDrop(
        () => ({
            accept: 'PIECE',
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: state.legalMoves.includes(index),
            }),
            drop: (item: DraggablePiece) => {
                item.fromCell !== file + rank
                    ? dispatch({
                          type: 'move',
                          payload: {
                              piece: item.piece,
                              fromTile: item.fromCell,
                              toTile: file + rank,
                              index: -1,
                          },
                      })
                    : dispatch({
                          type: 'dragStop',
                          payload: {
                              fromTile: '',
                              piece: '',
                              toTile: '',
                              index: -1,
                          },
                      });
            },
        }),
        [state]
    );

    return (
        <div className={`tile ${backgroundColor}`} ref={drop} role={'Tile'}>
            {DraggablePiece(piece, file + rank, index)}
            {canDrop && <div>Drop</div>}
            {index}
        </div>
    );
};
