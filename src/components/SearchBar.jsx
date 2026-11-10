import { useEffect, useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, activeQuery = '', onClear }) {
  const [value, setValue] = useState(activeQuery);

  // Keep the box in step with the active search (back button, shared link,
  // "Back to top stories").
  useEffect(() => {
    setValue(activeQuery);
  }, [activeQuery]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    onSearch(query);
  };

  return (
    <div className="search-area">
      <form className="search" role="search" onSubmit={handleSubmit}>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search any topic…"
          type="search"
          aria-label="Search news"
          className="search-input"
          required
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {activeQuery && (
        <p className="active-query">
          Showing results for <strong>“{activeQuery}”</strong>
          <button type="button" className="clear-search" onClick={onClear}>
            Back to top stories
          </button>
        </p>
      )}
    </div>
  );
}
