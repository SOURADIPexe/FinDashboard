import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <main
        style={{
          flex: 1,
          marginLeft: '240px',
          padding: '2rem',
          background: 'var(--bg-primary)',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
