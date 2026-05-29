'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type QuantityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  stickerId: string;
  stickerName: string;
  initialQuantity: number;
  onSave: (quantity: number) => void;
  onSetStatus: (status: 'owned' | 'wanted') => void;
};

export default function QuantityModal({
  isOpen,
  onClose,
  stickerId,
  stickerName,
  initialQuantity,
  onSave,
  onSetStatus,
}: QuantityModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity);
    }
  }, [isOpen, initialQuantity]);

  if (!isOpen || !mounted) return null;

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      style={{
        background: 'rgba(5, 5, 8, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#0e0e16] border-t sm:border border-[rgba(255,255,255,0.08)] rounded-t-3xl sm:rounded-2xl p-6 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Handle for drag indicator on mobile */}
        <div className="flex justify-center sm:hidden mb-4">
          <div className="w-12 h-1 bg-[rgba(240,238,232,0.15)] rounded-full" />
        </div>

        {/* Sticker Info */}
        <div className="text-center mb-6">
          <span
            className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-0.5 mb-2"
            style={{
              background: 'rgba(250, 199, 30, 0.15)',
              border: '0.5px solid rgba(250, 199, 30, 0.3)',
              color: '#FAC71E',
              borderRadius: '6px',
            }}
          >
            REPETIDA
          </span>
          <h3 className="font-display text-[28px] leading-none text-[#f0eee8] mb-1">
            {stickerId}
          </h3>
          <p className="text-[12px] text-[rgba(240,238,232,0.4)] truncate px-4">
            {stickerName}
          </p>
        </div>

        {/* Quantity Stepper */}
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-[11px] uppercase tracking-wider text-[rgba(240,238,232,0.25)] mb-3">
            ¿Cuántas repetidas tienes?
          </span>
          <div className="flex items-center gap-6">
            <button
              onClick={handleDecrement}
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-[22px] transition-all border border-[rgba(255,255,255,0.08)] text-[rgba(240,238,232,0.8)] hover:bg-[rgba(255,255,255,0.04)] active:scale-95"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              -
            </button>
            <div className="w-20 text-center select-none">
              <span className="font-display text-[42px] leading-none text-[#FAC71E]">
                {quantity}
              </span>
              <span className="block text-[10px] text-[rgba(250,199,30,0.5)] mt-0.5">
                copia{quantity > 1 ? 's' : ''} extra{quantity > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={handleIncrement}
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-[22px] transition-all border border-[rgba(255,255,255,0.08)] text-[rgba(240,238,232,0.8)] hover:bg-[rgba(255,255,255,0.04)] active:scale-95"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => {
              onSave(quantity);
              onClose();
            }}
            className="w-full py-3 rounded-xl font-body font-semibold text-sm transition-all active:scale-[0.98]"
            style={{
              background: '#FAC71E',
              color: '#0a0a0f',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Guardar cantidad
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => {
                onSetStatus('owned');
                onClose();
              }}
              className="py-2.5 rounded-xl font-body font-medium text-[12px] text-[#4ade80] border border-[rgba(74,222,128,0.2)] hover:bg-[rgba(74,222,128,0.05)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(74,222,128,0.02)', cursor: 'pointer' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Marcar pegada
            </button>
            <button
              onClick={() => {
                onSetStatus('wanted');
                onClose();
              }}
              className="py-2.5 rounded-xl font-body font-medium text-[12px] text-[#fb7185] border border-[rgba(251,113,133,0.2)] hover:bg-[rgba(251,113,133,0.05)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(251,113,133,0.02)', cursor: 'pointer' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Marcar faltante
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 mt-2 rounded-xl font-body text-xs text-[rgba(240,238,232,0.4)] hover:text-[rgba(240,238,232,0.8)] transition-all"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
