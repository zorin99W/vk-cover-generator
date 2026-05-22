// SPDX-License-Identifier: Apache-2.0
import { useState, useCallback } from 'react';
import type { CoverData } from '../types';

const DEFAULT_COVER: CoverData = {
  title: 'Моё сообщество',
  subtitle: 'Добро пожаловать!',
  features: [],
  ctaText: '',
  contacts: '',
  bgType: 'gradient',
  bgPresetId: '',
  bgColor: '#1a1a2e',
  bgGradientStart: '#1a1a2e',
  bgGradientEnd: '#16213e',
  bgGradientAngle: 135,
  bgUploadDataUrl: null,
  bgZoom: 100,
  bgBlur: 0,
  fontTitle: 'Inter',
  fontBody: 'Inter',
  accentColor: '#0077ff',
  textColor: '#ffffff',
  subtextColor: '#cccccc',
  overlayOpacity: 0.4,
  overlayColor: '#000000',
  badgeStyle: 'glow',
  layoutStyle: 'split',
  showMobileSafeLines: false,
  vkSimulationMode: 'none',
};

export function useCoverData() {
  const [coverData, setCoverData] = useState<CoverData>(DEFAULT_COVER);

  const updateCover = useCallback((updates: Partial<CoverData>) => {
    setCoverData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetCover = useCallback(() => {
    setCoverData(DEFAULT_COVER);
  }, []);

  return { coverData, updateCover, resetCover };
}
