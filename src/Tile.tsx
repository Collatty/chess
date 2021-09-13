import React from 'react';
import { ITile } from './types';
import './style.css';
import BlackPawn from './pieces/BlackPawn';

const Tile = ({ piece, backgroundColor }: ITile) => {
  switch (piece) {
    case 'bp':
      return (
        <div className={`tile ${backgroundColor}`}>
          <BlackPawn />
        </div>
      );
    default:
      return <div className={`tile ${backgroundColor}`}></div>;
  }
};

export default Tile;
