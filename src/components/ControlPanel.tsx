// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import type { CoverData } from '../types';

interface ControlPanelProps {
  coverData: CoverData;
  onChange: (updates: Partial<CoverData>) => void;
  onReset: () => void;
}

const FONT_TITLES = ['Inter', 'Space Grotesk', 'JetBrains Mono', 'Rubik', 'Unbounded'];
const FONT_BODIES = ['Inter', 'JetBrains Mono', 'Montserrat', 'Roboto'];
const LAYOUT_STYLES = ['split', 'centered', 'left', 'minimal'] as const;
const BADGE_STYLES = ['glow', 'outline', 'solid'] as const;

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">{children}</label>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-white mb-3 border-b border-white/10 pb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function ControlPanel({ coverData, onChange, onReset }: ControlPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ bgUploadDataUrl: ev.target?.result as string, bgType: 'upload' });
    reader.readAsDataURL(file);
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500";
  const selectCls = "w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500";

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-4 text-white" style={{ minWidth: 300, maxWidth: 340 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold">Настройки</h2>
        <button onClick={onReset} className="text-xs text-gray-400 hover:text-white transition-colors">Сброс</button>
      </div>

      <Section title="Текст">
        <div>
          <Label>Заголовок</Label>
          <input className={inputCls} value={coverData.title} onChange={e => onChange({ title: e.target.value })} />
        </div>
        <div>
          <Label>Подзаголовок</Label>
          <input className={inputCls} value={coverData.subtitle} onChange={e => onChange({ subtitle: e.target.value })} />
        </div>
        <div>
          <Label>CTA кнопка</Label>
          <input className={inputCls} value={coverData.ctaText} onChange={e => onChange({ ctaText: e.target.value })} />
        </div>
        <div>
          <Label>Контакты</Label>
          <textarea className={inputCls} rows={2} value={coverData.contacts} onChange={e => onChange({ contacts: e.target.value })} />
        </div>
      </Section>

      <Section title="Фон">
        <div>
          <Label>Тип фона</Label>
          <select className={selectCls} value={coverData.bgType} onChange={e => onChange({ bgType: e.target.value as CoverData['bgType'] })}>
            <option value="gradient">Градиент</option>
            <option value="color">Цвет</option>
            <option value="preset">Пресет</option>
            <option value="upload">Изображение</option>
          </select>
        </div>
        {coverData.bgType === 'color' && (
          <div>
            <Label>Цвет фона</Label>
            <input type="color" className="h-8 w-full rounded cursor-pointer" value={coverData.bgColor} onChange={e => onChange({ bgColor: e.target.value })} />
          </div>
        )}
        {coverData.bgType === 'gradient' && (
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Начало</Label>
              <input type="color" className="h-8 w-full rounded cursor-pointer" value={coverData.bgGradientStart} onChange={e => onChange({ bgGradientStart: e.target.value })} />
            </div>
            <div className="flex-1">
              <Label>Конец</Label>
              <input type="color" className="h-8 w-full rounded cursor-pointer" value={coverData.bgGradientEnd} onChange={e => onChange({ bgGradientEnd: e.target.value })} />
            </div>
            <div className="w-20">
              <Label>Угол</Label>
              <input type="number" className={inputCls} min={0} max={360} value={coverData.bgGradientAngle} onChange={e => onChange({ bgGradientAngle: Number(e.target.value) })} />
            </div>
          </div>
        )}
        {coverData.bgType === 'upload' && (
          <div>
            <Label>Изображение</Label>
            <button onClick={() => fileRef.current?.click()} className="w-full border border-dashed border-white/20 rounded py-2 text-sm text-gray-400 hover:border-blue-500 hover:text-white transition-colors">Выбрать файл</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        )}
        <div>
          <Label>Оверлей цвет</Label>
          <input type="color" className="h-8 w-full rounded cursor-pointer" value={coverData.overlayColor} onChange={e => onChange({ overlayColor: e.target.value })} />
        </div>
        <div>
          <Label>Оверлей прозрачность: {Math.round(coverData.overlayOpacity * 100)}%</Label>
          <input type="range" min={0} max={1} step={0.01} className="w-full" value={coverData.overlayOpacity} onChange={e => onChange({ overlayOpacity: Number(e.target.value) })} />
        </div>
      </Section>

      <Section title="Типографика">
        <div>
          <Label>Шрифт заголовка</Label>
          <select className={selectCls} value={coverData.fontTitle} onChange={e => onChange({ fontTitle: e.target.value as CoverData['fontTitle'] })}>
            {FONT_TITLES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <Label>Шрифт текста</Label>
          <select className={selectCls} value={coverData.fontBody} onChange={e => onChange({ fontBody: e.target.value as CoverData['fontBody'] })}>
            {FONT_BODIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label>Цвет текста</Label>
            <input type="color" className="h-8 w-full rounded cursor-pointer" value={coverData.textColor} onChange={e => onChange({ textColor: e.target.value })} />
          </div>
          <div className="flex-1">
            <Label>Цвет подтекста</Label>
            <input type="color" className="h-8 w-full rounded cursor-pointer" value={coverData.subtextColor} onChange={e => onChange({ subtextColor: e.target.value })} />
          </div>
          <div className="flex-1">
            <Label>Акцент</Label>
            <input type="color" className="h-8 w-full rounded cursor-pointer" value={coverData.accentColor} onChange={e => onChange({ accentColor: e.target.value })} />
          </div>
        </div>
      </Section>

      <Section title="Макет">
        <div>
          <Label>Макет</Label>
          <select className={selectCls} value={coverData.layoutStyle} onChange={e => onChange({ layoutStyle: e.target.value as CoverData['layoutStyle'] })}>
            {LAYOUT_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label>Стиль бейджа</Label>
          <select className={selectCls} value={coverData.badgeStyle} onChange={e => onChange({ badgeStyle: e.target.value as CoverData['badgeStyle'] })}>
            {BADGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="mobileLines" checked={coverData.showMobileSafeLines} onChange={e => onChange({ showMobileSafeLines: e.target.checked })} />
          <label htmlFor="mobileLines" className="text-sm text-gray-300">Показать mobile зону</label>
        </div>
      </Section>
    </div>
  );
}
