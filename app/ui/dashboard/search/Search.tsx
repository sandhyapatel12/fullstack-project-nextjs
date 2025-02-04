

/// ----------------------------right code but with pagination----------------------

// "use client";
import React from "react";

interface SearchProps {
  onSearchChange: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchChange }) => {
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearchChange(query); // Call the parent handler with the query
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        onChange={handleSearchChange}
        placeholder="Search by username..."
        className="md:w-64 w-full px-4 py-2 border border-green-700 rounded-md"
      />
    </div>
  );
};

export default Search;
