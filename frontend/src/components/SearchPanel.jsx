import React from 'react';
const SearchPanel = () => {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Search Cargo</h2>
        <input
          type="text"
          placeholder="Search by ID or Type..."
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    );
  };
  
  export default SearchPanel;
  