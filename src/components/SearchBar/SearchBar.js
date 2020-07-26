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
    <form className="search">
      <input
        value={searchValue}
        onChange={handleSearchInputChanges}
        placeholder={"Search for articles"}
        type="search"
        role="search"
        className="search-bar"
      />
      <input
        className="search-button"
        onClick={callSearchFunction}
        type="submit"
        value="SEARCH"
      />
    </form>
  );
};

export default SearchBar;
