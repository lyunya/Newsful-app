import React, { useState } from "react";
import "./SearchBar.css"

const SearchBar = (props) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  };

  const resetInputField = () => {
    setSearchValue("");
  };

  const callSearchFunction = (e) => {
    e.preventDefault();
    props.search(searchValue);
    resetInputField();
  };

  return (
    <form className="search" onSubmit={callSearchFunction}>
      <label htmlFor="search news">
        <input
          value={searchValue}
          onChange={handleSearchInputChanges}
          placeholder={"Search for articles"}
          type="search"
          role="search"
          className="search-bar"
          required
        />
      </label>
      <label htmlFor="submit search button">
        <input
          className="search-button"
          type="submit"
          value="SEARCH"
        />
      </label>
    </form>
  );
};

export default SearchBar;
