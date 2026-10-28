import { Link } from 'react-router-dom'
import aboutImg from '../assets/about_school.png'

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{ backgroundColor: '#ffffff', padding: '56px 0' }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '56px',
            alignItems: 'center',
          }}
        >
          {/* ── Text Column ────────────────────────────── */}
          <div>
            <h2
              style={{
                color: '#0B2555',
                fontSize: 'clamp(22px, 2.5vw, 30px)',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              About PPIS
            </h2>

            <p
              style={{
                color: '#374151',
                fontSize: '14px',
                lineHeight: 1.75,
                marginBottom: '12px',
              }}
            >
              Precious Pearls International School (PPIS) is a reputable secondary school
              committed to providing quality education, discipline and excellence.
            </p>

            <p
              style={{
                color: '#6B7280',
                fontSize: '13.5px',
                lineHeight: 1.75,
                marginBottom: '28px',
              }}
            >
              We are passionate about shaping well-rounded individuals who make a positive
              impact in their communities and beyond.
            </p>

            <Link
              to="/about"
              id="about-learn-more-btn"
              style={{
                backgroundColor: '#0B2555',
                color: '#ffffff',
                padding: '11px 28px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#081B3D'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0B2555'}
            >
              Learn More
            </Link>
          </div>

          {/* ── Image Column ───────────────────────────── */}
          <div>
            <img
              src={aboutImg}
              alt="Precious Pearls International School building"
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
