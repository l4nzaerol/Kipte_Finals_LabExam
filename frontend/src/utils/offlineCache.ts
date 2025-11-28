import localforage from 'localforage';
import type { Task } from '../store/types';

localforage.config({
  name: 'arenaFlow',
  storeName: 'tasks',
});

export const saveTasksOffline = async (tasks: Task[]) => {
  await localforage.setItem('tasks', tasks);
};

export const readTasksOffline = async (): Promise<Task[] | null> => {
  const data = await localforage.getItem<Task[]>('tasks');
  return data || null;
};

