import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import styles from './TodoForm.module.css';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  tags: '',
};

export default function TodoForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'medium',
        dueDate: initial.dueDate ? format(new Date(initial.dueDate), 'yyyy-MM-dd') : '',
        tags: initial.tags?.join(', ') || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    });
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title…"
            className={styles.titleInput}
            required
            autoFocus
          />
          <select name="priority" value={form.priority} onChange={handleChange} className={styles.select}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🔵 Low</option>
          </select>
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)…"
          rows={2}
          className={styles.textarea}
        />

        <div className={styles.row}>
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags: work, personal…"
            className={styles.input}
          />
        </div>

        <div className={styles.btns}>
          <button type="button" className={styles.cancel} onClick={onCancel}>Cancel</button>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Saving…' : initial ? 'Update task' : 'Add task'}
          </button>
        </div>
      </form>
    </div>
  );
}
