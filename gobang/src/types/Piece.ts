export type TPiecePosition = {
  x: number;
  y: number;
};

export type TPieceType = 'black' | 'white';

export type TPiece = TPiecePosition & {
  type: TPieceType;
};
