import React from 'react';

const Header = ({ onAddTask, taskCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">
            Organize your work and boost productivity
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-500">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'} total
            </span>
          </div>
        </div>
        <button
          onClick={onAddTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Task
        </button>
      </div>
    </div>
  );
};

export default Header;