'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import CardStack from '@/components/discover/CardStack';
import ActionButtons from '@/components/discover/ActionButtons';
import { type MatchProfile } from '@/components/discover/MatchCard';

const FILTERS = ['Todos', 'Match perfecto', 'Cerca de mí', 'Más intercambios'];

const MOCK_PROFILES: MatchProfile[] = [
  {
    name: 'Carlos M.', initials: 'CM', city: 'Lima',
    completion: 62, score: 9, perfect: true, colorIndex: 0,
    give: ['ARG17', 'BRA9', 'FRA20', 'MEX3', 'ENG14'],
    get:  ['ESP15', 'GER11', 'COL14'],
  },
  {
    name: 'Sofía R.', initials: 'SR', city: 'Bogotá',
    completion: 48, score: 6, perfect: false, colorIndex: 1,
    give: ['POR10', 'NED11', 'BRA7'],
    get:  ['ARG3', 'FRA15', 'MEX12'],
  },
  {
    name: 'Diego V.', initials: 'DV', city: 'Ciudad de México',
    completion: 71, score: 11, perfect: false, colorIndex: 2,
    give: ['ESP7', 'ARG4', 'GER9', 'FRA8', 'BRA14'],
    get:  ['MEX1', 'COL5', 'POR3', 'NED6'],
  },
];

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [cardKey, setCardKey]           = useState(0);

  const handleAction = (dir: 'left' | 'right') => {
    // Programmatic swipe — the CardStack handles visual
    // We just reset in a real app; for now this triggers via buttons
  };

  return (
    <div className="relative min-h-screen pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.18em] font-body" style={{ color: '#FAC71E' }}>
            INTERCAMBIO
          </span>
          <span className="font-display text-[26px] leading-none" style={{ color: '#f0eee8' }}>
            ENCONTRAR MATCH
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-display text-[28px] leading-none" style={{ color: '#FAC71E' }}>
            {MOCK_PROFILES.length}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
            MATCHES
          </span>
        </div>
      </div>

      {/* Filter pills */}
      <div
        className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide"
      >
        {FILTERS.map(f => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              id={`discover-filter-${f.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 text-[11px] font-body font-medium px-3 py-1 card-hover-transition"
              style={{
                borderRadius: '99px',
                background: active ? '#FAC71E' : 'transparent',
                border: active ? '0.5px solid #FAC71E' : '0.5px solid rgba(255,255,255,0.12)',
                color: active ? '#0a0a0f' : 'rgba(240,238,232,0.25)',
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Card stack */}
      <CardStack key={cardKey} profiles={MOCK_PROFILES} />

      {/* Action buttons */}
      <ActionButtons
        onSkip={() => setCardKey(k => k + 1)}
        onReject={() => {}}
        onAccept={() => {}}
        onSuper={() => {}}
      />
    </div>
  );
}
