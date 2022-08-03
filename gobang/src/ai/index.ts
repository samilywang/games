import { TPiecePosition } from '../types/Piece';

enum ChessBoardPositionState {
  none = 0,
  black = 1,
  white = 2,
}
enum LineDirection {
  row = 'row',
  column = 'column',
  slash = 'slash',
}

const initChessBoard = (pieces: TPiecePosition[]) => {
  const chessBoard: ChessBoardPositionState[][] = [];

  for (let i = 0; i < 15; i++) {
    const row = [];
    for (let j = 0; j < 15; j++) {
      row.push(ChessBoardPositionState.none);
    }
    chessBoard.push(row);
  }

  pieces.forEach(
    (piece, index) =>
      (chessBoard[piece.x][piece.y] = index % 2 === 0 ? ChessBoardPositionState.black : ChessBoardPositionState.white)
  );

  return chessBoard;
};

const findInLine = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetType: ChessBoardPositionState,
  direction: LineDirection
) => {
  const { x, y } = targetPosition;
  let count = 1;
  let nearX: number;
  let nearY: number;

  // left/top
  switch (direction) {
    case LineDirection.row:
      nearX = Math.max(x - 1, 0);
      nearY = y;
      break;
    case LineDirection.column:
      nearX = x;
      nearY = Math.max(y - 1, 0);
      break;
    case LineDirection.slash:
      nearX = Math.max(x - 1, 0);
      nearY = Math.max(y - 1, 0);
      break;
  }
  while (chessBoard[nearX][nearY] === targetType && nearX > 0 && nearY > 0) {
    count++;
    switch (direction) {
      case 'row':
        nearX--;
        break;
      case 'column':
        nearY--;
        break;
      case 'slash':
        nearX--;
        nearY--;
        break;
    }
  }
  const leftDead = chessBoard[nearX][nearY] === ChessBoardPositionState.none ? 0 : 1;

  // right/bottom
  switch (direction) {
    case 'row':
      nearX = Math.min(x + 1, 14);
      nearY = y;
      break;
    case 'column':
      nearX = x;
      nearY = Math.min(y + 1, 14);
      break;
    case 'slash':
      nearX = Math.min(x + 1, 14);
      nearY = Math.min(y + 1, 14);
      break;
  }
  while (chessBoard[nearX][nearY] === targetType && nearX < 15 && nearY < 15) {
    count++;
    switch (direction) {
      case 'row':
        nearX++;
        break;
      case 'column':
        nearY++;
        break;
      case 'slash':
        nearX++;
        nearY++;
        break;
    }
  }
  const rightDead = chessBoard[nearX][nearY] === ChessBoardPositionState.none ? 0 : 1;

  return {
    count,
    deadSide: leftDead + rightDead,
  };
};

/**
 * 评分标准:
 * 成五: 10000
 * 活四: 1000
 * 冲四: 100
 * 活三: 100
 * 冲三: 10
 * 活二: 20
 * 冲二: 1
 */
const getLineScore = ({ count, deadSide }: { count: number; deadSide: number }) => {
  if (count === 5) {
    return 10000;
  }

  if (deadSide === 0) {
    switch (count) {
      case 4:
        return 1000;
      case 3:
        return 100;
      case 2:
        return 2;
      default:
        return 0;
    }
  } else if (deadSide === 1) {
    switch (count) {
      case 4:
        return 100;
      case 3:
        return 10;
      case 2:
        return 1;
      default:
        return 0;
    }
  }

  return 0;
};

const calPositionScore = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetPieceType: ChessBoardPositionState
): number => {
  let score = 0;

  const directions = [LineDirection.row, LineDirection.column, LineDirection.slash];
  for (let direction of directions) {
    const blackLineResult = findInLine(chessBoard, targetPosition, ChessBoardPositionState.black, direction);
    const whiteRowResult = findInLine(chessBoard, targetPosition, ChessBoardPositionState.white, direction);

    if (blackLineResult.count > 1) {
      console.log('black', targetPosition, blackLineResult, getLineScore(blackLineResult));
    }
    if (whiteRowResult.count > 1) {
      console.log('white', targetPosition, whiteRowResult, getLineScore(whiteRowResult));
    }

    score += getLineScore(blackLineResult);
    score += getLineScore(whiteRowResult);
  }

  return score;
};

export const getSuggestPosition = (pieces: TPiecePosition[]) => {
  const chessBoard = initChessBoard(pieces);
  const targetPieceType = pieces.length % 2 === 0 ? ChessBoardPositionState.black : ChessBoardPositionState.white;
  let maxScore = -1;
  let result = { x: 0, y: 0 };

  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 15; y++) {
      if (chessBoard[x][y] === ChessBoardPositionState.none) {
        const score = calPositionScore(chessBoard, { x, y }, targetPieceType);
        if (score > maxScore) {
          console.log(`score = ${score}, x = ${x}, y = ${y}`);
          maxScore = score;
          result = { x, y };
        }
      }
    }
  }

  return result;
};
