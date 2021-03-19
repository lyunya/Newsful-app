import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = (props) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  };

  const resetInputField = () => {
    setSearchValue('');
  };

  const callSearchFunction = (e) => {
    e.preventDefault();
    props.search(searchValue);
    resetInputField();
  };

  return (
    <form className="search" role="search" onSubmit={callSearchFunction}>
      <input
        value={searchValue}
        onChange={handleSearchInputChanges}
        placeholder="Search for articles"
        type="search"
        aria-label="search news"
        className="search-bar"
        required
      />
      <input
        className="search-button"
        aria-label="submit search button"
        type="submit"
        value="SEARCH"
      />
    </form>
  );
};

export default SearchBar;
