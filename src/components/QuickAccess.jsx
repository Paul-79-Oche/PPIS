import { Link } from 'react-router-dom'

// Admission cap icon
function AdmissionIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

// Media/image icon
function MediaIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

// Results/document icon
function ResultsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0B2555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

const cards = [
  {
    id: 'quick-access-admission',
    Icon: AdmissionIcon,
    title: 'Admission Process',
    description: 'Learn about our admission requirements and how to apply.',
    to: '/admission',
  },
  {
    id: 'quick-access-media',
    Icon: MediaIcon,
    title: 'School Media',
    description: 'View photos and videos of school activities and events.',
    to: '/media',
  },
  {
    id: 'quick-access-results',
    Icon: ResultsIcon,
    title: 'Student Results',
    description: 'Check your result online securely and easily.',
    to: '/results',
  },
]

export default function QuickAccess() {
  return (
    <section
      id="quick-access"
      style={{ backgroundColor: '#ffffff', padding: '48px 0 56px' }}
    >
      <div className="container">
        {/* Heading */}
        <h2
          style={{
            color: '#0B2555',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            marginBottom: '32px',
          }}
        >
          Quick Access
        </h2>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {cards.map(({ id, Icon, title, description, to }) => (
            <Link
              key={id}
              id={id}
              to={to}
              style={{
                textAlign: 'center',
                padding: '36px 24px',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                textDecoration: 'none',
                display: 'block',
                backgroundColor: '#ffffff',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(11,37,85,0.10)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
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

              <h3
                style={{
                  color: '#0B2555',
                  fontSize: '15px',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  color: '#6B7280',
                  fontSize: '13px',
                  lineHeight: 1.65,
                }}
              >
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
