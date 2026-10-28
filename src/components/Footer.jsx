import { Link } from 'react-router-dom'
import PPIS_footer_logo from '../assets/ppis_footer_logo.png'

// Inline SVG brand icons — lucide-react does not ship Facebook/Instagram/YouTube
function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  )
}

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Admission', to: '/admission' },
  { label: 'Media', to: '/media' },
  { label: 'Results', to: '/results' },
]

const socials = [
  { id: 'footer-facebook', icon: FacebookIcon, href: '#', label: 'Facebook' },
  { id: 'footer-instagram', icon: InstagramIcon, href: '#', label: 'Instagram' },
  { id: 'footer-youtube', icon: YoutubeIcon, href: '#', label: 'YouTube' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="footer"
      style={{ backgroundColor: '#0B2555', color: '#ffffff' }}
    >
      {/* ── Main Footer Content ──────────────────────── */}
      <div
        className="container"
        style={{ paddingBlock: '48px' }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '40px',
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: '300px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src={PPIS_footer_logo}
                alt="PPIS Logo"
                style={{
                  width: 52,
                  height: 52,
                  objectFit: 'contain',
                  flexShrink: 0,
                  filter: 'brightness(0) invert(1)',  /* render white on dark footer */
                }}
              />
              <div className="flex flex-col leading-tight">
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                  PRECIOUS PEARLS
                </span>
                <span style={{ fontSize: 10, fontWeight: 500, color: '#4D9FD6', letterSpacing: 1, textTransform: 'uppercase' }}>
                  International School
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              Nurturing young minds and building bright futures through quality education.
            </p>

            {/* Motto */}
            <p
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#4D9FD6',
                letterSpacing: '0.5px',
              }}
            >
              Knowledge &nbsp;|&nbsp; Discipline &nbsp;|&nbsp; Excellence
            </p>
          </div>



          {/* Contact Column */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>
                📍 Precious Pearls International School
              </p>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>
                ✉️ info@ppisschool.edu.ng
              </p>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>
                📞 +234 000 000 0000
              </p>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              {socials.map(({ id, icon: Icon, href, label }) => (
                <a
                  key={id}
                  id={id}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(77,159,214,0.15)',
                    border: '1px solid rgba(77,159,214,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#4D9FD6'
                    e.currentTarget.style.borderColor = '#4D9FD6'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(77,159,214,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(77,159,214,0.3)'
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingBlock: '16px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px',
            margin: 0,
          }}
        >
          &copy; {year} Precious Pearls International School. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
