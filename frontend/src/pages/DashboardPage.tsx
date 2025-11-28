import { useEffect, useMemo, useState } from 'react';
import PageShell from '../components/PageShell';
import TaskComposer from '../components/TaskComposer';
import TaskList from '../components/TaskList';
import InstallBanner from '../components/InstallBanner';
import Modal from '../components/Modal';
import useTaskStore from '../store/useTaskStore';
import useAuthStore from '../store/useAuthStore';
import type { Task } from '../store/types';
import { initSocket } from '../utils/socket';

type Filter = 'all' | 'practice' | 'match' | 'fitness' | 'equipment';

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Practice', value: 'practice' },
  { label: 'Match', value: 'match' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Equipment', value: 'equipment' },
];

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const {
    tasks,
    fetchTasks,
    hydrateFromCache,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filter,
    setFilter,
    setTasksFromSocket,
  } = useTaskStore();

  useEffect(() => {
    hydrateFromCache();
    fetchTasks().catch(() => {
      // offline fallback uses cached records
    });
  }, [fetchTasks, hydrateFromCache]);

  useEffect(() => {
    const socket = initSocket();
    if (user) {
      socket.emit('join', user.id);
    }
    socket.on('tasks:update', setTasksFromSocket);
    return () => {
      socket.off('tasks:update', setTasksFromSocket);
    };
  }, [user, setTasksFromSocket]);

  const visibleTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.category === filter);
  }, [tasks, filter]);

  const active = visibleTasks.filter((task) => !task.completed);

  return (
    <PageShell>
      <InstallBanner />
      <section className="workspace-grid">
        <TaskComposer
          onSubmit={async (payload) => {
            await createTask(payload);
          }}
        />
        <div className="task-panel-v2">
          <div className="filter-section-v2">
            <div className="filter-group-v2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  className={`filter-chip-v2 ${filter === f.value ? 'active' : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="task-list-section-v2">
            <h3 className="task-list-title-v2">Active Tasks</h3>
            <TaskList
              tasks={active}
              onEdit={(task) => {
                setEditing(task);
                setShowEditModal(true);
              }}
              onDelete={(task) => {
                setDeleteTarget(task);
                setDeleteModalOpen(true);
              }}
              onToggle={(task) => toggleComplete(task._id, !task.completed)}
            />
          </div>
        </div>
      </section>
      {showEditModal && editing && (
        <Modal
          onClose={() => {
            setShowEditModal(false);
            setEditing(null);
          }}
        >
          <h2 style={{ marginTop: 0 }}>Edit Task</h2>
          <TaskComposer
            initialTask={editing}
            onSubmit={async (payload) => {
              await updateTask(editing._id, payload);
              setShowEditModal(false);
              setEditing(null);
            }}
            onCancel={() => {
              setShowEditModal(false);
              setEditing(null);
            }}
          />
        </Modal>
      )}
      {deleteModalOpen && deleteTarget && (
        <Modal
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
        >
          <h2 style={{ marginTop: 0 }}>Delete Task</h2>
          <p>Are you sure you want to delete “{deleteTarget.title}”?</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button
              className="ghost-btn"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteTarget(null);
              }}
            >
              Cancel
            </button>
            <button
              className="primary-btn"
              style={{ background: '#1a1a1a', boxShadow: '0 12px 22px rgba(0,0,0,0.25)' }}
              onClick={async () => {
                await deleteTask(deleteTarget._id);
                setDeleteModalOpen(false);
                setDeleteTarget(null);
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </PageShell>
  );
};

export default DashboardPage;

