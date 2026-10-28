import PageHeader from '../components/PageHeader'
import studentsImg from '../assets/students_story.jpg'

// Eye icon for Vision
function EyeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

// Target icon for Mission
function TargetIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#ffffff' }}>

      {/* ── Page Header Banner ─────────────────────────── */}
      <PageHeader title="About PPIS" breadcrumb="About" />


      {/* ── Our Story ──────────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', padding: '52px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              alignItems: 'center',
            }}
            className="about-story-grid"
          >
            {/* Students Image */}
            <div>
              <img
                src={studentsImg}
                alt="PPIS Students"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  display: 'block',
                }}
              />
            </div>

            {/* Text */}
            <div>
              <h2
                style={{
                  color: '#0B2555',
                  fontSize: 'clamp(20px, 2.2vw, 26px)',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                Our Story
              </h2>
              <p
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  lineHeight: 1.8,
                  marginBottom: '14px',
                }}
              >
                Precious Pearls International School (PPIS) is a reputable secondary school
                committed to providing quality education, discipline, and excellence.
              </p>
              <p
                style={{
                  color: '#6B7280',
                  fontSize: '14px',
                  lineHeight: 1.8,
                }}
              >
                We have a long-standing tradition of nurturing young minds and building bright
                futures. Our conducive learning environment and experienced staff ensure that
                every student receives the holistic development necessary to thrive in an
                ever-changing world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission (white background variant) ─ */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '52px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Our Vision */}
            <div
              id="about-vision"
              style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '2px solid #D6EAF8',
                  backgroundColor: '#EBF5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                }}
              >
                <EyeIcon />
              </div>
              <div>
                <h3
                  style={{
                    color: '#0B2555',
                    fontSize: '17px',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  Our Vision
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.8 }}>
                  To be a centre of excellence in education, producing well-rounded individuals
                  who make a positive impact in society.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div
              id="about-mission"
              style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '2px solid #D6EAF8',
                  backgroundColor: '#EBF5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                }}
              >
                <TargetIcon />
              </div>
              <div>
                <h3
                  style={{
                    color: '#0B2555',
                    fontSize: '17px',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  Our Mission
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.8 }}>
                  To provide quality education, promote good character and equip our students
                  with the skills needed for a brighter future.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
