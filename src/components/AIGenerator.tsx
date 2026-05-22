// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import type { CoverData } from '../types';

interface AIGeneratorProps {
  onApply: (updates: Partial<CoverData>) => void;
}

const TONES = ['профессиональный', 'дружелюбный', 'энергичный', 'минималистичный', 'инспирирующий'];

export function AIGenerator({ onApply }: AIGeneratorProps) {
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; subtitle: string; ctaText: string } | null>(null);

  const generate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/slogans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, tone }),
      });
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const data = await res.json();
      const r = {
        title: data.title || data.titles?.[0] || '',
        subtitle: data.subtitle || data.subtitles?.[0] || '',
        ctaText: data.cta || data.ctaText || '',
      };
      setResult(r);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApply({ title: result.title, subtitle: result.subtitle, ctaText: result.ctaText });
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500";
  const selectCls = "w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <span className="text-blue-400">✨</span> AI генерация текста
      </h3>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Ключевые слова</label>
        <input
          className={inputCls}
          placeholder="например: фитнес, спорт, здоровье..."
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Тон</label>
        <select className={selectCls} value={tone} onChange={e => setTone(e.target.value)}>
          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <button
        onClick={generate}
        disabled={loading || !keywords.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm font-medium transition-colors"
      >
        {loading ? 'Генерация...' : 'Сгенерировать'}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {result && (
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <div>
            <span className="text-xs text-gray-400">Заголовок: </span>
            <span className="text-sm text-white">{result.title}</span>
          </div>
          {result.subtitle && (
            <div>
              <span className="text-xs text-gray-400">Подзаголовок: </span>
              <span className="text-sm text-white">{result.subtitle}</span>
            </div>
          )}
          {result.ctaText && (
            <div>
              <span className="text-xs text-gray-400">CTA: </span>
              <span className="text-sm text-white">{result.ctaText}</span>
            </div>
          )}
          <button
            onClick={handleApply}
            className="w-full mt-1 border border-blue-500 text-blue-400 hover:bg-blue-500/20 rounded py-1.5 text-xs font-medium transition-colors"
          >
            Применить
          </button>
        </div>
      )}
    </div>
  );
}
