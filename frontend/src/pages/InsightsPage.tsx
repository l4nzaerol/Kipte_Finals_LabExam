import { useEffect } from 'react';
import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import useTaskStore from '../store/useTaskStore';

const InsightsPage = () => {
  const { tasks, fetchTasks, hydrateFromCache } = useTaskStore();

  useEffect(() => {
    hydrateFromCache();
    fetchTasks().catch(() => undefined);
  }, [fetchTasks, hydrateFromCache]);

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const intensityMap = tasks.reduce(
    (acc, task) => {
      acc[task.intensity] += 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const nextThree = tasks
    .filter((task) => !task.completed && task.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  return (
    <PageShell>
      <div className="stats-grid">
        <StatCard label="Total rituals" value={`${total}`} sublabel={`${active} active / ${completed} done`} />
        <StatCard label="Completion rate" value={`${completionRate}%`} sublabel="Realtime across roster" />
        <StatCard label="High intensity" value={`${intensityMap.high}`} sublabel="Needs recovery planning" />
        <StatCard label="Medium intensity" value={`${intensityMap.medium}`} sublabel="Balanced pace" />
      </div>
      <section className="card-panel">
        <h3 style={{ marginTop: 0 }}>Upcoming focus</h3>
        <div className="info-grid">
          {nextThree.length ? (
            nextThree.map((task) => (
              <article key={task._id} className="mini-card">
                <span className="task-chip">{task.category}</span>
                <h4 style={{ margin: '0.4rem 0' }}>{task.title}</h4>
                <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{task.description}</p>
                <p style={{ marginTop: '0.8rem', fontWeight: 600 }}>{new Date(task.dueDate!).toLocaleDateString()}</p>
              </article>
            ))
          ) : (
            <p>No upcoming items scheduled.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default InsightsPage;

