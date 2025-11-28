import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import dayjs from 'dayjs';
import type { Task } from '../store/types';

type Props = {
  initialTask?: Task | null;
  onSubmit: (payload: Partial<Task>) => Promise<void>;
  onCancel?: () => void;
};

type TaskForm = {
  title: string;
  description: string;
  category: Task['category'];
  intensity: Task['intensity'];
  dueDate: string;
};

const defaultForm: TaskForm = {
  title: '',
  description: '',
  category: 'practice',
  intensity: 'medium',
  dueDate: '',
};

const TaskComposer = ({ initialTask = null, onSubmit, onCancel }: Props) => {
  const [form, setForm] = useState<TaskForm>({ ...defaultForm });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description || '',
        category: initialTask.category,
        intensity: initialTask.intensity,
        dueDate: initialTask.dueDate ? dayjs(initialTask.dueDate).format('YYYY-MM-DD') : '',
      });
    } else {
      setForm({ ...defaultForm });
    }
  }, [initialTask]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => {
      if (name === 'category') {
        return { ...prev, category: value as Task['category'] };
      }
      if (name === 'intensity') {
        return { ...prev, intensity: value as Task['intensity'] };
      }
      return { ...prev, [name]: value } as TaskForm;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      });
      if (!initialTask) {
        setForm({ ...defaultForm });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-composer-v4" onSubmit={handleSubmit}>
      <div className="composer-header-v4">
        <h3 className="composer-title-v4">{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
        {initialTask && (
          <button type="button" className="composer-cancel-v4" onClick={onCancel} aria-label="Cancel">
            ×
          </button>
        )}
      </div>
      
      <div className="composer-body-v4">
        <div className="composer-group-v4">
          <div className="composer-field-v4">
            <label className="composer-label-v4">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              className="composer-input-v4"
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
          </div>

          <div className="composer-field-v4">
            <label className="composer-label-v4">Description</label>
            <textarea
              className="composer-textarea-v4"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Add notes or details (optional)"
            />
          </div>
        </div>

        <div className="composer-details-v4">
          <div className="composer-details-header-v4">
            <h4 className="composer-details-title-v4">Task Details</h4>
          </div>
          <div className="composer-details-grid-v4">
            <div className="composer-field-v4">
              <label className="composer-label-v4">Category</label>
              <select className="composer-select-v4" name="category" value={form.category} onChange={handleChange}>
                <option value="practice">Practice</option>
                <option value="match">Match</option>
                <option value="fitness">Fitness</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div className="composer-field-v4">
              <label className="composer-label-v4">Intensity</label>
              <select className="composer-select-v4" name="intensity" value={form.intensity} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="composer-field-v4">
              <label className="composer-label-v4">Due Date</label>
              <input
                className="composer-input-v4"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="composer-footer-v4">
        <button className="composer-submit-v4" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : initialTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskComposer;

