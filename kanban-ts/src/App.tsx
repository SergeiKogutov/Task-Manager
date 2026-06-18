// src/App.tsx

import React from 'react';
import { Board } from './components/Board/Board';
import { useBoard } from './hooks/useBoard';
import './App.css';

function App() {
  const { board, addTask, deleteTask, editTask, moveTask, resetBoard } = useBoard();

  return (
    <div className="App">
      <Board
        board={board}
        onAddTask={addTask}
        onDeleteTask={deleteTask}
        onEditTask={editTask}
        onMoveTask={moveTask}
        onResetBoard={resetBoard}
      />
    </div>
  );
}

export default App;