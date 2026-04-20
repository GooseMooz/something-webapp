import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Something — Volunteer in Metro Vancouver'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fefcf8',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        {/* Top: wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: '#2c1810',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ color: '#fefcf8', fontSize: 28, fontWeight: 700 }}>S</div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#2c1810', letterSpacing: '-0.5px' }}>
            Something
          </div>
        </div>

        {/* Middle: headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#2c1810',
              lineHeight: 1.05,
              letterSpacing: '-2px',
            }}
          >
            Do something
            <br />
            that matters.
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#6b4c3b',
              fontWeight: 400,
              maxWidth: 640,
              lineHeight: 1.4,
            }}
          >
            Volunteer opportunities across Metro Vancouver — one tap to apply.
          </div>
        </div>

        {/* Bottom: URL + location badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 22, color: '#9b7b6a', fontWeight: 500 }}>
            somethingmatters.ca
          </div>
          <div
            style={{
              background: '#f0e8d8',
              borderRadius: 100,
              padding: '10px 24px',
              fontSize: 20,
              color: '#6b4c3b',
              fontWeight: 600,
            }}
          >
            📍 Metro Vancouver, BC
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
