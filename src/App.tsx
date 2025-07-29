import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import FilterBar from './components/FilterBar';
import TaskStats from './components/TaskStats';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskManagerTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      category: taskData.category || 'general'
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setShowAddForm(false);
  };

  // Update existing task
  const updateTask = (taskId, updatedData) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...updatedData, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setEditingTask(null);
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
          : task
      )
    );
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'overdue') {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      if (task.completed || !task.dueDate || dueDate >= today) return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.category.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <Header 
          onAddTask={() => setShowAddForm(true)}
          taskCount={tasks.length}
        />

        {/* Task Statistics */}
        <TaskStats tasks={tasks} />

        {/* Filter and Search Bar */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Add Task Form Modal */}
        {(showAddForm || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <AddTaskForm
                onSubmit={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingTask(null);
                }}
                initialData={editingTask}
                isEditing={!!editingTask}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleTaskCompletion}
          onEdit={setEditingTask}
          onDelete={deleteTask}
          filter={filter}
          searchTerm={searchTerm}
        />

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm ? 'No matching tasks found' : 'No tasks yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Get started by adding your first task!'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Your First Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;