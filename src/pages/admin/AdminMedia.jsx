import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Upload, Trash2, Image as ImageIcon, Video, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminMedia() {
  const { getAuthHeaders, apiBaseUrl } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [mediaList, setMediaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(searchParams.get('action') === 'upload')
  const [deletingId, setDeletingId] = useState(null)

  // Upload Form State
  const [uploadFile, setUploadFile] = useState(null)
  const [mediaType, setMediaType] = useState('image')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/media`)
      if (res.ok) {
        const data = await res.json()
        setMediaList(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Error fetching media:', err)
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!uploadFile) {
      setFormError('Please select a file to upload.')
      return
    }

    setUploading(true)
    setFormError('')
    setSuccessMsg('')

    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('media_type', mediaType)
    formData.append('description', description)

    try {
      const res = await fetch(`${apiBaseUrl}/media`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload media.')
      }

      setSuccessMsg('Media uploaded successfully!')
      setUploadFile(null)
      setDescription('')
      fetchMedia()
      setTimeout(() => {
        setModalOpen(false)
        setSuccessMsg('')
        searchParams.delete('action')
        setSearchParams(searchParams)
      }, 1200)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item? This cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`${apiBaseUrl}/media/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to delete media.')
      } else {
        setMediaList((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (err) {
      console.error('Error deleting media:', err)
      alert('Network error while deleting media.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredMedia = mediaList.filter((item) => {
    if (filter === 'All') return true
    return item.media_type === filter
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
            School Media Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
            Upload, preview, and delete pictures and videos displayed on the public PPIS Media Gallery.
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
          <Upload size={16} /> Upload New Media
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['All', 'image', 'video'].map((tab) => {
          const isActive = filter === tab
          const label = tab === 'image' ? 'Pictures' : tab === 'video' ? 'Videos' : 'All Media'
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 18px',
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
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Media Grid ─────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
          Loading media items...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px dashed #CBD5E1',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#64748B',
          }}
        >
          <ImageIcon size={40} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            No media items found
          </h3>
          <p style={{ fontSize: '13.5px', margin: '0 0 16px' }}>
            Click &ldquo;Upload New Media&rdquo; to add school pictures or videos.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Media Preview Container */}
              <div
                style={{
                  position: 'relative',
                  height: '180px',
                  backgroundColor: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {item.media_type === 'video' ? (
                  <video
                    src={item.storage_path}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    src={item.storage_path}
                    alt={item.description || 'School Media'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(11, 37, 85, 0.85)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {item.media_type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                  {item.media_type}
                </div>
              </div>

              {/* Media Info & Delete */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#1E293B',
                      fontWeight: 500,
                      margin: '0 0 8px',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.description || 'No caption provided'}
                  </p>
                  <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                    Uploaded on {item.upload_date ? new Date(item.upload_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: 500,
                      cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FECACA')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                  >
                    <Trash2 size={13} />
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Modal ────────────────────────────────────── */}
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
              maxWidth: '500px',
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
                Upload School Media
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
            <form onSubmit={handleUploadSubmit} style={{ padding: '24px' }}>
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

              {/* Media Type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Media Type
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                >
                  <option value="image">Picture (JPG, PNG, WebP)</option>
                  <option value="video">Video (MP4, WebM)</option>
                </select>
              </div>

              {/* File Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Select File
                </label>
                <input
                  type="file"
                  required
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setUploadFile(e.target.files[0] || null)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '13px',
                    border: '1px dashed #CBD5E1',
                    borderRadius: '8px',
                    backgroundColor: '#F8FAFC',
                  }}
                />
              </div>

              {/* Caption / Description */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                  Description / Caption
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Annual Inter-house Sports Day 2025"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
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
                  disabled={uploading}
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
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.75 : 1,
                  }}
                >
                  <Upload size={15} />
                  {uploading ? 'Uploading to Storage...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
