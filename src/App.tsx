// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import { CoverCanvas } from './components/CoverCanvas';
import { ControlPanel } from './components/ControlPanel';
import { AIGenerator } from './components/AIGenerator';
import { PresetBackgrounds } from './components/PresetBackgrounds';
import { useCoverData } from './hooks/useCoverData';
import type { CoverData, PresetBackground } from './types';

type Tab = 'settings' | 'ai' | 'presets';

const SCALE = 0.38;

export default function App() {
  const { coverData, updateCover, resetCover } = useCoverData();
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handlePresetSelect = (preset: PresetBackground) => {
    updateCover({
      bgType: 'preset',
      bgPresetId: preset.id,
      bgUploadDataUrl: preset.src,
    });
  };

  const handleDownload = async () => {
    const { default: html2canvas } = await import('html2canvas').catch(() => ({ default: null }));
    if (!html2canvas || !canvasContainerRef.current) {
      alert('Скачивание недоступно. Сделайте скриншот обложки вручную.');
      return;
    }
    const canvas = await html2canvas(canvasContainerRef.current, { scale: 1 / SCALE, useCORS: true });
    const link = document.createElement('a');
    link.download = 'vk-cover.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const tabCls = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
      activeTab === t
        ? 'bg-white/10 text-white border-b-2 border-blue-500'
        : 'text-gray-400 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="4" width="14" height="8" rx="2" stroke="white" strokeWidth="1.5"/>
              <path d="M5 8h6M8 6v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg">VK Cover Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Скачать PNG
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="border-r border-white/10 flex flex-col" style={{ width: 340 }}>
          <div className="flex border-b border-white/10">
            <button className={tabCls('settings')} onClick={() => setActiveTab('settings')}>Настройки</button>
            <button className={tabCls('ai')} onClick={() => setActiveTab('ai')}>AI</button>
            <button className={tabCls('presets')} onClick={() => setActiveTab('presets')}>Пресеты</button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {activeTab === 'settings' && (
              <ControlPanel coverData={coverData} onChange={updateCover} onReset={resetCover} />
            )}
            {activeTab === 'ai' && (
              <div className="p-4">
                <AIGenerator onApply={updateCover} />
              </div>
            )}
            {activeTab === 'presets' && (
              <div className="p-4">
                <PresetBackgrounds
                  selectedId={coverData.bgPresetId}
                  onSelect={handlePresetSelect}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Canvas area */}
        <main className="flex-1 flex flex-col items-center justify-center bg-[#111] overflow-auto p-8">
          <div className="mb-4 text-xs text-gray-500">1590 × 400 px (обложка VK)</div>
          <div
            className="shadow-2xl"
            style={{
              width: 1590 * SCALE,
              height: 400 * SCALE,
              overflow: 'hidden',
            }}
          >
            <div ref={canvasContainerRef}>
              <CoverCanvas coverData={coverData} scale={SCALE} />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-600">Предпросмотр (38%)</div>
        </main>
      </div>
    </div>
  );
}
