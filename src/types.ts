// SPDX-License-Identifier: Apache-2.0

export interface CoverData {
  title: string;
  subtitle: string;
  features: string[];
  ctaText: string;
  contacts: string;

  // Background config
  bgType: 'preset' | 'color' | 'gradient' | 'upload';
  bgPresetId: string;
  bgColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  bgGradientAngle: number;
  bgUploadDataUrl: string | null;
  bgZoom: number;
  bgBlur: number;

  // Typography and Styles
  fontTitle: 'Inter' | 'Space Grotesk' | 'JetBrains Mono' | 'Rubik' | 'Unbounded';
  fontBody: 'Inter' | 'JetBrains Mono' | 'Montserrat' | 'Roboto';
  accentColor: string;
  textColor: string;
  subtextColor: string;
  overlayOpacity: number;
  overlayColor: string;

  // Badges and layout
  badgeStyle: 'glow' | 'outline' | 'solid';
  layoutStyle: 'split' | 'centered' | 'left' | 'minimal';
  showMobileSafeLines: boolean;
  vkSimulationMode: 'none' | 'desktop' | 'mobile';
}

export interface PresetBackground {
  id: string;
  name: string;
  src: string;
  description: string;
}

export interface CoverTemplate {
  name: string;
  description: string;
  data: Partial<CoverData>;
  styleName: string;
}
