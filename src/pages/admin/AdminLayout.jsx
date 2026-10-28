import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Image as ImageIcon, Users, Award, LogOut, ExternalLink, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ppisLogo from '../../assets/ppis_logo.png'

const adminNavLinks = [
  { label: 'Overview', to: '/admin', end: true, icon: LayoutDashboard },
  { label: 'School Media', to: '/admin/media', icon: ImageIcon },
  { label: 'Students Roster', to: '/admin/students', icon: Users },
  { label: 'Student Results', to: '/admin/results', icon: Award },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
      {/* ── Admin Top Navigation Bar ────────────────────────── */}
      <header
        style={{
          backgroundColor: '#0B2555',
          color: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo & Portal Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img src={ppisLogo} alt="PPIS Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              <div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', display: 'block', lineHeight: 1.1 }}>
                  PPIS CMS
                </span>
                <span style={{ fontSize: '10px', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center" style={{ gap: '6px' }}>
            {adminNavLinks.map(({ label, to, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? '#ffffff' : '#CBD5E1',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Desktop User Info & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#93C5FD',
                textDecoration: 'none',
                fontSize: '13px',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ExternalLink size={14} /> View Public Site
            </Link>

            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: '#E2E8F0',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  maxWidth: '160px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={user?.email || 'Admin'}
              >
                {user?.email || 'Admin'}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#DC2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center"
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '6px' }}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{ backgroundColor: '#081B3D', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {adminNavLinks.map(({ label, to, end, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: isActive ? '#ffffff' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    textDecoration: 'none',
                  })}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}

              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                <span style={{ fontSize: '12px', color: '#CBD5E1' }}>{user?.email || 'Admin'}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#DC2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content Area ───────────────────────────────── */}
      <main style={{ flex: 1, padding: '32px 0 64px' }}>
        <Outlet />
      </main>

      {/* ── Admin Footer ────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #E2E8F0', padding: '16px 0', textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
        <div className="container">
          Precious Pearls International School &bull; Staff Content Management System
        </div>
      </footer>
    </div>
  )
}
