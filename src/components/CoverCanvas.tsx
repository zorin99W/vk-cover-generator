// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useEffect } from 'react';
import type { CoverData } from '../types';

interface CoverCanvasProps {
  coverData: CoverData;
  scale?: number;
}

const COVER_WIDTH = 1590;
const COVER_HEIGHT = 400;

function getBackground(data: CoverData): string {
  if (data.bgType === 'color') return data.bgColor;
  if (data.bgType === 'gradient') {
    return `linear-gradient(${data.bgGradientAngle}deg, ${data.bgGradientStart}, ${data.bgGradientEnd})`;
  }
  return data.bgColor;
}

export function CoverCanvas({ coverData, scale = 1 }: CoverCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const bg = getBackground(coverData);
  const hasImage = coverData.bgType === 'upload' && coverData.bgUploadDataUrl;

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: coverData.overlayColor,
    opacity: coverData.overlayOpacity,
    zIndex: 1,
  };

  const containerStyle: React.CSSProperties = {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    background: hasImage ? undefined : bg,
    fontFamily: coverData.fontBody,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '40px 80px',
    gap: '60px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: coverData.fontTitle,
    color: coverData.textColor,
    fontSize: '52px',
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: '12px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: coverData.subtextColor,
    fontSize: '22px',
    lineHeight: 1.4,
    marginBottom: '20px',
  };

  const ctaStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: coverData.accentColor,
    color: '#fff',
    padding: '12px 28px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 600,
    boxShadow: coverData.badgeStyle === 'glow' ? `0 0 24px ${coverData.accentColor}88` : undefined,
  };

  const mobileLineStyle = (top: number): React.CSSProperties => ({
    position: 'absolute',
    top,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 5,
    pointerEvents: 'none',
  });

  return (
    <div ref={containerRef} style={containerStyle}>
      {hasImage && (
        <img
          src={coverData.bgUploadDataUrl!}
          alt="background"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${coverData.bgZoom / 100})`,
            filter: coverData.bgBlur > 0 ? `blur(${coverData.bgBlur}px)` : undefined,
            zIndex: 0,
          }}
        />
      )}
      <div style={overlayStyle} />
      {coverData.showMobileSafeLines && (
        <>
          <div style={mobileLineStyle(0)} />
          <div style={mobileLineStyle(398)} />
        </>
      )}
      <div style={contentStyle}>
        <div style={{ flex: 1 }}>
          <h1 style={titleStyle}>{coverData.title}</h1>
          {coverData.subtitle && <p style={subtitleStyle}>{coverData.subtitle}</p>}
          {coverData.features.length > 0 && (
            <ul style={{ listStyle: 'none', marginBottom: '16px' }}>
              {coverData.features.map((f, i) => (
                <li key={i} style={{ color: coverData.subtextColor, fontSize: '16px', marginBottom: '4px' }}>
                  <span style={{ color: coverData.accentColor, marginRight: '8px' }}>•</span>{f}
                </li>
              ))}
            </ul>
          )}
          {coverData.ctaText && <span style={ctaStyle}>{coverData.ctaText}</span>}
        </div>
        {coverData.contacts && (
          <div style={{ color: coverData.subtextColor, fontSize: '16px', textAlign: 'right', whiteSpace: 'pre-line' }}>
            {coverData.contacts}
          </div>
        )}
      </div>
    </div>
  );
}
