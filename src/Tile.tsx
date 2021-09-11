import React from 'react';
import { ITile } from './types';
import './style.css';

const Tile = ({ piece, backgroundColor }: ITile) => {
  return piece ? (
    <div className={backgroundColor}>{piece} test</div>
  ) : (
    <div className={backgroundColor}>test</div>
  );
};

export default Tile;
