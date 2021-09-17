import React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

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

const pieceSwitch = (piece: string): JSX.Element => {
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
            throw Error('Invalid piece given!');
    }
};

const onDrop = (event: DraggableEvent, data: DraggableData) => {
    // console.log(event.target)
    // console.log(data)
};

const test = () => {
    console.log('test');
    console.log();
    console.log();
};

const makeDraggable = (
    pieceSwitch: (piece: string) => JSX.Element,
    piece: string
) => (
    //<Draggable onStop={onDrop} bounds=".board">
    <div className="draggable-wrapper" draggable>
        {pieceSwitch(piece)}
    </div>
    //</Draggable>
);

const Tile = ({ piece, backgroundColor, file, rank }: ITile) => (
    <div
        className={`tile ${backgroundColor}`}
        onDragEnter={() => console.log('Im dragged over')}
        onDrop={() => console.log('drop me here')}
    >
        {piece && makeDraggable(pieceSwitch, piece)}
        <div>{rank}</div>
        <div>{file}</div>
    </div>
);

export default Tile;
