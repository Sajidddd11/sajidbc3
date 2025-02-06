import { useState } from 'react';
import { Plus, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateTodoModalProps {
  updateTodos: () => void;
}

export function CreateTodoModal({ updateTodos }: CreateTodoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('5');
  const [deadline, setDeadline] = useState('');

  async function createTodoClick() {
    try {
      if (!title.trim()) {
        toast.error('Please enter a title');
        return;
      }

      if (!deadline) {
        toast.error('Please select a deadline');
        return;
      }

      const username = localStorage.getItem('username');
      if (!username) {
        toast.error('Please log in first');
        return;
      }

      const body = {
        title: title.trim(),
        description: 'string',
        deadline: new Date(deadline).toISOString(),
        priority: parseInt(priority),
        username: username // Add username to the request
      };

      const r = await fetch('https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const j = await r.json();
      toast.success('Todo created');
      setTitle('');
      setPriority('5');
      setDeadline('');
      setIsOpen(false);
      updateTodos();
    } catch (error) {
      toast.error('Failed to create todo');
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-5 h-5" />
        Create Todo
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Todo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter todo title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Deadline
                  </div>
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Priority (1-10)
                  </div>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createTodoClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}