// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import type { PresetBackground } from '../types';

const PRESETS: PresetBackground[] = [
  {
    id: 'aurora',
    name: 'Аврора',
    src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1590&h=400&fit=crop',
    description: 'Северное сияние',
  },
  {
    id: 'city',
    name: 'Город',
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1590&h=400&fit=crop',
    description: 'Ночной город',
  },
  {
    id: 'nature',
    name: 'Природа',
    src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1590&h=400&fit=crop',
    description: 'Горный лес',
  },
  {
    id: 'abstract',
    name: 'Абстракция',
    src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1590&h=400&fit=crop',
    description: 'Цветные фигуры',
  },
  {
    id: 'tech',
    name: 'Технологии',
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1590&h=400&fit=crop',
    description: 'Печатная плата',
  },
  {
    id: 'ocean',
    name: 'Океан',
    src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1590&h=400&fit=crop',
    description: 'Морские волны',
  },
];

interface PresetBackgroundsProps {
  selectedId: string;
  onSelect: (preset: PresetBackground) => void;
}

export function PresetBackgrounds({ selectedId, onSelect }: PresetBackgroundsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-2">Выберите пресет</p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`relative overflow-hidden rounded-lg border-2 transition-colors ${
              selectedId === preset.id ? 'border-blue-500' : 'border-transparent hover:border-white/30'
            }`}
            style={{ height: 60 }}
          >
            <img
              src={preset.src}
              alt={preset.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <span className="text-white text-xs px-2 pb-1 font-medium">{preset.name}</span>
            </div>
            {selectedId === preset.id && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { PRESETS };
