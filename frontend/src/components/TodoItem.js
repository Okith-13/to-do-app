import React from 'react';
import { format, isPast, isToday } from 'date-fns';
import styles from './TodoItem.module.css';

const PRIORITY_LABEL = { high: '🔴', medium: '🟡', low: '🔵' };

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const isOverdue = todo.dueDate && !todo.completed && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate));
  const isDueToday = todo.dueDate && isToday(new Date(todo.dueDate));

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <button
        className={`${styles.check} ${todo.completed ? styles.checked : ''}`}
        onClick={onToggle}
        aria-label="Toggle complete"
      >
        {todo.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className={styles.content} onClick={onEdit}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{todo.title}</span>
          <span className={styles.priority}>{PRIORITY_LABEL[todo.priority]}</span>
        </div>

        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}

        <div className={styles.meta}>
          {todo.dueDate && (
            <span className={`${styles.due} ${isOverdue ? styles.overdue : ''} ${isDueToday ? styles.today : ''}`}>
              {isOverdue ? '⚠ ' : isDueToday ? '📅 ' : ''}
              {format(new Date(todo.dueDate), 'MMM d, yyyy')}
            </span>
          )}
          {todo.tags?.map((tag) => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={onEdit} aria-label="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className={styles.deleteBtn} onClick={onDelete} aria-label="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
