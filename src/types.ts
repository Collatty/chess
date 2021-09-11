export interface ITile {
  piece?: IPiece;
  rank: number;
  file: string;
  backgroundColor: string;
}

export interface IPiece {
  name: string;
  color: string;
}
