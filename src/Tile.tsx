import React from 'react';
import { ITile } from './types';
import './style.css';

const Tile = ({ piece, backgroundColor }: ITile) => {
  return piece ? (
    <div className={`tile ${backgroundColor}`}>{piece}</div>
  ) : (
    <div className={`tile ${backgroundColor}`}></div>
  );
};

export default Tile;
