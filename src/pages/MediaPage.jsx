import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'image', 'video'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || '/api';
        const res = await fetch(`${apiBase}/media`);
        if (res.ok) {
          const data = await res.json();
          setMediaItems(data);
        } else {
          console.error('Failed to fetch media');
        }
      } catch (err) {
        console.error('Network error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'All') return true;
    return item.media_type === filter;
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <PageHeader title="School Media Gallery" breadcrumb="Media" />

      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
            {['All', 'image', 'video'].map(tab => {
              const isActive = filter === tab;
              const label = tab === 'image' ? 'Pictures' : tab === 'video' ? 'Videos' : 'All';
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    padding: '8px 24px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: isActive ? '#0B2555' : '#F1F5F9',
                    color: isActive ? '#ffffff' : '#475569',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Media Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Loading media...</div>
          ) : filteredMedia.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              No media available in this category.
            </div>
          ) : (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}
            >
              {filteredMedia.map(item => (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: '#F8F9FA',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    aspectRatio: '4/3',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  {item.media_type === 'video' ? (
                    <video 
                      src={item.storage_path} 
                      controls 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <img 
                      src={item.storage_path} 
                      alt={item.description || 'School Media'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  )}
                  {/* Optional Overlay/Play Icon for videos could go here */}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
