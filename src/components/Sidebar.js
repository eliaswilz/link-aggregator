// src/components/Sidebar.js
import React, { useState } from 'react';
import Login from './Login';
import { logout } from './Auth';

function Sidebar({
  categories,
  selectedCategories,
  setSelectedCategories,
  addCategory,
  deleteCategory,
  categoryColorMap,
  changeCategoryColor,
  availableColors,
  onAdminStatusChange,
  isAdmin
}) {
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLoginSuccess = () => {
    onAdminStatusChange(true);
    setIsLoginFormVisible(false);
  };

  const handleLogout = () => {
    logout();
    onAdminStatusChange(false);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      addCategory(newCategory);
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="w-64 bg-white h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <a href="/">
          <img src="/Logo.png" alt="Reds Logo" className="h-8 w-auto" />
        </a>
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#1a1c1a]">Categories</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#1a1c1a] focus:outline-none"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedCategories([])}
              className={`w-full text-left py-2 px-3 border ${
                selectedCategories.length === 0
                  ? 'bg-[#1a1c1a] text-white border-[#1a1c1a]'
                  : 'bg-white text-[#1a1c1a] border-gray-300 hover:bg-gray-100'
              }`}
            >
              All ({categories.length})
            </button>
          </li>
          {categories.map(category => (
            <li key={category} className="flex items-center">
              <button
                onClick={() => toggleCategory(category)}
                className={`flex-grow text-left py-2 px-3 border transition-colors duration-200 ${
                  selectedCategories.includes(category)
                    ? 'text-white border-[#1a1c1a]'
                    : 'bg-white text-[#1a1c1a] border-gray-300 hover:bg-opacity-10'
                }`}
                style={{
                  backgroundColor: selectedCategories.includes(category) ? categoryColorMap[category] : 'white',
                  '--hover-color': categoryColorMap[category],
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
              {isExpanded && isAdmin && (
                <>
                  <select
                    value={categoryColorMap[category]}
                    onChange={(e) => changeCategoryColor(category, e.target.value)}
                    className="ml-2 p-1 border border-gray-300 rounded"
                    style={{ backgroundColor: categoryColorMap[category], color: '#ffffff' }}
                  >
                    {Object.entries(availableColors).map(([name, hex]) => (
                      <option key={hex} value={hex} style={{ backgroundColor: hex, color: '#000000' }}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="ml-2 px-2 py-1 text-[#1a1c1a] hover:bg-red-50 border border-[#1a1c1a]"
                    aria-label={`Delete ${category} category`}
                  >
                    ×
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        {isAdmin && (
          <div className="mt-4">
            {isAddingCategory ? (
              <form onSubmit={handleAddCategory} className="relative">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  className="w-full py-2 px-3 pr-8 border border-gray-300 focus:outline-none focus:border-[#1a1c1a] text-[#1a1c1a]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#1a1c1a]"
                >
                  +
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingCategory(true)}
                className="w-full py-2 px-3 text-[#1a1c1a] border border-[#1a1c1a] hover:bg-gray-100 text-left"
              >
                + Add new category
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-auto p-4">
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        ) : isLoginFormVisible ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <button
            onClick={() => setIsLoginFormVisible(true)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
