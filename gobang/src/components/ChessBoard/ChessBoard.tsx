import { forwardRef, MouseEvent, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getSuggestPosition } from '../../ai';
import { TPiece, TPiecePosition } from '../../types/Piece';
import './ChessBoard.css';

const cellWidth = 40;

export interface IChessBoard {
  clear: () => void;
}

const ChessBoard = forwardRef((props, ref: Ref<IChessBoard>) => {
  const [pieces, setPieces] = useState<TPiecePosition[]>([]);
  const chessBoardRef = useRef<HTMLDivElement>(null);

  // 获取棋盘的左上角坐标
  const getChessBoardPosition = () => {
    if (chessBoardRef.current) {
      const { top, left } = chessBoardRef.current.getBoundingClientRect();
      return { top, left };
    }

    return { top: 0, left: 0 };
  };

  // 提供给parent的方法
  useImperativeHandle(ref, () => ({
    clear() {
      setPieces([]);
    },
  }));

  // 处理棋盘点击事件
  const handleChessBoardClick = (event: MouseEvent) => {
    const basePosition = getChessBoardPosition();
    const xIndex = Math.round((event.clientX - basePosition.left) / cellWidth);
    const yIndex = Math.round((event.clientY - basePosition.top) / cellWidth);
    const newPieces = [
      ...pieces,
      {
        x: xIndex,
        y: yIndex,
      },
    ];

    setPieces(newPieces);

    setTimeout(() => {
      const suggestPosition = getSuggestPosition(newPieces);
      setPieces([...newPieces, { x: suggestPosition.x, y: suggestPosition.y }]);
    }, 500);
  };

  return (
    <div className="chess-board" ref={chessBoardRef} onClick={(e) => handleChessBoardClick(e)}>
      <Lines />
      <Pieces pieces={pieces} />
    </div>
  );
});

function Lines() {
  // 五子棋横竖各15条线, 去掉周围边框, 内部横竖各13条线
  const verticalLines = [];
  const horizontalLines = [];
  for (let i = 0; i < 13; i++) {
    verticalLines.push(<Line direction="vertical" key={i} index={i}></Line>);
    horizontalLines.push(<Line direction="horizontal" key={i} index={i}></Line>);
  }

  return (
    <>
      {/* {LineNumbers()} */}
      {verticalLines}
      {horizontalLines}
    </>
  );
}

function LineNumbers() {
  const verticalLineNumbers = [];
  const horizontalLineNumbers = [];
  for (let i = 0; i < 15; i++) {
    verticalLineNumbers.push(
      <span className="absolute" key={`v${i}`} style={{ top: '-20px', left: i * 40 - 4 + 'px' }}>
        {i}{' '}
      </span>
    );
    horizontalLineNumbers.push(
      <span className="absolute" key={`h${i}`} style={{ left: '-20px', top: i * 40 - 10 + 'px' }}>
        {i}{' '}
      </span>
    );
  }

  return (
    <>
      {verticalLineNumbers}
      {horizontalLineNumbers}
    </>
  );
}

function Line({ direction, index }: { direction: 'vertical' | 'horizontal'; index: number }) {
  const left = direction === 'vertical' ? index * 40 + 40 : 0;
  const top = direction === 'horizontal' ? index * 40 + 40 : 0;
  return (
    <>
      <div className={`${direction}-line`} style={{ top: top + 'px', left: left + 'px' }}></div>
    </>
  );
}

function Pieces({ pieces }: { pieces: TPiecePosition[] }) {
  return (
    <>
      {pieces.map((piece, index) => (
        <Piece key={`x${piece.x}y${piece.y}`} x={piece.x} y={piece.y} type={index % 2 === 0 ? 'black' : 'white'} />
      ))}
    </>
  );
}

function Piece({ x = 0, y = 0, type = 'black' }: TPiece) {
  const pieceRadius = 36;
  const whitePieceClassName = 'absolute rounded-full shadow-md border border-gray-400 bg-white z-10 cursor-not-allowed';
  const blackPieceClassName = 'absolute rounded-full shadow-md border border-black bg-black z-10 cursor-not-allowed';

  return (
    <div
      className={type === 'black' ? blackPieceClassName : whitePieceClassName}
      style={{
        width: pieceRadius + 'px',
        height: pieceRadius + 'px',
        left: x * cellWidth - pieceRadius / 2 + 'px',
        top: y * cellWidth - pieceRadius / 2 + 'px',
      }}
    ></div>
  );
}

export default ChessBoard;
