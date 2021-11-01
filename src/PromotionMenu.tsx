import React from 'react';
import BlackBishop from './pieces/BlackBishop';
import BlackKnight from './pieces/BlackKnight';
import BlackQueen from './pieces/BlackQueen';
import BlackRook from './pieces/BlackRook';
import WhiteBishop from './pieces/WhiteBishop';
import WhiteKnight from './pieces/WhiteKnight';
import WhiteQueen from './pieces/WhiteQueen';
import WhiteRook from './pieces/WhiteRook';

interface Props {
    color: string;
    selectedPiece: (piece: string) => void;
}

export const PromotionMenu = ({ color, selectedPiece }: Props) => (
    <div
        className={`promotion-menu__wrapper ${
            color === 'w' ? 'white' : 'black'
        }`}
    >
        <div className="menu-item" onClick={() => selectedPiece('r')}>
            {color === 'w' ? <WhiteRook /> : <BlackRook />}
        </div>
        <div className="menu-item" onClick={() => selectedPiece('kn')}>
            {color === 'w' ? <WhiteKnight /> : <BlackKnight />}
        </div>
        <div className="menu-item" onClick={() => selectedPiece('b')}>
            {color === 'w' ? <WhiteBishop /> : <BlackBishop />}
        </div>
        <div className="menu-item" onClick={() => selectedPiece('q')}>
            {color === 'w' ? <WhiteQueen /> : <BlackQueen />}
        </div>
    </div>
);
