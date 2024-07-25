import React from 'react';
import './LinkItem.css';

function LinkItem({ link, onMarkAsRead, onDelete, categoryColorMap, onLinkOpen }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(link.id);
  };

  const handleMarkAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsRead(link.id);
  };

  const handleLinkOpen = (e) => {
    // Call the onLinkOpen function to update the open count
    onLinkOpen(link.id);
  };

  if (!link) {
    console.log("Link is null or undefined");
    return null;
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block h-full p-4 border ${link.isRead ? 'bg-gray-100' : 'bg-white'} border-gray-200 rounded-lg shadow-md relative hover:shadow-lg transition-shadow duration-300`}
      onClick={handleLinkOpen}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-10"
      >
        ×
      </button>
      <button
        onClick={handleMarkAsRead}
        className={`absolute top-2 right-8 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
          link.isRead ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}
      >
        ✓
      </button>
      <div className="link-content">
        <h3 className="text-xl font-semibold mb-2 pr-16 text-[#1a1c1a]">
          {link.title || link.url}
        </h3>
        {link.title && (
          <p className="text-black no-underline hover:italic">
            {link.url}
          </p>
        )}
        <div className="mt-2 flex flex-wrap">
          {link.categories.map(category => (
            <div
              key={category}
              className="category-square"
              style={{ backgroundColor: categoryColorMap[category] }}
            >
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Added: {new Date(link.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="absolute bottom-2 right-2 text-sm text-gray-500">
        Opened: {link.openCount || 0} times
      </div>
    </a>
  );
}

export default LinkItem;
