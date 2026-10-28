import { Link } from 'react-router-dom'
import heroBg from '../assets/hero_bg.jpg'

export default function PageHeader({ title, breadcrumb }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(8, 27, 61, 0.80)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: '#ffffff',
        }}
      >
        <h1
          style={{
            marginBottom: '10px',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {title}
        </h1>

        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.4px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.70)', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.45)' }}>›</span>
          <span style={{ color: '#ffffff' }}>{breadcrumb || title}</span>
        </div>
      </div>
    </div>
  )
}
