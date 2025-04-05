import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CreateTodoModal } from './CreateTodoModal';
import { Todo } from './Todo';
import { Search, SortAsc, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { StopwatchModal } from './StopwatchModal';
import { todoApi } from '../utils/api';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  priority: number;
  deadline: string;
  created_at: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [stats, setStats] = useState({ total: 0, completed: 0, efficiency: 0 });
  const [isStopwatchOpen, setIsStopwatchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTodos() {
    try {
      setIsLoading(true);
      const data = await todoApi.getAll();
      const todosArray = Array.isArray(data) ? data : [];
      setTodos(todosArray);
      updateStats(todosArray);
    } catch (error) {
      toast.error('Failed to fetch todos');
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle individual todo updates
  const handleTodoUpdate = (updatedTodo?: any, deletedId?: string) => {
    if (deletedId) {
      // Handle deletion
      const updatedTodos = todos.filter(todo => todo.id !== deletedId);
      setTodos(updatedTodos);
      updateStats(updatedTodos);
      return;
    }
    
    if (updatedTodo) {
      // Handle update
      setTodos(currentTodos => {
        const updatedTodos = currentTodos.map(todo => 
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
        updateStats(updatedTodos);
        return updatedTodos;
      });
    } else {
      // Fallback to full refresh if needed
      fetchTodos();
    }
  };

  // Handle new todo creation
  const handleCreateTodo = (newTodo?: any) => {
    if (newTodo && newTodo.id) {
      console.log('Adding new todo to the list:', newTodo);
      // Ensure the todo has all required fields
      const formattedTodo: TodoItem = {
        id: newTodo.id,
        title: newTodo.title || '',
        description: newTodo.description || '',
        is_completed: newTodo.is_completed || false,
        priority: newTodo.priority || 5,
        deadline: newTodo.deadline || new Date().toISOString(),
        created_at: newTodo.created_at || new Date().toISOString()
      };
      
      setTodos(currentTodos => {
        const updatedTodos = [formattedTodo, ...currentTodos];
        updateStats(updatedTodos);
        return updatedTodos;
      });
    } else {
      // Fallback to full refresh if newTodo is missing or malformed
      console.log('Performing full refresh for todos');
      fetchTodos();
    }
  };

  // Calculate stats from todo list
  const updateStats = (todoList: TodoItem[]) => {
    const total = todoList.length;
    const completed = todoList.filter((todo: TodoItem) => todo.is_completed).length;
    const efficiency = total > 0 ? (completed / total) * 100 : 0;
    setStats({ total, completed, efficiency });
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }
    fetchTodos();
  }, [navigate]);

  const filteredAndSortedTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all'
        ? true
        : priorityFilter === 'high'
          ? todo.priority > 8
          : priorityFilter === 'medium'
            ? todo.priority >= 5 && todo.priority <= 8
            : todo.priority < 5;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b.priority - a.priority;
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const pieData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Remaining', value: stats.total - stats.completed }
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Todo Dashboard</h1>
          <div className="flex flex-row items-center gap-4 mt-4 md:mt-0">
            <CreateTodoModal updateTodos={handleCreateTodo} />
            <button
              onClick={() => setIsStopwatchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <Clock className="w-5 h-5" />
              <span className="hidden sm:inline">Stopwatch</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Efficiency</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.efficiency.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <div className="flex items-center gap-2">
            <SortAsc className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Sort by Creation Time</option>
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-2">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Loading todos...</p>
              </div>
            </div>
          ) : (
            <>
              {filteredAndSortedTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  description={todo.description}
                  is_completed={todo.is_completed}
                  priority={todo.priority}
                  deadline={todo.deadline}
                  updateTodos={handleTodoUpdate}
                />
              ))}
              {filteredAndSortedTodos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No todos found. Create a new one to get started!
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <StopwatchModal isOpen={isStopwatchOpen} onClose={() => setIsStopwatchOpen(false)} />
    </div>
  );
}