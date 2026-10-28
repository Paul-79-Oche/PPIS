import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ppisLogo from '../assets/ppis_logo.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const result = await login(email, password)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setErrorMsg(result.error || 'Invalid admin credentials.')
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748B',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0B2555')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          <ArrowLeft size={16} /> Back to School Website
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 25px -5px rgba(11, 37, 85, 0.08), 0 8px 10px -6px rgba(11, 37, 85, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            backgroundColor: '#0B2555',
            padding: '32px 24px',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <img
            src={ppisLogo}
            alt="PPIS Logo"
            style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 12px' }}
          />
          <h1
            style={{
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '6px',
            }}
          >
            PPIS Admin Portal
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.82)',
              fontSize: '13px',
              margin: 0,
            }}
          >
            Authorized staff access to manage school media and results
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '32px 28px' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13.5px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Staff / Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                />
                <input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="admin@ppis.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0B2555')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                style={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#1E293B',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 38px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0B2555')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              id="admin-login-submit"
              style={{
                width: '100%',
                backgroundColor: '#0B2555',
                color: '#ffffff',
                padding: '12px',
                fontSize: '14.5px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                marginTop: '8px',
              }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#081B3D')}
              onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#0B2555')}
            >
              <ShieldCheck size={18} />
              {submitting ? 'Verifying...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '14px 24px',
            textAlign: 'center',
            fontSize: '12.5px',
            color: '#64748B',
          }}
        >
          Protected school system &bull; Precious Pearls International School
        </div>
      </div>
    </div>
  )
}
