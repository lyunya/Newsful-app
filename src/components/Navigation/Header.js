import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import TokenService from '../../services/token-service';
import './Header.css';

const Header = () => {
  const handleLogoutClick = () => {
    TokenService.clearAuthToken();
  };

  const renderLogoutLink = () => (
    <Link onClick={handleLogoutClick} to="/" className="Header-link">
      Log out
    </Link>
  );

  const renderLoginLink = () => (
    <Link to="/" className="Header-link">
      Log in
    </Link>
  );

  return (
    <div className="header">
      <div className="container">
        <ul className="main-nav">
          <li>
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/saved-articles" className="nav-link">
              Saved Articles
            </Link>
          </li>
          <li>
            {TokenService.hasAuthToken()
              ? renderLogoutLink()
              : renderLoginLink()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
