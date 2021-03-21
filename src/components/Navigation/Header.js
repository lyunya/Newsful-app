import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import NewsfulContext from '../../context/NewsfulContext';

import TokenService from '../../services/token-service';
import './Header.css';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(NewsfulContext);

  const handleLogoutClick = () => {
    TokenService.clearAuthToken();
  };

  const renderLogoutLink = () => (
    <Link onClick={handleLogoutClick} to='/' className='Header-link'>
      Log out
    </Link>
  );

  const renderLoginLink = () => (
    <Link to='/' className='Header-link'>
      Log in
    </Link>
  );

  return (
    <div className={darkMode ? 'header-dark-mode' : 'header'}>
      <div className='header-container'>
        <ul className='main-nav'>
          <li>
            <Link to='/home' className='nav-link'>
              Home
            </Link>
          </li>
          <li>
            <Link to='/saved-articles' className='nav-link'>
              Saved Articles
            </Link>
          </li>
          <li>
            {TokenService.hasAuthToken()
              ? renderLogoutLink()
              : renderLoginLink()}
          </li>
          <div className='dark-mode-toggle'>
            {darkMode ? (
              <span role='img' aria-label='moon' onClick={toggleDarkMode}>
                🌞
              </span>
            ) : (
              <span role='img' aria-label='sun' onClick={toggleDarkMode}>
                🌚
              </span>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
