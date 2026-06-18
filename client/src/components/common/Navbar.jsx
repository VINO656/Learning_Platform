import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, BookOpen, User, Settings } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <Link to="/dashboard" className="logo">
          <BookOpen className="logo-icon" />
          <span>BootcampHub</span>
        </Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-item">
                <Settings size={18} />
                <span>Curriculum Manager</span>
              </Link>
            )}
            <div className="user-profile">
              <User size={18} />
              <span>{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item signup">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
