import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link to="/">🚒 소방 안전 앱</Link>
        </h1>
        <nav className="nav">
          <Link to="/" className="nav-link">홈</Link>
          <Link to="/emergency" className="nav-link">긴급신고</Link>
          <Link to="/safety-check" className="nav-link">안전점검</Link>
          <Link to="/statistics" className="nav-link">통계</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;