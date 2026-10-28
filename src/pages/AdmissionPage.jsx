import React from 'react';
import PageHeader from '../components/PageHeader';

const steps = [
  {
    number: 1,
    title: 'Obtain Application Form',
    description: 'Get the form from the school office or download online.',
  },
  {
    number: 2,
    title: 'Fill and Submit',
    description: 'Complete the form with the required information and submit it with necessary documents.',
  },
  {
    number: 3,
    title: 'Screening & Assessment',
    description: 'Eligible candidates will be invited for screening and assessment.',
  },
  {
    number: 4,
    title: 'Admission Offer',
    description: 'Successful candidates will be contacted for admission.',
  },
];

export default function AdmissionPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <PageHeader title="Admission Process" breadcrumb="Admission" />

      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#0B2555', marginBottom: '40px', textAlign: 'center' }}>
            How To Apply
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {steps.map((step) => (
              <div 
                key={step.number} 
                style={{ 
                  display: 'flex', 
                  gap: '24px', 
                  alignItems: 'flex-start',
                  backgroundColor: '#F9FAFB',
                  padding: '24px',
                  borderRadius: '12px'
                }}
              >
                {/* Number Icon */}
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#0B2555',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    flexShrink: 0
                  }}
                >
                  {step.number}
                </div>
                
                {/* Text */}
                <div>
                  <h3 style={{ color: '#0B2555', marginBottom: '8px', fontSize: '18px' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
