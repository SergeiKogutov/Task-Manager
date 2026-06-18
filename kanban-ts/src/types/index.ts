// src/types/index.ts

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export type Board = Column[];

export type TaskFormData = Omit<Task, 'id' | 'createdAt'>;

export const priorityMap = {
  low: { label: 'Низкий', color: '#4CAF50' },
  medium: { label: 'Средний', color: '#FF9800' },
  high: { label: 'Высокий', color: '#f44336' },
};