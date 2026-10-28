import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ppis_logo from '../assets/ppis_logo.png'

const navLinks = [
  { label: 'Home',      to: '/' },
  { label: 'About',     to: '/about' },
  { label: 'Admission', to: '/admission' },
  { label: 'Media',     to: '/media' },
  { label: 'Results',   to: '/results' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <header
      id="navbar"
      style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0' }}
      className="sticky top-0 z-50"
    >
      <div className="container">
        <nav
          style={{ height: '64px' }}
          className="flex items-center justify-between"
        >
          {/* ── Logo ─────────────────────────────────── */}
          <NavLink to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
            <img
              src={ppis_logo}
              alt="PPIS Logo"
              style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#0B2555', letterSpacing: '0.02em' }}>
                PPIS
              </span>
              <span style={{ fontSize: 8.5, fontWeight: 600, color: '#374151', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                Precious Pearls
              </span>
              <span style={{ fontSize: 7.5, fontWeight: 500, color: '#6B7280', letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                International School
              </span>
            </div>
          </NavLink>

          {/* ── Desktop Nav Links ─────────────────────── */}
          <ul
            className="hidden md:flex items-center list-none m-0 p-0"
            style={{ gap: '28px' }}
          >
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Desktop Actions ───────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="navbar-search-btn"
              aria-label="Search"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <Search size={18} color="#374151" />
            </button>
            <NavLink
              to={isAuthenticated ? '/admin' : '/login'}
              id="navbar-login-btn"
              style={{
                backgroundColor: '#0B2555',
                color: '#ffffff',
                padding: '8px 22px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: '24px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: 'inherit',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#081B3D'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0B2555'}
            >
              {isAuthenticated ? 'Admin Portal' : 'Login'}
            </NavLink>
          </div>

          {/* ── Mobile Toggle ─────────────────────────── */}
          <button
            id="navbar-mobile-toggle"
            className="md:hidden flex items-center justify-center"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={24} color="#0B2555" /> : <Menu size={24} color="#0B2555" />}
          </button>
        </nav>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────── */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #E2E8F0',
            padding: '16px 24px 24px',
          }}
        >
          <ul className="flex flex-col list-none m-0 p-0" style={{ gap: '4px' }}>
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' active' : ''}`
                  }
                  style={{ display: 'block', padding: '10px 0' }}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <NavLink
            to={isAuthenticated ? '/admin' : '/login'}
            style={{
              marginTop: 16,
              width: '100%',
              justifyContent: 'center',
              backgroundColor: '#0B2555',
              color: '#ffffff',
              padding: '10px 22px',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: '24px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => setMobileOpen(false)}
          >
            {isAuthenticated ? 'Admin Portal' : 'Login'}
          </NavLink>
        </div>
      )}
    </header>
  )
}
