import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  LogOut, 
  Sun, 
  Moon, 
  ShieldCheck 
} from 'lucide-react';
import logo from '../../assets/logo.png';
import logoWhite from '../../assets/logo-white-transp.png';

export default function AdminLayout() {
  const { user, loading, logout } = useAdminAuth();
  const location = useLocation();
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-muted">Carregando painel administrativo...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/candidaturas', icon: Users, label: 'Candidaturas' },
    ...(user.role === 'admin' ? [
      { to: '/admin/usuarios', icon: UserCheck, label: 'Usuários Admin' },
      { to: '/admin/auditoria', icon: ShieldCheck, label: 'Auditoria' },
    ] : []),
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 10,
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={theme === 'light' ? logoWhite : logo} alt="Formel D" style={{ height: '36px' }} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Painel R&S</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Formel D Brasil</div>
          </div>
        </div>

        <nav style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: active ? '#fff' : 'var(--text-muted)',
                  background: active ? 'var(--brand-primary)' : 'transparent',
                  fontWeight: active ? '600' : '500',
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {user.nome}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sair do painel"
            className="btn btn-ghost"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{
          height: '64px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 2rem',
          gap: '1rem',
        }}>
          <button
            onClick={toggleTheme}
            className="btn btn-ghost"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            aria-label="Alternar Tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>

        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
