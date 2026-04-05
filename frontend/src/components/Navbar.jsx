import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  LogOut,
  TrendingUp,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isAnalystOrAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1rem',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: isActive ? '600' : '400',
    color: isActive ? 'var(--accent-blue-light)' : 'var(--text-secondary)',
    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  });

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '240px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          paddingLeft: '0.5rem',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingUp size={20} color="white" />
        </div>
        <span className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          FinDash
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {isAnalystOrAdmin() && (
          <NavLink to="/dashboard" style={linkStyle}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        )}
        <NavLink to="/transactions" style={linkStyle}>
          <ArrowLeftRight size={18} />
          Transactions
        </NavLink>
        {isAdmin() && (
          <NavLink to="/admin" style={linkStyle}>
            <Users size={18} />
            Admin Panel
          </NavLink>
        )}
      </div>

      {/* User info + Logout */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            padding: '0 0.5rem',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: 'white',
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.name}
            </p>
            <span className={`badge badge-${user.role?.toLowerCase()}`}>{user.role}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--accent-red-light)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
