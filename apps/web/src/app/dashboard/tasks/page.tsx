'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api, formatApiError } from '@/lib/api';
import { TaskStatus, TaskPriority, AgentType, AGENT_DEFINITIONS } from '@rebuildyourlife/shared';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedAgentType: AgentType | null;
}

const statusColors: Record<TaskStatus, 'default' | 'info' | 'success' | 'danger'> = {
  PENDING: 'default',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger'
};

const priorityColors: Record<TaskPriority, 'default' | 'info' | 'warning' | 'danger'> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger'
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    assignedAgentType: ''
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: Task[] }>('/task');
      const dataArray = res.data || (res as any).data || [];
      setTasks(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    try {
      await api.post('/task', {
        title: form.title,
        description: form.description,
        priority: form.priority,
        assignedAgentType: form.assignedAgentType || undefined,
      });
      setIsModalOpen(false);
      setForm({ title: '', description: '', priority: TaskPriority.MEDIUM, assignedAgentType: '' });
      loadTasks();
    } catch (err) {
      setServerError(formatApiError(err));
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      await api.patch(`/task/${id}`, { status: newStatus });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const renderTaskColumn = (status: TaskStatus, title: string) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <div className="flex-1 min-w-[300px] bg-surface/20 rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-textPrimary">{title}</h2>
          <span className="text-xs bg-white/10 text-textSecondary px-2 py-1 rounded-full">
            {columnTasks.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {columnTasks.map(task => (
            <Card key={task.id} variant="glass" className="p-4 cursor-grab active:cursor-grabbing hover:border-gold/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={priorityColors[task.priority]} size="sm">{task.priority}</Badge>
                {task.assignedAgentType && (
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded flex items-center gap-1">
                    {AGENT_DEFINITIONS.find(a => a.type === task.assignedAgentType)?.avatarEmoji}
                    {AGENT_DEFINITIONS.find(a => a.type === task.assignedAgentType)?.name}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-textPrimary mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-xs text-textSecondary line-clamp-2 mb-4">{task.description}</p>
              )}
              
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/5">
                {status !== TaskStatus.IN_PROGRESS && (
                  <button onClick={() => handleStatusChange(task.id, TaskStatus.IN_PROGRESS)} className="text-xs text-gold hover:underline">
                    Start
                  </button>
                )}
                {status !== TaskStatus.COMPLETED && (
                  <button onClick={() => handleStatusChange(task.id, TaskStatus.COMPLETED)} className="text-xs text-success hover:underline">
                    Klaar
                  </button>
                )}
              </div>
            </Card>
          ))}
          {columnTasks.length === 0 && (
            <div className="text-center py-6 text-sm text-textSecondary border border-dashed border-white/10 rounded-xl">
              Geen taken
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Taken</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Beheer je dagelijkse actiepunten.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Nieuwe Taak</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-textSecondary">Taken laden...</div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
          {renderTaskColumn(TaskStatus.PENDING, 'To Do')}
          {renderTaskColumn(TaskStatus.IN_PROGRESS, 'Bezig')}
          {renderTaskColumn(TaskStatus.COMPLETED, 'Voltooid')}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nieuwe Taak">
        {serverError && <p className="text-danger text-sm mb-4">{serverError}</p>}
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Titel"
            required
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="Wat moet er gebeuren?"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textPrimary">Beschrijving</label>
            <textarea
              className="w-full rounded-xl border border-white/[0.06] bg-surface/50 px-4 py-2.5 text-sm text-textPrimary focus:border-gold/50 focus:outline-none resize-none h-24"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-textPrimary">Prioriteit</label>
              <select
                className="w-full rounded-xl border border-white/[0.06] bg-surface/50 px-4 py-2.5 text-sm text-textPrimary focus:border-gold/50 focus:outline-none"
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value as TaskPriority})}
              >
                {Object.values(TaskPriority).map(p => (
                  <option key={p} value={p} className="bg-navy">{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-textPrimary">Toewijzen aan AI</label>
              <select
                className="w-full rounded-xl border border-white/[0.06] bg-surface/50 px-4 py-2.5 text-sm text-textPrimary focus:border-gold/50 focus:outline-none"
                value={form.assignedAgentType}
                onChange={e => setForm({...form, assignedAgentType: e.target.value})}
              >
                <option value="" className="bg-navy">Niemand</option>
                {AGENT_DEFINITIONS.map(a => (
                  <option key={a.type} value={a.type} className="bg-navy">{a.name} ({a.role})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Annuleren</Button>
            <Button type="submit">Opslaan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
