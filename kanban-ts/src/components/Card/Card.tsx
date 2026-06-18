// src/components/Card/Card.tsx

// src/components/Card/Card.tsx
import React from 'react';
import { priorityMap, type Task } from '../../types';
import styles from './Card.module.css';


interface CardProps {
  task: Task;
  columnId: string;
  onDelete: () => void;
  onEdit: () => void;
  onDragStart: (taskId: string) => void;
}

export const Card: React.FC<CardProps> = ({
  task,
  columnId,
  onDelete,
  onEdit,
  onDragStart,
}) => {
  const priorityInfo = priorityMap[task.priority];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData('text/plain', task.id);
    onDragStart(task.id);
  };

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (window.confirm(`Удалить задачу "${task.title}"?`)) {
      onDelete();
    }
  };

  return (
    <div
      className={styles.card}
      draggable
      onDragStart={handleDragStart}
      onClick={onEdit}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{task.title}</h3>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          type="button"
          aria-label="Удалить задачу"
        >
          🗑️
        </button>
      </div>

      {task.description && (
        <p className={styles.cardDescription}>
          {task.description}
        </p>
      )}

      <div className={styles.cardFooter}>
        <span
          className={styles.priorityBadge}
          style={{ backgroundColor: priorityInfo.color }}
        >
          {priorityInfo.label}
        </span>
        <span className={styles.createdAt}>
          {new Date(task.createdAt).toLocaleDateString('ru-RU')}
        </span>
      </div>
    </div>
  );
};