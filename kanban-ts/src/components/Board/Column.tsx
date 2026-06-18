// src/components/Board/Column.tsx

import React, { useState, useRef } from 'react';
import type { Column as ColumnType, Priority, Task, TaskFormData } from '../../types/index';
import { Card } from '../Card/Card';
import { Modal } from '../Modal/Modal';
import styles from './Board.module.css';

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string, taskData: TaskFormData) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onEditTask: (columnId: string, taskId: string, updatedTask: Partial<Task>) => void;
  onMoveTask: (sourceColumnId: string, destColumnId: string, taskId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onMoveTask,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const dragTaskIdRef = useRef<string | null>(null);
  const dragSourceColumnIdRef = useRef<string | null>(null);

  // Обработчики Drag-and-Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault(); // Разрешаем сброс
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = dragTaskIdRef.current;
    const sourceColumnId = dragSourceColumnIdRef.current;
    
    if (taskId && sourceColumnId && sourceColumnId !== column.id) {
      onMoveTask(sourceColumnId, column.id, taskId);
    }
    
    // Очищаем refs
    dragTaskIdRef.current = null;
    dragSourceColumnIdRef.current = null;
  };

  // Функция для добавления задачи
  const handleAddTask = (formData: TaskFormData): void => {
    onAddTask(column.id, formData);
    setIsModalOpen(false);
  };

  // Функция для редактирования задачи
  const handleEditTask = (updatedTask: Partial<Task>): void => {
    if (editingTask) {
      onEditTask(column.id, editingTask.id, updatedTask);
      setEditingTask(null);
    }
  };

  return (
    <div
      className={`${styles.column} ${isDragOver ? styles.columnDragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Заголовок колонки */}
      <div className={styles.columnHeader}>
        <h2 className={styles.columnTitle}>
          {column.title}
          <span className={styles.taskCount}>{column.tasks.length}</span>
        </h2>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          ➕ Добавить
        </button>
      </div>

      {/* Список задач */}
      <div className={styles.taskList}>
        {column.tasks.length === 0 ? (
          <p className={styles.emptyMessage}>Нет задач</p>
        ) : (
          column.tasks.map((task: Task) => (
            <Card
              key={task.id}
              task={task}
              columnId={column.id}
              onDelete={() => onDeleteTask(column.id, task.id)}
              onEdit={() => setEditingTask(task)}
              onDragStart={(taskId: string) => {
                dragTaskIdRef.current = taskId;
                dragSourceColumnIdRef.current = column.id;
              }}
            />
          ))
        )}
      </div>

      {/* Модалка для добавления задачи */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="➕ Добавить задачу"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Модалка для редактирования задачи */}
      {editingTask && (
        <Modal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          title="✏️ Редактировать задачу"
        >
          <TaskForm
            initialData={editingTask}
            onSubmit={handleEditTask}
            onCancel={() => setEditingTask(null)}
            isEditing
          />
        </Modal>
      )}
    </div>
  );
};

// Компонент формы для задачи
interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData = { title: '', description: '', priority: 'medium' },
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [title, setTitle] = useState<string>(initialData.title || '');
  const [description, setDescription] = useState<string>(initialData.description || '');
  const [priority, setPriority] = useState<Priority>((initialData.priority as Priority) || 'medium');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Заголовок обязателен');
      return;
    }
    
    if (title.length > 100) {
      setError('Заголовок не должен превышать 100 символов');
      return;
    }
    
    onSubmit({ title: title.trim(), description: description.trim() || undefined, priority });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="title">Заголовок *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Введите заголовок..."
          maxLength={100}
          className={styles.formInput}
        />
        <span className={styles.characterCount}>{title.length}/100</span>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            setDescription(e.target.value)
          }
          placeholder="Введите описание (необязательно)..."
          maxLength={500}
          rows={3}
          className={styles.formTextarea}
        />
        <span className={styles.characterCount}>{description.length}/500</span>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="priority">Приоритет</label>
        <select
          id="priority"
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            setPriority(e.target.value as Priority)
          }
          className={styles.formSelect}
        >
          <option value="low">🟢 Низкий</option>
          <option value="medium">🟠 Средний</option>
          <option value="high">🔴 Высокий</option>
        </select>
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Отмена
        </button>
        <button type="submit" className={styles.submitButton}>
          {isEditing ? '✅ Сохранить' : '➕ Добавить'}
        </button>
      </div>
    </form>
  );
};