// src/components/Board/Board.tsx

import React, { useState } from 'react';
import type { Column as ColumnType, Board as BoardType, Task, TaskFormData } from '../../types';
import { Column } from './Column';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardType;
  onAddTask: (columnId: string, taskData: TaskFormData) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onEditTask: (columnId: string, taskId: string, updatedTask: Partial<Task>) => void;
  onMoveTask: (sourceColumnId: string, destColumnId: string, taskId: string) => void;
  onResetBoard: () => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onMoveTask,
  onResetBoard,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Функция для фильтрации задач в колонке
  const filterTasks = (tasks: Task[]): Task[] => {
    return tasks.filter((task) => {
      // Фильтр по приоритету
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }
      
      // Поиск по заголовку (регистронезависимый)
      if (searchQuery.trim() !== '') {
        return task.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return true;
    });
  };

  const handleReset = (): void => {
    if (window.confirm('Вы уверены, что хотите сбросить доску? Все задачи будут удалены.')) {
      onResetBoard();
    }
  };

  return (
    <div className={styles.boardContainer}>
      {/* Заголовок и панель управления */}
      <div className={styles.header}>
        <h1 className={styles.title}>📋 Kanban Доска</h1>
        <button 
          className={styles.resetButton} 
          onClick={handleReset}
          type="button"
        >
          🔄 Сбросить доску
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Поиск по заголовку..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setSearchQuery(e.target.value)
          }
          className={styles.searchInput}
        />
        
        <select
          value={priorityFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            setPriorityFilter(e.target.value)
          }
          className={styles.priorityFilter}
        >
          <option value="all">Все приоритеты</option>
          <option value="low">🟢 Низкий</option>
          <option value="medium">🟠 Средний</option>
          <option value="high">🔴 Высокий</option>
        </select>
      </div>

      {/* Колонки */}
      <div className={styles.columnsContainer}>
        {board.map((column: ColumnType) => {
          const filteredTasks = filterTasks(column.tasks);
          
          return (
            <Column
              key={column.id}
              column={{
                ...column,
                tasks: filteredTasks, // Передаем отфильтрованные задачи
              }}
              onAddTask={onAddTask}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onMoveTask={onMoveTask}
            />
          );
        })}
      </div>

      {/* Информация о количестве задач */}
      <div className={styles.footer}>
        <span>
          Всего задач: {board.reduce((acc, col) => acc + col.tasks.length, 0)}
        </span>
        <span>
          {searchQuery || priorityFilter !== 'all' 
            ? '🔍 Фильтр активен' 
            : '📊 Все задачи'}
        </span>
      </div>
    </div>
  );
};