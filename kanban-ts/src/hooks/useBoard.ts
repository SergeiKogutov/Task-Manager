// src/hooks/useBoard.ts

import { useState, useEffect } from 'react';
import type { Board, Column, Task, TaskFormData } from '../types';

const INITIAL_BOARD: Board = [
  { id: 'col-1', title: '📋 To Do', tasks: [] },
  { id: 'col-2', title: '🔄 In Progress', tasks: [] },
  { id: 'col-3', title: '✅ Done', tasks: [] },
];

const STORAGE_KEY = 'kanban-board';

export const useBoard = () => {
  const [board, setBoard] = useState<Board>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Восстанавливаем даты
        return parsed.map((col: Column) => ({
          ...col,
          tasks: col.tasks.map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          })),
        }));
      } catch {
        return INITIAL_BOARD;
      }
    }
    return INITIAL_BOARD;
  });

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  }, [board]);

  const addTask = (columnId: string, taskData: TaskFormData): void => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskData,
      createdAt: new Date(),
    };

    setBoard((prevBoard) =>
      prevBoard.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );
  };

  const deleteTask = (columnId: string, taskId: string): void => {
    setBoard((prevBoard) =>
      prevBoard.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  };

  const editTask = (
    columnId: string,
    taskId: string,
    updatedTask: Partial<Task>
  ): void => {
    setBoard((prevBoard) =>
      prevBoard.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
              ),
            }
          : col
      )
    );
  };

  const moveTask = (
    sourceColumnId: string,
    destColumnId: string,
    taskId: string
  ): void => {
    if (sourceColumnId === destColumnId) return;

    setBoard((prevBoard) => {
      let taskToMove: Task | undefined;
      const newBoard = prevBoard.map((col) => {
        if (col.id === sourceColumnId) {
          const task = col.tasks.find((t) => t.id === taskId);
          if (task) {
            taskToMove = task;
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
        }
        return col;
      });

      if (!taskToMove) return prevBoard;

      return newBoard.map((col) =>
        col.id === destColumnId
          ? { ...col, tasks: [...col.tasks, taskToMove] }
          : col
      );
    });
  };

  const resetBoard = (): void => {
    setBoard(INITIAL_BOARD);
  };

  return {
    board,
    addTask,
    deleteTask,
    editTask,
    moveTask,
    resetBoard,
  };
};