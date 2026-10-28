import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Users, Award, Upload, UserPlus, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user, getAuthHeaders, apiBaseUrl } = useAuth()
  const [stats, setStats] = useState({
    mediaCount: 0,
    studentCount: 0,
    loading: true,
  })
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check API health
        try {
          const healthRes = await fetch(`${apiBaseUrl}/health`)
          if (healthRes.ok) setApiStatus('online')
          else setApiStatus('error')
        } catch {
          setApiStatus('offline')
        }

        // Fetch media count
        let mediaCount = 0
        try {
          const mediaRes = await fetch(`${apiBaseUrl}/media`)
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json()
            mediaCount = Array.isArray(mediaData) ? mediaData.length : 0
          }
        } catch {
          // ignore
        }

        // Fetch students count
        let studentCount = 0
        try {
          const studentsRes = await fetch(`${apiBaseUrl}/results/students`, {
            headers: getAuthHeaders(),
          })
          if (studentsRes.ok) {
            const studentsData = await studentsRes.json()
            studentCount = Array.isArray(studentsData) ? studentsData.length : 0
          }
        } catch {
          // ignore
        }

        setStats({ mediaCount, studentCount, loading: false })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchDashboardData()
  }, [apiBaseUrl, getAuthHeaders])

  return (
    <div className="container">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0B2555', marginBottom: '4px' }}>
            Welcome, {user?.email?.split('@')[0] || 'Administrator'}
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
            Precious Pearls International School CMS &mdash; Manage website media, students, and academic results.
          </p>
        </div>

        {/* Backend Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 500,
              backgroundColor: apiStatus === 'online' ? '#ECFDF5' : '#FEF2F2',
              color: apiStatus === 'online' ? '#059669' : '#DC2626',
              border: `1px solid ${apiStatus === 'online' ? '#A7F3D0' : '#FECACA'}`,
            }}
          >
            {apiStatus === 'online' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            Server {apiStatus === 'online' ? 'Online' : 'Offline / Error'}
          </span>
        </div>
      </div>

      {/* ── Metric Summary Cards ───────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Media Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Total Media Items</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <ImageIcon size={20} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#0B2555', marginBottom: '8px' }}>
            {stats.loading ? '...' : stats.mediaCount}
          </div>
          <Link
            to="/admin/media"
            style={{ fontSize: '13px', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
          >
            Manage School Media &rarr;
          </Link>
        </div>

        {/* Students Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Registered Students</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#0B2555', marginBottom: '8px' }}>
            {stats.loading ? '...' : stats.studentCount}
          </div>
          <Link
            to="/admin/students"
            style={{ fontSize: '13px', color: '#16A34A', textDecoration: 'none', fontWeight: 500 }}
          >
            View Student Roster &rarr;
          </Link>
        </div>

        {/* Results Management Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Academic Results</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FAF5FF', color: '#9333EA' }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ fontSize: '15px', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>
            Enter and manage termly exam scores and grades for students.
          </div>
          <Link
            to="/admin/results"
            style={{ fontSize: '13px', color: '#9333EA', textDecoration: 'none', fontWeight: 500 }}
          >
            Manage Student Results &rarr;
          </Link>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0B2555', marginBottom: '16px' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Link
            to="/admin/media?action=upload"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#1E293B',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563EB'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <Upload size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Upload School Media</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Add pictures or videos</div>
            </div>
          </Link>

          <Link
            to="/admin/students?action=new"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#1E293B',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#16A34A'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A' }}>
              <UserPlus size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Register Student</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Add to student database</div>
            </div>
          </Link>

          <Link
            to="/admin/results"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#1E293B',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9333EA'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FAF5FF', color: '#9333EA' }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Record Student Results</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Enter scores &amp; grades</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
