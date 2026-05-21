import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchTodos, fetchStats, createTodo, toggleTodo, deleteTodo, updateTodo } from '../api/todos';
import { useAuth } from '../context/AuthContext';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import StatsBar from '../components/StatsBar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [priority, setPriority] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const params = {};
  if (filter === 'active') params.completed = false;
  if (filter === 'completed') params.completed = true;
  if (priority) params.priority = priority;

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos', params],
    queryFn: () => fetchTodos(params),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['todos'] });
    qc.invalidateQueries({ queryKey: ['stats'] });
  };

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => { invalidate(); setShowForm(false); toast.success('Task created!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: invalidate,
    onError: () => toast.error('Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => { invalidate(); toast.success('Task deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => { invalidate(); setEditingTodo(null); toast.success('Task updated!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>Taskr</div>
        <div className={styles.headerRight}>
          <span className={styles.greeting}>Hey, {user?.name?.split(' ')[0]} 👋</span>
          <button className={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className={styles.main}>
        <StatsBar stats={stats} />

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.toolbarRight}>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={styles.select}
            >
              <option value="">All priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>

            <button className={styles.addBtn} onClick={() => { setShowForm(true); setEditingTodo(null); }}>
              + New task
            </button>
          </div>
        </div>

        {(showForm || editingTodo) && (
          <TodoForm
            initial={editingTodo}
            onSubmit={(data) =>
              editingTodo
                ? updateMutation.mutate({ id: editingTodo._id, ...data })
                : createMutation.mutate(data)
            }
            onCancel={() => { setShowForm(false); setEditingTodo(null); }}
            loading={createMutation.isPending || updateMutation.isPending}
          />
        )}

        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.empty}>Loading tasks…</div>
          ) : todos.length === 0 ? (
            <div className={styles.empty}>
              <span>No tasks here.</span>
              <button className={styles.emptyBtn} onClick={() => setShowForm(true)}>Create your first task →</button>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={() => toggleMutation.mutate(todo._id)}
                onDelete={() => deleteMutation.mutate(todo._id)}
                onEdit={() => { setEditingTodo(todo); setShowForm(false); }}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
