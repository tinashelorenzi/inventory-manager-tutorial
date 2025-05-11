// src/components/SearchBar.js
import React from 'react';

function SearchBar({ 
  searchTerm, 
  setSearchTerm, 
  searchQuantity, 
  setSearchQuantity, 
  searchType, 
  setSearchType, 
  onSearch 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center mb-4">
        <label className="inline-flex items-center mr-6">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-600"
            checked={searchType === 'name'}
            onChange={() => setSearchType('name')}
          />
          <span className="ml-2 text-gray-700">Search by Name</span>
        </label>
        
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-600"
            checked={searchType === 'quantity'}
            onChange={() => setSearchType('quantity')}
          />
          <span className="ml-2 text-gray-700">Search by Quantity</span>
        </label>
      </div>

      {searchType === 'name' ? (
        <div className="flex">
          <input
            type="text"
            placeholder="Search by item name..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      ) : (
        <div className="flex">
          <input
            type="number"
            placeholder="Search by quantity..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuantity}
            onChange={(e) => setSearchQuantity(e.target.value)}
            min="0"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      )}
    </form>
  );
}

export default SearchBar;