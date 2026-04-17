import React from 'react';
import './Navigation.css';

function Navigation({ user }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">🥾 Trail Scout</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/trails">Trails</a></li>
          <li><a href="/community">Community</a></li>
          <li><a href="/my-hikes">My Hikes</a></li>
          {user ? (
            <>
              <li><span className="user-name">{user.username}</span></li>
              <li><a href="/logout" className="logout-btn">Logout</a></li>
            </>
          ) : (
            <>
              <li><a href="/login" className="login-btn">Login</a></li>
              <li><a href="/register" className="register-btn">Sign Up</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
