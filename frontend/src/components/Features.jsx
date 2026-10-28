// ── Icon SVGs matching the reference image exactly ──────────────────────

function SchoolIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
      <rect x="9" y="5" width="6" height="4" rx="0.5" />
    </svg>
  )
}

function StaffIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <circle cx="19" cy="7" r="2" />
      <path d="M22 21v-1a3 3 0 0 0-2-2.83" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4" />
      <path d="M7 4H4a2 2 0 0 0-2 2v2a5 5 0 0 0 5 5h.5" />
      <path d="M17 4h3a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5h-.5" />
      <path d="M7 4h10a1 1 0 0 1 1 1v6a6 6 0 0 1-12 0V5a1 1 0 0 1 1-1z" />
    </svg>
  )
}

const features = [
  {
    id: 'feature-quality-education',
    Icon: SchoolIcon,
    title: 'Quality Education',
    description: 'We provide a conducive learning environment for holistic development.',
  },
  {
    id: 'feature-experienced-staff',
    Icon: StaffIcon,
    title: 'Experienced Staff',
    description: 'Our teachers are dedicated to guiding and supporting every student.',
  },
  {
    id: 'feature-holistic-development',
    Icon: TrophyIcon,
    title: 'Holistic Development',
    description: 'We nurture academic, moral and social growth in our students.',
  },
]

export default function Features() {
  return (
    <section id="features" style={{ backgroundColor: '#ffffff', padding: '40px 0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
        >
          {features.map(({ id, Icon, title, description }, idx) => (
            <article
              key={id}
              id={id}
              style={{
                textAlign: 'center',
                padding: '28px 32px 24px',
                borderRight: idx < features.length - 1 ? '1px solid #E2E8F0' : 'none',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Icon />
              </div>

              {/* Title */}
              <h3
                style={{
                  color: '#0B2555',
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                {title}
              </h3>

              {/* Description */}
              <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.65 }}>
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
