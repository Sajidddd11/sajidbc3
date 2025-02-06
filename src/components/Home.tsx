import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, List, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { Stopwatch } from './Stopwatch';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Manage Your Tasks with Ease
              </h1>
              <p className="text-lg mb-8 text-blue-100">
                Stay organized, track deadlines, and boost your productivity with our powerful todo application.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <Stopwatch />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">
              Create, update, and organize your tasks with ease. Mark them as complete when you're done.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Deadline Tracking</h3>
            <p className="text-gray-600">
              Set deadlines for your tasks and track remaining time with our built-in countdown feature.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <List className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Priority Levels</h3>
            <p className="text-gray-600">
              Assign priority levels to your tasks and sort them based on importance.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Track Your Progress</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Total Tasks</h3>
              <p className="text-gray-600">
                Track the total number of tasks you have created and completed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Task Completion Efficiency</h3>
              <p className="text-gray-600">
                View your task completion efficiency with detailed statistics.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Progress Analysis</h3>
              <p className="text-gray-600">
                Analyze your progress with visual charts and graphs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}