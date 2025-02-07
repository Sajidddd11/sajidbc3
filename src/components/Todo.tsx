import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Trash2, AlertTriangle, Edit3, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface TodoProps {
  title: string;
  description: string;
  is_completed: boolean;
  priority: number;
  id: string;
  deadline: string;
  updateTodos: () => void;
}

export function Todo({ title, description, is_completed, priority, id, deadline, updateTodos }: TodoProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editPriority, setEditPriority] = useState(priority);
  const [editDeadline, setEditDeadline] = useState(deadline);

  useEffect(() => {
    if (!is_completed) {
      const timer = setInterval(() => {
        const distance = calculateTimeLeft(new Date(deadline));
        setTimeLeft(distance);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [deadline, is_completed]);

  useEffect(() => {
    setEditTitle(title);
    setEditDescription(description);
    setEditPriority(priority);
    setEditDeadline(deadline);
  }, [title, description, priority, deadline]);

  async function deleteClick() {
    try {
      const r = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/${id}`, {
        method: "DELETE"
      });
      const j = await r.json();
      toast.success(j.message);
      updateTodos();
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  }

  async function toggleComplete() {
    const newStatus = !is_completed;
    try {
      const r = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          is_completed: newStatus,
          priority,
          deadline
        })
      });
      const j = await r.json();
      if (r.ok) {
        toast.success("Todo status updated");
        updateTodos();
      } else {
        toast.error("Failed to update todo status");
      }
    } catch (error) {
      toast.error("Failed to update todo status");
    }
  }

  async function saveEdit() {
    try {
      const r = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          is_completed,
          priority: editPriority,
          deadline: editDeadline
        })
      });
      const j = await r.json();
      if (r.ok) {
        toast.success("Todo updated successfully");
        updateTodos();
        setIsEditing(false);
      } else {
        toast.error("Failed to update todo");
      }
    } catch (error) {
      toast.error("Failed to update todo");
    }
  }

  const calculatePriorityColor = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDifference = deadlineDate.getTime() - now.getTime();

    if (timeDifference < 0) {
      return 'bg-red-100'; // Past deadline
    } else if (timeDifference <= 2 * 24 * 60 * 60 * 1000) {
      return 'bg-red-100'; // Less than or equal to 2 days
    } else if (timeDifference <= 7 * 24 * 60 * 60 * 1000) {
      return 'bg-yellow-100'; // Less than or equal to 7 days
    } else {
      return 'bg-green-100'; // More than 7 days
    }
  };

  const calculateTimeLeft = (deadline: Date) => {
    const now = new Date();
    const timeDifference = deadline.getTime() - now.getTime();

    if (timeDifference < 0) {
      return 'Past deadline';
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const priorityColor = calculatePriorityColor(editDeadline);

  return (
    <div className={`p-2 m-2 rounded-lg border border-gray-200 shadow-sm ${priorityColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleComplete}
            className={`p-1 rounded-full ${is_completed ? 'text-green-500' : 'text-gray-400'}`}
          >
            <CheckCircle className="w-6 h-6" />
          </button>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-lg border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <span className={`text-lg ${is_completed ? 'line-through text-gray-500' : ''}`}>
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={deleteClick}
            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (isEditing) {
                saveEdit();
              } else {
                setIsEditing(true);
              }
            }}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="flex flex-col md:flex-row gap-2 mt-2">
            <input
              type="number"
              value={editPriority}
              onChange={(e) => setEditPriority(Number(e.target.value))}
              className="w-full md:w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="datetime-local"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-2">
          {!is_completed && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {timeLeft}
            </div>
          )}
          <div className="flex items-center text-sm">
            <AlertTriangle className={`w-4 h-4 mr-1 ${priority > 8 ? 'text-red-500' : 'text-yellow-500'}`} />
            Priority: {priority}
          </div>
        </div>
      )}
    </div>
  );
}