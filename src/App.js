// src/App.js
import React, { useState, useEffect } from 'react';
import LinkForm from './components/LinkForm';
import LinkList from './components/LinkList';
import Sidebar from './components/Sidebar';
import { getAdminData } from './components/Auth';
import './App.css';

const categoryColors = {
  Forest: '#065535',
  'Olive Oil': '#bada55',
  Bee: '#ffd079',
  Peach: '#ff8d79',
  Rose: '#ffb8ac'
};

function App() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryColorMap, setCategoryColorMap] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [emptyCategory, setEmptyCategory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedLinks = JSON.parse(localStorage.getItem('links'));
        const storedCategories = JSON.parse(localStorage.getItem('categories'));
        const storedCategoryColorMap = JSON.parse(localStorage.getItem('categoryColorMap'));

        if (storedLinks && storedCategories && storedCategoryColorMap) {
          setLinks(storedLinks);
          setCategories(storedCategories);
          setCategoryColorMap(storedCategoryColorMap);
        } else {
          const response = await fetch('/initialData.json');
          const data = await response.json();
          setLinks(data.links.map(link => ({ ...link, openCount: 0 })));
          setCategories(data.categories);
          const initialColorMap = {};
          data.categories.forEach(category => {
            initialColorMap[category] = categoryColors[category];
          });
          setCategoryColorMap(initialColorMap);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsLoaded(true);
      }
    };

    loadInitialData();

    const checkAdminStatus = async () => {
      try {
        await getAdminData();
        setIsAdmin(true);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      checkAdminStatus();
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('links', JSON.stringify(links));
      localStorage.setItem('categories', JSON.stringify(categories));
      localStorage.setItem('categoryColorMap', JSON.stringify(categoryColorMap));
    }
  }, [links, categories, categoryColorMap, isLoaded]);

  const addLink = (newLink) => {
    if (newLink.categories.length === 0) {
      alert("Please select at least one category before adding a link.");
      return;
    }
    const linkWithCategories = {
      ...newLink,
      id: Date.now(),
      isRead: false,
      createdAt: new Date().toISOString(),
      openCount: 0,
    };
    setLinks(prevLinks => [linkWithCategories, ...prevLinks]);
  };

  const addCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setCategoryColorMap(prevColorMap => ({
        ...prevColorMap,
        [newCategory]: categoryColors[newCategory]
      }));
    }
  };

  const deleteCategory = (categoryToDelete) => {
    setCategories(prevCategories => prevCategories.filter(cat => cat !== categoryToDelete));
    setLinks(prevLinks => prevLinks.map(link => ({
      ...link,
      categories: link.categories.filter(cat => cat !== categoryToDelete)
    })));
    setSelectedCategories(prevSelected => prevSelected.filter(cat => cat !== categoryToDelete));
    setCategoryColorMap(prevColorMap => {
      const newColorMap = { ...prevColorMap };
      delete newColorMap[categoryToDelete];
      return newColorMap;
    });
  };

  const markAsRead = (id) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === id ? { ...link, isRead: !link.isRead } : link
      )
    );
  };

  const deleteLink = (id) => {
    setLinks(prevLinks => {
      const updatedLinks = prevLinks.filter(link => link.id !== id);
      const deletedLink = prevLinks.find(link => link.id === id);

      if (deletedLink) {
        const emptyCat = categories.find(category =>
          !updatedLinks.some(link => link.categories.includes(category))
        );
        if (emptyCat) {
          setEmptyCategory(emptyCat);
        }
      }

      return updatedLinks;
    });
  };

  const handleEmptyCategoryResponse = (shouldDelete) => {
    if (shouldDelete) {
      deleteCategory(emptyCategory);
    }
    setEmptyCategory(null);
  };

  const changeCategoryColor = (category, color) => {
    setCategoryColorMap(prevColorMap => ({
      ...prevColorMap,
      [category]: color
    }));
  };

  const handleLinkOpen = (id) => {
    setLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === id
          ? { ...link, openCount: (link.openCount || 0) + 1 }
          : link
      )
    );
  };

  const handleAdminStatusChange = (status) => {
    setIsAdmin(status);
  };

  const filteredLinks = selectedCategories.length === 0
    ? links
    : links.filter(link =>
        link.categories.some(category => selectedCategories.includes(category))
      );

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative z-10 shadow-lg">
        <Sidebar
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          addCategory={addCategory}
          deleteCategory={deleteCategory}
          categoryColorMap={categoryColorMap}
          changeCategoryColor={changeCategoryColor}
          availableColors={categoryColors}
          onAdminStatusChange={handleAdminStatusChange}
          isAdmin={isAdmin}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8 overflow-y-auto">
          {isAdmin && <LinkForm addLink={addLink} categories={categories} />}
          <LinkList
            links={filteredLinks}
            onMarkAsRead={markAsRead}
            onDelete={deleteLink}
            categoryColorMap={categoryColorMap}
            onLinkOpen={handleLinkOpen}
            isAdmin={isAdmin}
          />
        </div>
      </div>
      {emptyCategory && (
        <div className="fixed inset-0 bg-[#1a1c1a] bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 border border-[#1a1c1a]">
            <p className="text-[#1a1c1a] mb-4">The category "{emptyCategory}" is now empty. Do you want to delete it?</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleEmptyCategoryResponse(true)}
                className="mr-2 px-4 py-2 bg-[#1a1c1a] text-white border border-[#1a1c1a] hover:bg-[#2a2c2a]"
              >
                Yes
              </button>
              <button
                onClick={() => handleEmptyCategoryResponse(false)}
                className="px-4 py-2 bg-white text-[#1a1c1a] border border-[#1a1c1a] hover:bg-gray-100"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
