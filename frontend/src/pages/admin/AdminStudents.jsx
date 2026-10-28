import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { UserPlus, Search, Trash2, Award, AlertCircle, CheckCircle2, X, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminStudents() {
  const { getAuthHeaders, apiBaseUrl } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(searchParams.get('action') === 'new')
  const [deletingId, setDeletingId] = useState(null)

  // Registration Form State
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [admYear, setAdmYear] = useState(new Date().getFullYear())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/results/students`, {
        headers: getAuthHeaders(),
      })
      if (res.ok) {
        const data = await res.json()
        setStudents(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl, getAuthHeaders])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (!name || !age || !admYear) {
      setFormError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    setFormError('')
    setSuccessMsg('')

    try {
      const res = await fetch(`${apiBaseUrl}/results/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: name.trim(),
          age: parseInt(age, 10),
          adm_year: parseInt(admYear, 10),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register student.')
      }

      setSuccessMsg('Student registered successfully!')
      setName('')
      setAge('')
      fetchStudents()
      setTimeout(() => {
        setModalOpen(false)
        setSuccessMsg('')
        searchParams.delete('action')
        setSearchParams(searchParams)
      }, 1200)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteStudent = async (id, studentName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${studentName}? This will also delete all academic results associated with this student.`
      )
    ) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`${apiBaseUrl}/results/students/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to delete student.')
      } else {
        setStudents((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (err) {
      console.error('Error deleting student:', err)
      alert('Network error while deleting student.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase()
    return (
      s.name?.toLowerCase().includes(query) ||
      s.adm_year?.toString().includes(query)
    )
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
            Student Registration Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
            Register new students and manage student records for online result publication.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalOpen(true)
            setFormError('')
            setSuccessMsg('')
          }}
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
          <UserPlus size={16} /> Register New Student
        </button>
      </div>

      {/* ── Search Bar ──────────────────────────────────────── */}
      <div style={{ marginBottom: '24px', maxWidth: '400px', position: 'relative' }}>
        <Search
          size={16}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
        />
        <input
          type="text"
          placeholder="Search by student name or admission year..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            fontSize: '13.5px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            outline: 'none',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── Students Table ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            Loading registered students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
            <Users size={36} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, color: '#334155', marginBottom: '4px' }}>No students found</p>
            <p style={{ fontSize: '13px', margin: 0 }}>
              {searchQuery ? 'Try adjusting your search query.' : 'Click "Register New Student" to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Student Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Age</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Admission Year</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Registered On</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0B2555' }}>
                      {student.name}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>
                      {student.age} yrs
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>
                      <span
                        style={{
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        {student.adm_year}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#94A3B8', fontSize: '12.5px' }}>
                      {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link
                          to={`/admin/results?studentId=${student.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#FAF5FF',
                            color: '#9333EA',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                        >
                          <Award size={13} /> Manage Results
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          disabled={deletingId === student.id}
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
                            cursor: deletingId === student.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                          {deletingId === student.id ? '...' : 'Delete'}
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

      {/* ── Register Student Modal ──────────────────────────── */}
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
              maxWidth: '460px',
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
                Register New Student
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
            <form onSubmit={handleRegisterSubmit} style={{ padding: '24px' }}>
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

              {/* Student Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Emeka Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

              {/* Age */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Age <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  min="3"
                  max="25"
                  placeholder="e.g., 10"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
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

              {/* Admission Year */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Admission Year <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  min="2010"
                  max={new Date().getFullYear() + 1}
                  value={admYear}
                  onChange={(e) => setAdmYear(e.target.value)}
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
                  <UserPlus size={15} />
                  {submitting ? 'Registering...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
