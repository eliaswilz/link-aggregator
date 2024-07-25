import React, { useState } from 'react';

function LinkForm({ addLink, categories }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || selectedCategories.length === 0) {
      setShowError(true);
      return;
    }

    addLink({
      url,
      title: title || url,
      categories: selectedCategories,
    });

    setUrl('');
    setTitle('');
    setSelectedCategories([]);
    setShowError(false);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="mb-8 bg-white border border-gray-200 p-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title (optional)"
        className="w-full p-2 mb-4 border-b border-gray-300 focus:outline-none focus:border-[#1a1c1a] text-[#1a1c1a]"
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL"
          className="w-full p-2 mb-4 border border-gray-300 focus:outline-none focus:border-[#1a1c1a] text-[#1a1c1a]"
          required
        />
        <div className="mb-4">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`mr-2 mb-2 px-3 py-1 border ${
                selectedCategories.includes(category)
                  ? 'bg-[#1a1c1a] text-white border-[#1a1c1a]'
                  : 'bg-white text-[#1a1c1a] border-[#1a1c1a] hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {showError && selectedCategories.length === 0 && (
          <p className="text-red-500 mb-2">Please select at least one category</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#1a1c1a] text-white border border-[#1a1c1a] hover:bg-[#2a2c2a]"
        >
          Add Link
        </button>
      </form>
    </div>
  );
}

export default LinkForm;
