export interface ITile {
  piece:
    | null
    | 'bp'
    | 'wp'
    | 'br'
    | 'wr'
    | 'bkn'
    | 'wkn'
    | 'bb'
    | 'wb'
    | 'bq'
    | 'wq'
    | 'bk'
    | 'wk';
  rank: number;
  file: string;
  backgroundColor: string;
}
