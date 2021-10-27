export const calculateTileOffset = (index: number) =>
    (index + ~~(index / 8)) % 2;
