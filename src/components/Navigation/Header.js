import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <ul className="main-nav">
          <li>
            <Link to="/" className="nav-link">
              Top Stories
            </Link>
          </li>
          <li>
            <Link to="/saved-articles" className="nav-link">
              Saved Articles
            </Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">
              Log Out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
