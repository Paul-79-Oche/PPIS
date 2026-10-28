// Eye icon SVG — matching reference
function EyeIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

// Target/mission icon SVG — matching reference
function TargetIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

const items = [
  {
    id: 'vision-card',
    Icon: EyeIcon,
    heading: 'Our Vision',
    body: 'To be a centre of excellence in education, producing well-rounded individuals who make a positive impact in society.',
  },
  {
    id: 'mission-card',
    Icon: TargetIcon,
    heading: 'Our Mission',
    body: 'To provide quality education, promote good character and equip our students with the skills needed for a brighter future.',
  },
]

export default function VisionMission() {
  return (
    <section
      id="vision-mission"
      style={{ backgroundColor: '#0B2555', padding: '52px 0' }}
    >
      <div className="container">
        {/* Section heading */}
        <h2
          style={{
            color: '#ffffff',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            fontWeight: 700,
            marginBottom: '36px',
          }}
        >
          Our Vision &amp; Mission
        </h2>

        {/* Two-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0',
          }}
        >
          {items.map(({ id, Icon, heading, body }, index) => (
            <div
              key={id}
              id={id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                alignItems: 'flex-start',
                paddingRight: index === 0 ? '48px' : '0',
                paddingLeft: index === 1 ? '48px' : '0',
                borderRight: index === 0 ? '1px solid rgba(255,255,255,0.18)' : 'none',
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  flexShrink: 0,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                }}
              >
                <Icon />
              </div>

              {/* Text */}
              <div>
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  {heading}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.80)',
                    fontSize: '13.5px',
                    lineHeight: 1.75,
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
