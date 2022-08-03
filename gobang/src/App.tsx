import { Button } from 'antd';
import { useRef } from 'react';
import ChessBoard, { IChessBoard } from './components/ChessBoard/ChessBoard';

function App() {
  const chessBoardRef = useRef<IChessBoard>(null);

  // 重置棋盘
  const clear = () => {
    if (chessBoardRef.current) {
      chessBoardRef.current.clear();
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center mb-4">
        <Button type="default" onClick={clear}>
          重置
        </Button>
      </div>
      <div className="p-5 border border-slate-900 rounded">
        <ChessBoard ref={chessBoardRef}></ChessBoard>
      </div>
    </div>
  );
}

export default App;
