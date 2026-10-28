import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Award, Plus, Edit2, Trash2, AlertCircle, CheckCircle2, X, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const commonSubjects = [
  'Mathematics',
  'English Language',
  'Basic Science & Technology',
  'Social Studies',
  'Civic Education',
  'Computer Studies / ICT',
  'Agricultural Science',
  'Christian Religious Studies',
  'Islamic Religious Studies',
  'Business Studies',
  'Cultural & Creative Arts',
  'French',
]

const terms = ['First Term', 'Second Term', 'Third Term']

function calculateGrade(score) {
  const num = Number(score)
  if (isNaN(num)) return ''
  if (num >= 75) return 'A'
  if (num >= 65) return 'B'
  if (num >= 50) return 'C'
  if (num >= 40) return 'D'
  return 'F'
}

export default function AdminResults() {
  const { getAuthHeaders, apiBaseUrl } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState(searchParams.get('studentId') || '')
  const [studentDetails, setStudentDetails] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState('All')

  // Modal State for Add / Edit Result
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResult, setEditingResult] = useState(null) // null if adding, result object if editing
  const [subject, setSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [score, setScore] = useState('')
  const [grade, setGrade] = useState('')
  const [term, setTerm] = useState('First Term')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  // Fetch all students for the dropdown
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/results/students`, {
        headers: getAuthHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        setStudents(Array.isArray(data) ? data : [])
        if (!selectedStudentId && Array.isArray(data) && data.length > 0) {
          setSelectedStudentId(data[0].id)
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err)
    }
  }, [apiBaseUrl, getAuthHeaders, selectedStudentId])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Fetch results when selectedStudentId changes
  const fetchStudentResults = useCallback(async () => {
    if (!selectedStudentId) {
      setStudentDetails(null)
      setResults([])
      return
    }

    setLoadingResults(true)
    try {
      const res = await fetch(`${apiBaseUrl}/results/${selectedStudentId}`)
      if (res.ok) {
        const data = await res.json()
        setStudentDetails(data.student)
        setResults(Array.isArray(data.results) ? data.results : [])
      } else {
        setStudentDetails(null)
        setResults([])
      }
    } catch (err) {
      console.error('Error fetching student results:', err)
    } finally {
      setLoadingResults(false)
    }
  }, [apiBaseUrl, selectedStudentId])

  useEffect(() => {
    fetchStudentResults()
    if (selectedStudentId) {
      setSearchParams({ studentId: selectedStudentId })
    }
  }, [fetchStudentResults, selectedStudentId, setSearchParams])

  // Open modal for Adding
  const openAddModal = () => {
    setEditingResult(null)
    setSubject(commonSubjects[0])
    setCustomSubject('')
    setScore('')
    setGrade('')
    setTerm('First Term')
    setFormError('')
    setSuccessMsg('')
    setModalOpen(true)
  }

  // Open modal for Editing
  const openEditModal = (item) => {
    setEditingResult(item)
    if (commonSubjects.includes(item.subject)) {
      setSubject(item.subject)
      setCustomSubject('')
    } else {
      setSubject('Other')
      setCustomSubject(item.subject)
    }
    setScore(item.score.toString())
    setGrade(item.grade)
    setTerm(item.term)
    setFormError('')
    setSuccessMsg('')
    setModalOpen(true)
  }

  // Handle Score Change and auto-compute Grade
  const handleScoreChange = (val) => {
    setScore(val)
    if (val !== '') {
      setGrade(calculateGrade(val))
    } else {
      setGrade('')
    }
  }

  // Handle Form Submit (Add or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const finalSubject = subject === 'Other' ? customSubject.trim() : subject
    if (!finalSubject || score === '' || !grade || !term) {
      setFormError('Please fill in all result fields.')
      return
    }

    const numericScore = parseInt(score, 10)
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      setFormError('Score must be a number between 0 and 100.')
      return
    }

    setSubmitting(true)
    setFormError('')
    setSuccessMsg('')

    try {
      if (editingResult) {
        // PUT update
        const res = await fetch(`${apiBaseUrl}/results/${editingResult.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            subject: finalSubject,
            score: numericScore,
            grade,
            term,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update result.')
        }

        setSuccessMsg('Result updated successfully!')
        setResults((prev) =>
          prev.map((r) =>
            r.id === editingResult.id
              ? { ...r, subject: finalSubject, score: numericScore, grade, term }
              : r
          )
        )
      } else {
        // POST create
        const res = await fetch(`${apiBaseUrl}/results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            student_id: selectedStudentId,
            subject: finalSubject,
            score: numericScore,
            grade,
            term,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to create result.')
        }

        setSuccessMsg('Result recorded successfully!')
        setResults((prev) => [...prev, data])
      }

      setTimeout(() => {
        setModalOpen(false)
        setSuccessMsg('')
      }, 1000)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete Result
  const handleDeleteResult = async (id, resultSubject) => {
    if (!window.confirm(`Are you sure you want to delete the result for ${resultSubject}?`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`${apiBaseUrl}/results/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to delete result.')
      } else {
        setResults((prev) => prev.filter((r) => r.id !== id))
      }
    } catch (err) {
      console.error('Error deleting result:', err)
      alert('Network error while deleting result.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredResults = results.filter((r) => {
    if (selectedTerm === 'All') return true
    return r.term === selectedTerm
  })

  return (
    <div className="container">
      {/* ── Page Header ────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0B2555', marginBottom: '4px' }}>
            Student Results Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
            Select a student to enter, update, or remove subject exam scores and grades.
          </p>
        </div>

        {selectedStudentId && (
          <button
            type="button"
            onClick={openAddModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0B2555',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0B2555')}
          >
            <Plus size={16} /> Add Subject Result
          </button>
        )}
      </div>

      {/* ── Student Selector & Profile Card ──────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ maxWidth: '440px' }}>
          <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
            Select Student
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#F8FAFC',
              fontWeight: 500,
              color: '#0B2555',
            }}
          >
            {students.length === 0 ? (
              <option value="">No students available. Register a student first.</option>
            ) : (
              students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Admitted: {s.adm_year})
                </option>
              ))
            )}
          </select>
        </div>

        {studentDetails && (
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '8px',
              padding: '12px 18px',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              border: '1px solid #BFDBFE',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', color: '#1E40AF', display: 'block' }}>Student Name</span>
              <strong style={{ fontSize: '14px', color: '#1E3A8A' }}>{studentDetails.name}</strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#1E40AF', display: 'block' }}>Admission Year</span>
              <strong style={{ fontSize: '14px', color: '#1E3A8A' }}>{studentDetails.adm_year}</strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#1E40AF', display: 'block' }}>Age</span>
              <strong style={{ fontSize: '14px', color: '#1E3A8A' }}>{studentDetails.age} years</strong>
            </div>
          </div>
        )}
      </div>

      {/* ── Term Filter Tabs ────────────────────────────────── */}
      {selectedStudentId && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['All', ...terms].map((t) => {
            const isActive = selectedTerm === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTerm(t)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: 'none',
                  backgroundColor: isActive ? '#0B2555' : '#E2E8F0',
                  color: isActive ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Results Table ───────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {!selectedStudentId ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#64748B' }}>
            Please select a student above to view or manage results.
          </div>
        ) : loadingResults ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            Loading student results...
          </div>
        ) : filteredResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
            <BookOpen size={36} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, color: '#334155', marginBottom: '4px' }}>No results recorded yet</p>
            <p style={{ fontSize: '13px', margin: 0 }}>
              Click &ldquo;Add Subject Result&rdquo; to enter scores for this student.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Subject</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Term</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Score</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Grade</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => (
                  <tr
                    key={r.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0B2555' }}>
                      {r.subject}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>
                      {r.term}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1E293B' }}>
                      {r.score} / 100
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          backgroundColor:
                            r.grade === 'A'
                              ? '#DCFCE7'
                              : r.grade === 'B'
                              ? '#EFF6FF'
                              : r.grade === 'C'
                              ? '#FEF9C3'
                              : '#FEE2E2',
                          color:
                            r.grade === 'A'
                              ? '#166534'
                              : r.grade === 'B'
                              ? '#1E40AF'
                              : r.grade === 'C'
                              ? '#854D0E'
                              : '#991B1B',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '12.5px',
                        }}
                      >
                        {r.grade}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(r)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteResult(r.id, r.subject)}
                          disabled={deletingId === r.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            cursor: deletingId === r.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                          {deletingId === r.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Result Modal ─────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0B2555', margin: 0 }}>
                {editingResult ? 'Edit Subject Result' : 'Add Subject Result'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} style={{ padding: '24px' }}>
              {formError && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#B91C1C',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {successMsg && (
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#059669',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Subject */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                    marginBottom: subject === 'Other' ? '8px' : 0,
                  }}
                >
                  {commonSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="Other">Other (Custom Subject)</option>
                </select>

                {subject === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom subject name"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                      marginTop: '6px',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>

              {/* Term */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Academic Term
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  {terms.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score and Grade in two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    Score (0 - 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g., 85"
                    value={score}
                    onChange={(e) => handleScoreChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                    Grade (Auto)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., A"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0B2555',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.75 : 1,
                  }}
                >
                  <Award size={15} />
                  {submitting ? 'Saving...' : editingResult ? 'Update Result' : 'Save Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
