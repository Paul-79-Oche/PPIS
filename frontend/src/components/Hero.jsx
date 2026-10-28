import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import heroSlide1 from '../assets/Library_slide3.png'
import heroSlide2 from '../assets/hero_slide2.png'
import heroSlide3 from '../assets/hero_bg.jpg'

const slides = [
  {
    image: heroSlide1,
    headline: (
      <>
        Welcome to<br />
        Precious Pearls<br />
        International School
      </>
    ),
    subtext: (
      <>
        Nurturing young minds, building<br />bright futures.
      </>
    ),
  },
  {
    image: heroSlide2,
    headline: (
      <>
        Excellence in<br />
        Academics &amp;<br />
        Character
      </>
    ),
    subtext: (
      <>
        Empowering students to reach their<br />highest potential.
      </>
    ),
  },
  {
    image: heroSlide3,
    headline: (
      <>
        A Conducive<br />
        Environment for<br />
        Learning
      </>
    ),
    subtext: (
      <>
        Inspiring curiosity, leadership, and<br />lifelong excellence.
      </>
    ),
  },
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Automatic slide transition every 5 seconds
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) {
      nextSlide()
    } else if (diff < -50) {
      prevSlide()
    }
  }

  return (
    <section
      id="hero"
      aria-label="PPIS Hero Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#0B2555',
      }}
    >
      {/* ── Sliding Background Track (Slides left) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          width: `${slides.length * 100}%`,
          height: '100%',
          transform: `translateX(-${currentIndex * (100 / slides.length)}%)`,
          transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              width: `${100 / slides.length}%`,
              height: '100%',
              flexShrink: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
      </div>

      {/* ── Dark Overlay — strong on left, fades right ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5,18,50,0.92) 0%, rgba(8,27,65,0.80) 45%, rgba(11,37,85,0.25) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Navigation Arrows ─────────────────────────── */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(5, 18, 50, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.85)'
          e.currentTarget.style.borderColor = '#ffffff'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(5, 18, 50, 0.55)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(5, 18, 50, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.85)'
          e.currentTarget.style.borderColor = '#ffffff'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(5, 18, 50, 0.55)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Content ──────────────────────────────────── */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '80px',
          paddingBottom: '64px',
        }}
      >
        <div style={{ maxWidth: '540px' }}>
          {/* Animated Headline */}
          <h1
            key={`headline-${currentIndex}`}
            style={{
              color: '#ffffff',
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '14px',
              textShadow: '0 2px 16px rgba(0,0,0,0.5)',
              animation: 'heroTextFade 0.6s ease-out forwards',
            }}
          >
            {slides[currentIndex].headline}
          </h1>

          {/* Animated Sub-text */}
          <p
            key={`subtext-${currentIndex}`}
            style={{
              color: 'rgba(255,255,255,0.92)',
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: 1.65,
              marginBottom: '28px',
              animation: 'heroTextFade 0.6s ease-out forwards',
            }}
          >
            {slides[currentIndex].subtext}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              to="/about"
              id="hero-learn-more-btn"
              style={{
                backgroundColor: '#2563EB',
                color: '#ffffff',
                padding: '11px 28px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'background-color 0.2s, transform 0.2s',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Learn More
            </Link>
            <Link
              to="/admission"
              id="hero-admission-btn"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '9px 26px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                border: '2px solid rgba(255,255,255,0.85)',
                transition: 'background-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Admission
            </Link>
          </div>

          {/* Slide Dot Indicators */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '36px',
              alignItems: 'center',
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === currentIndex ? '30px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: i === currentIndex ? '#3B82F6' : 'rgba(255,255,255,0.45)',
                  border: 'none',
                  padding: 0,
                  transition: 'all 0.35s ease',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
