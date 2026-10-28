import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';

const terms = ['All Terms', 'First Term', 'Second Term', 'Third Term'];

export default function ResultsPage() {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [term, setTerm] = useState('All Terms');
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Last 10 years

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!name || !year) {
      setErrorMsg('Please enter both name and admission year.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResultData(null);

    try {
      const termParam = term && term !== 'All Terms' ? `&term=${encodeURIComponent(term)}` : '';
      const res = await fetch(`http://localhost:5000/api/results/lookup?name=${encodeURIComponent(name)}&year=${year}${termParam}`);
      const data = await res.json();
      
      if (res.ok) {
        setResultData(data);
      } else {
        setErrorMsg(data.error || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setErrorMsg('Network error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <PageHeader title="Check Student Results" breadcrumb="Results" />

      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h2 style={{ color: '#0B2555', marginBottom: '24px', fontSize: '20px' }}>Enter Student Details</h2>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter student name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Admission Year */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Admission Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="" disabled>Select admission year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Term */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Term</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {terms.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px', padding: '14px' }}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'View Result'}
              </button>
            </form>

            {errorMsg && (
              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', fontSize: '14px' }}>
                {errorMsg}
              </div>
            )}
          </div>

          {/* Results Display Area */}
          {resultData && resultData.student && (
            <div style={{ marginTop: '40px', padding: '32px', backgroundColor: '#F8F9FA', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ color: '#0B2555', marginBottom: '8px' }}>Student Profile</h3>
                  <p style={{ margin: 0, color: '#475569' }}>Name: <strong>{resultData.student.name}</strong></p>
                  <p style={{ margin: 0, color: '#475569' }}>Admission Year: {resultData.student.adm_year}</p>
                </div>
                <div style={{
                  backgroundColor: '#EBF5FB',
                  color: '#0B2555',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid #D6EAF8'
                }}>
                  {resultData.selectedTerm || term}
                </div>
              </div>

              <h3 style={{ color: '#0B2555', marginTop: '24px', marginBottom: '16px' }}>Academic Results</h3>
              
              {resultData.results && resultData.results.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0B2555', color: '#ffffff', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Term</th>
                        <th style={{ padding: '12px' }}>Subject</th>
                        <th style={{ padding: '12px' }}>Score</th>
                        <th style={{ padding: '12px' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultData.results.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '12px', color: '#334155' }}>{r.term}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>{r.subject}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>{r.score}</td>
                          <td style={{ padding: '12px', color: '#334155', fontWeight: 600 }}>{r.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#6B7280', margin: 0 }}>
                  No results published yet for this student{term && term !== 'All Terms' ? ` in ${term}` : ''}.
                </p>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
