import { create } from 'zustand';
import dayjs from 'dayjs';
import client from '../api/client';
import type { Task } from './types';
import { saveTasksOffline, readTasksOffline } from '../utils/offlineCache';

type State = {
  tasks: Task[];
  loading: boolean;
  filter: 'all' | 'practice' | 'match' | 'fitness' | 'equipment';
  fetchTasks: () => Promise<void>;
  hydrateFromCache: () => Promise<void>;
  createTask: (payload: Partial<Task>) => Promise<void>;
  updateTask: (id: string, payload: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string, completed: boolean) => Promise<void>;
  setFilter: (filter: State['filter']) => void;
  setTasksFromSocket: (payload: { type: string; task?: Task; taskId?: string }) => void;
};

const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  loading: false,
  filter: 'all',
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data } = await client.get('/api/tasks');
      const sorted = data.tasks.sort(
        (a: Task, b: Task) =>
          dayjs(b.createdAt || b.dueDate || 0).valueOf() - dayjs(a.createdAt || a.dueDate || 0).valueOf()
      );
      set({ tasks: sorted, loading: false });
      saveTasksOffline(sorted);
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  hydrateFromCache: async () => {
    const cached = await readTasksOffline();
    if (cached) {
      set({ tasks: cached });
    }
  },
  createTask: async (payload) => {
    const { data } = await client.post('/api/tasks', payload);
    const tasks = [data.task, ...get().tasks];
    set({ tasks });
    saveTasksOffline(tasks);
  },
  updateTask: async (id, payload) => {
    const { data } = await client.put(`/api/tasks/${id}`, payload);
    const tasks = get().tasks.map((task) => (task._id === id ? data.task : task));
    set({ tasks });
    saveTasksOffline(tasks);
  },
  deleteTask: async (id) => {
    await client.delete(`/api/tasks/${id}`);
    const tasks = get().tasks.filter((task) => task._id !== id);
    set({ tasks });
    saveTasksOffline(tasks);
  },
  toggleComplete: async (id, completed) => {
    const { data } = await client.put(`/api/tasks/${id}`, { completed });
    const tasks = get().tasks.map((task) => (task._id === id ? data.task : task));
    set({ tasks });
    saveTasksOffline(tasks);
  },
  setFilter: (filter) => set({ filter }),
  setTasksFromSocket: (payload) => {
    const { type, task, taskId } = payload;
    let tasks = get().tasks;
    if (type === 'created' && task) {
      const exists = tasks.some((t) => t._id === task._id);
      tasks = exists ? tasks.map((t) => (t._id === task._id ? task : t)) : [task, ...tasks];
    } else if (type === 'updated' && task) {
      tasks = tasks.map((t) => (t._id === task._id ? task : t));
    } else if (type === 'deleted' && taskId) {
      tasks = tasks.filter((t) => t._id !== taskId);
    }
    set({ tasks });
    saveTasksOffline(tasks);
  },
}));

export default useTaskStore;

