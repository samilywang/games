import { MouseEvent, useEffect, useRef, useState } from 'react';
import './ChessBoard.css';

type TPieceInfo = {
  type: 'black' | 'white';
  top: number;
  left: number;
};

function ChessBoard() {
  const [pieces, setPieces] = useState<TPieceInfo[]>([]);
  const [isBlack, setIsBlack] = useState(true);
  const chessBoardRef = useRef<HTMLDivElement>(null);
  const getChessBoardPosition = () => {
    if (chessBoardRef.current) {
      const { top, left } = chessBoardRef.current.getBoundingClientRect();
      return { top, left };
    }

    return { top: 0, left: 0 };
  };

  // 处理棋盘点击事件
  const handleChessBoardClick = (event: MouseEvent) => {
    const basePosition = getChessBoardPosition();
    const topIndex = Math.round((event.clientY - basePosition.top) / 40);
    const leftIndex = Math.round((event.clientX - basePosition.left) / 40);

    setPieces([
      ...pieces,
      {
        type: isBlack ? 'black' : 'white',
        top: topIndex * 40,
        left: leftIndex * 40,
      },
    ]);
    setIsBlack(!isBlack);
  };

  return (
    <div className="chess-board" ref={chessBoardRef} onClick={(e) => handleChessBoardClick(e)}>
      <Lines />
      <Pieces pieces={pieces} />
    </div>
  );
}

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
      {verticalLines}
      {horizontalLines}
    </>
  );
}

function Line({ direction, index }: { direction: 'vertical' | 'horizontal'; index: number }) {
  const left = direction === 'vertical' ? index * 40 + 40 : 0;
  const top = direction === 'horizontal' ? index * 40 + 40 : 0;
  return <div className={`${direction}-line`} style={{ top: top + 'px', left: left + 'px' }}></div>;
}

function Pieces({ pieces }: { pieces: TPieceInfo[] }) {
  return (
    <>
      {pieces.map((piece) => (
        <Piece key={`top${piece.top}left${piece.left}`} top={piece.top} left={piece.left} type={piece.type} />
      ))}
    </>
  );
}

function Piece({ top = 0, left = 0, type = 'black' }: TPieceInfo) {
  const pieceRadius = 36;
  const whitePieceClassName = 'absolute rounded-full shadow-md border border-gray-400 bg-white z-10 cursor-not-allowed';
  const blackPieceClassName = 'absolute rounded-full shadow-md border border-black bg-black z-10 cursor-not-allowed';

  return (
    <div
      className={type === 'black' ? blackPieceClassName : whitePieceClassName}
      style={{
        width: pieceRadius + 'px',
        height: pieceRadius + 'px',
        top: top - pieceRadius / 2 + 'px',
        left: left - pieceRadius / 2 + 'px',
      }}
    ></div>
  );
}

export default ChessBoard;
