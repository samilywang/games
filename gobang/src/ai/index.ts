import { TPiecePosition } from '../types/Piece';

enum ChessBoardPositionState {
  none = 0,
  black = 1,
  white = 2,
}
enum LineDirection {
  row = 'row',
  column = 'column',
  slash45 = 'slash45',
  slash135 = 'slash135',
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

// 横线
const findInRow = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetType: ChessBoardPositionState
) => {
  const { x, y } = targetPosition;
  let count = 1;
  let nearX = Math.max(x - 1, 0);

  // 向左搜寻
  while (nearX >= 0 && chessBoard[nearX][y] === targetType) {
    count++;
    nearX--;
  }
  const leftDead = nearX >= 0 && chessBoard[nearX][y] === ChessBoardPositionState.none ? 0 : 1;

  // 向右搜寻
  nearX = Math.min(x + 1, 14);
  while (nearX <= 14 && chessBoard[nearX][y] === targetType) {
    count++;
    nearX++;
  }
  const rightDead = nearX <= 14 && chessBoard[nearX][y] === ChessBoardPositionState.none ? 0 : 1;

  return {
    count,
    deadSide: leftDead + rightDead,
  };
};

// 竖线
const findInColumn = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetType: ChessBoardPositionState
) => {
  const { x, y } = targetPosition;
  let count = 1;
  let nearY = Math.max(y - 1, 0);

  // 向上搜寻
  while (nearY >= 0 && chessBoard[x][nearY] === targetType) {
    count++;
    nearY--;
  }
  const leftDead = nearY >= 0 && chessBoard[x][nearY] === ChessBoardPositionState.none ? 0 : 1;

  // 向下搜寻
  nearY = Math.min(y + 1, 14);
  while (nearY <= 14 && chessBoard[x][nearY] === targetType) {
    count++;
    nearY++;
  }
  const rightDead = nearY <= 14 && chessBoard[x][nearY] === ChessBoardPositionState.none ? 0 : 1;

  return {
    count,
    deadSide: leftDead + rightDead,
  };
};

// 斜线1
const findInSlash45 = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetType: ChessBoardPositionState
) => {
  const { x, y } = targetPosition;
  let count = 1;
  let nearX = Math.min(x + 1, 14);
  let nearY = Math.max(y - 1, 0);

  // 向斜上搜寻
  while (nearX <= 14 && nearY >= 0 && chessBoard[nearX][nearY] === targetType) {
    count++;
    nearX++;
    nearY--;
  }
  const leftDead = nearX <= 14 && nearY >= 0 && chessBoard[nearX][nearY] === ChessBoardPositionState.none ? 0 : 1;

  // 向斜下搜寻
  nearX = Math.max(x - 1, 0);
  nearY = Math.min(y + 1, 14);
  while (nearX >= 0 && nearY <= 14 && chessBoard[nearX][nearY] === targetType) {
    count++;
    nearX--;
    nearY++;
  }
  const rightDead = nearX >= 0 && nearY <= 14 && chessBoard[nearX][nearY] === ChessBoardPositionState.none ? 0 : 1;

  return {
    count,
    deadSide: leftDead + rightDead,
  };
};

// 斜线2
const findInSlash135 = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetType: ChessBoardPositionState
) => {
  const { x, y } = targetPosition;
  let count = 1;
  let nearX = Math.max(x - 1, 0);
  let nearY = Math.max(y - 1, 0);

  // 向斜上搜寻
  while (nearX >= 0 && nearY >= 0 && chessBoard[nearX][nearY] === targetType) {
    count++;
    nearX--;
    nearY--;
  }
  const leftDead = nearX >= 0 && nearY >= 0 && chessBoard[nearX][nearY] === ChessBoardPositionState.none ? 0 : 1;

  // 向斜下搜寻
  nearX = Math.min(x + 1, 14);
  nearY = Math.min(y + 1, 14);
  while (nearX <= 14 && nearY <= 14 && chessBoard[nearX][nearY] === targetType) {
    count++;
    nearX++;
    nearY++;
  }
  const rightDead = nearX <= 14 && nearY <= 14 && chessBoard[nearX][nearY] === ChessBoardPositionState.none ? 0 : 1;

  return {
    count,
    deadSide: leftDead + rightDead,
  };
};

// 4个方向判断连珠数
const findInLine = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetType: ChessBoardPositionState,
  direction: LineDirection
) => {
  switch (direction) {
    case LineDirection.row:
      return findInRow(chessBoard, targetPosition, targetType);
    case LineDirection.column:
      return findInColumn(chessBoard, targetPosition, targetType);
    case LineDirection.slash45:
      return findInSlash45(chessBoard, targetPosition, targetType);
    case LineDirection.slash135:
    default:
      return findInSlash135(chessBoard, targetPosition, targetType);
  }
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

/**
 * 计算对应位置的分数
 */
const calPositionScore = (
  chessBoard: ChessBoardPositionState[][],
  targetPosition: TPiecePosition,
  targetPieceType: ChessBoardPositionState
): number => {
  let score = 0;

  const directions = [LineDirection.row, LineDirection.column, LineDirection.slash45, LineDirection.slash135];
  for (let direction of directions) {
    const blackLineResult = findInLine(chessBoard, targetPosition, ChessBoardPositionState.black, direction);
    const whiteRowResult = findInLine(chessBoard, targetPosition, ChessBoardPositionState.white, direction);

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
          maxScore = score;
          result = { x, y };
        }
      }
    }
  }

  return result;
};
