import dayjs from 'dayjs';
import type { Task } from '../store/types';

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void | Promise<void>;
  onDelete: (task: Task) => void | Promise<void>;
  onToggle: (task: Task) => void | Promise<void>;
};

const labels: Record<Task['category'], string> = {
  practice: 'Practice',
  match: 'Match',
  fitness: 'Fitness',
  equipment: 'Equipment',
};

const TaskList = ({ tasks, onEdit, onDelete, onToggle }: Props) => {
  if (!tasks.length) {
    return (
      <div className="task-empty-v2">
        <p>No tasks yet — add your first task.</p>
      </div>
    );
  }

  return (
    <div className="task-grid-v3">
      {tasks.map((task) => (
        <article key={task._id} className="task-card-v3">
          <div className="task-card-v3__top">
            <div className="task-badges-v3">
              <span className="task-category-badge-v3">{labels[task.category]}</span>
              <span className={`task-intensity-badge-v3 task-intensity-${task.intensity}`}>
                {task.intensity.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="task-card-v3__content">
            <h4 className="task-title-v3">{task.title}</h4>
            {task.description && (
              <p className="task-description-v3">{task.description}</p>
            )}
            {task.dueDate && (
              <div className="task-date-info-v3">
                <span className="task-date-icon">📅</span>
                <span className="task-date-text-v3">{dayjs(task.dueDate).format('MMM D, YYYY')}</span>
              </div>
            )}
          </div>

          <div className="task-card-v3__divider"></div>

          <div className="task-card-v3__actions">
            <button 
              className="task-btn-v3 task-btn-primary-v3" 
              onClick={() => onToggle(task)}
            >
              {task.completed ? 'Undo' : 'Done'}
            </button>
            <button 
              className="task-btn-v3 task-btn-secondary-v3" 
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button 
              className="task-btn-v3 task-btn-danger-v3" 
              onClick={() => onDelete(task)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default TaskList;
