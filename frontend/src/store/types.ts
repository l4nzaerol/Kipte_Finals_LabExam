export interface User {
  id: string;
  name: string;
  email: string;
  provider?: 'local' | 'google';
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: 'practice' | 'match' | 'fitness' | 'equipment';
  intensity: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

