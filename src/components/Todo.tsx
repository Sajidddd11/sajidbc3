import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Trash2, AlertTriangle, Edit3, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { todoApi } from '../utils/api';

interface TodoProps {
  title: string;
  description: string;
  is_completed: boolean;
  priority: number;
  id: string;
  deadline: string;
  updateTodos: (updatedTodo?: any, deletedId?: string) => void;
}

export function Todo({ title, description, is_completed, priority, id, deadline, updateTodos }: TodoProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editPriority, setEditPriority] = useState(priority);
  const [editDeadline, setEditDeadline] = useState(deadline);
  const [localIsCompleted, setLocalIsCompleted] = useState(is_completed);
  
  // Use separate loading states for different operations
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    if (!localIsCompleted) {
      const timer = setInterval(() => {
        const distance = calculateTimeLeft(new Date(deadline));
        setTimeLeft(distance);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [deadline, localIsCompleted]);

  useEffect(() => {
    setEditTitle(title);
    setEditDescription(description);
    setEditPriority(priority);
    setEditDeadline(deadline);
    setLocalIsCompleted(is_completed);
  }, [title, description, priority, deadline, is_completed]);

  async function deleteClick() {
    try {
      setIsDeleteLoading(true);
      await todoApi.delete(id);
      toast.success('Todo deleted successfully');
      updateTodos(null, id); // Signal deletion to parent
    } catch (error) {
      toast.error("Failed to delete todo");
    } finally {
      setIsDeleteLoading(false);
    }
  }

  async function toggleComplete() {
    try {
      setIsToggleLoading(true);
      
      // Update local state immediately for responsive UI
      const newStatus = !localIsCompleted;
      setLocalIsCompleted(newStatus);
      
      // We need to explicitly pass the current values to ensure the
      // API gets the most up-to-date data
      const todoData = {
        title,
        description,
        is_completed: newStatus,
        priority,
        deadline
      };
      
      console.log('Toggling completion status:', todoData);
      const updatedTodo = await todoApi.update(id, todoData);
      
      console.log('Response from toggle update:', updatedTodo);
      toast.success("Todo status updated");
      
      // Update the parent component with the latest data
      if (updatedTodo && updatedTodo.id) {
        updateTodos(updatedTodo); 
      } else {
        console.error('Invalid response from update API:', updatedTodo);
        // Fall back to refreshing all todos if we don't get a proper response
        updateTodos();
      }
    } catch (error) {
      // Revert local state on error
      setLocalIsCompleted(!localIsCompleted);
      toast.error("Failed to update todo status");
      console.error('Error toggling completion:', error);
    } finally {
      setIsToggleLoading(false);
    }
  }

  async function saveEdit() {
    try {
      setIsEditLoading(true);
      
      const todoData = {
        title: editTitle,
        description: editDescription,
        is_completed: localIsCompleted,
        priority: editPriority,
        deadline: editDeadline
      };
      
      console.log('Saving edited todo:', todoData);
      const updatedTodo = await todoApi.update(id, todoData);
      
      console.log('Response from save edit:', updatedTodo);
      toast.success("Todo updated successfully");
      
      // Update the parent component with the latest data
      if (updatedTodo && updatedTodo.id) {
        updateTodos(updatedTodo);
      } else {
        console.error('Invalid response from update API:', updatedTodo);
        // Fall back to refreshing all todos if we don't get a proper response
        updateTodos();
      }
      
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update todo");
      console.error('Error saving todo edit:', error);
    } finally {
      setIsEditLoading(false);
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
            disabled={isToggleLoading || isDeleteLoading || isEditLoading}
            className={`p-1 rounded-full ${localIsCompleted ? 'text-green-500' : 'text-gray-400'} ${isToggleLoading ? 'opacity-50' : ''}`}
          >
            {isToggleLoading ? (
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
          </button>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-lg border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <span className={`text-lg ${localIsCompleted ? 'line-through text-gray-500' : ''}`}>
              {editTitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={deleteClick}
            disabled={isToggleLoading || isDeleteLoading || isEditLoading}
            className="p-1 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50"
          >
            {isDeleteLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => {
              if (isEditing) {
                saveEdit();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={isToggleLoading || isDeleteLoading || isEditLoading}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded-full disabled:opacity-50"
          >
            {isEditLoading && isEditing ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />
            )}
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
              min="1"
              max="10"
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
          {!localIsCompleted && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {timeLeft}
            </div>
          )}
          <div className="flex items-center text-sm">
            <AlertTriangle className={`w-4 h-4 mr-1 ${editPriority > 8 ? 'text-red-500' : 'text-yellow-500'}`} />
            Priority: {editPriority}
          </div>
        </div>
      )}
    </div>
  );
}