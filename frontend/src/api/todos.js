import api from './client';

export const fetchTodos = async (params = {}) => {
  const res = await api.get('/todos', { params });
  return res.data;
};

export const fetchStats = async () => {
  const res = await api.get('/todos/stats');
  return res.data;
};

export const createTodo = async (data) => {
  const res = await api.post('/todos', data);
  return res.data;
};

export const updateTodo = async ({ id, ...data }) => {
  const res = await api.put(`/todos/${id}`, data);
  return res.data;
};

export const toggleTodo = async (id) => {
  const res = await api.patch(`/todos/${id}/toggle`);
  return res.data;
};

export const deleteTodo = async (id) => {
  const res = await api.delete(`/todos/${id}`);
  return res.data;
};
