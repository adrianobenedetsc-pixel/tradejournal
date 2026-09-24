import { useState } from 'react';
import { Trade } from '../types';
import { calculatePnL, saveTrade, generateId, POINT_VALUES } from '../utils';

interface AddTradeProps {
  onTradeAdded: () => void;
}

export default function AddTrade({ onTradeAdded }: AddTradeProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [instrument, setInstrument] = useState<'NQ' | 'ES'>('NQ');
  const [result, setResult] = useState<'Take' | 'Stop'>('Take');
  const [points, setPoints] = useState('');
  const [contracts, setContracts] = useState('1');
  const [showSuccess, setShowSuccess] = useState(false);

  const pts = parseFloat(points) || 0;
  const qty = parseInt(contracts) || 1;

  const { pnl, pnlPerContract } = pts > 0
    ? calculatePnL(instrument, result, pts, qty)
    : { pnl: 0, pnlPerContract: 0 };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pts) return;

    const trade: Trade = {
      id: generateId(),
      date,
      time,
      instrument,
      result,
      points: pts,
      contracts: qty,
      pnl,
      pnlPerContract,
    };

    saveTrade(trade);
    onTradeAdded();

    setPoints('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Novo Trade</h1>
        <p className="text-[#86868b] text-base mt-2">Registre rápido e siga em frente</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-[#34c759]/8 border border-[#34c759]/15 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-[#34c759] rounded-full"></div>
          <span className="text-[#248a3d] text-sm font-medium">Trade registrado com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">Data</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">Horário</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Instrument */}
        <div>
          <label className="block text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">Instrumento</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInstrument('NQ')}
              className={`py-4 px-5 rounded-2xl border-2 transition-all ${
                instrument === 'NQ'
                  ? 'border-[#0071e3] bg-[#0071e3]/5 shadow-sm'
                  : 'border-[#d2d2d7] bg-white hover:border-[#aeaeb2] shadow-sm'
              }`}
            >
              <div className={`text-lg font-semibold ${instrument === 'NQ' ? 'text-[#0071e3]' : 'text-[#1d1d1f]'}`}>NQ</div>
              <div className="text-[10px] text-[#86868b] mt-0.5">${POINT_VALUES.NQ}/ponto</div>
            </button>
            <button
              type="button"
              onClick={() => setInstrument('ES')}
              className={`py-4 px-5 rounded-2xl border-2 transition-all ${
                instrument === 'ES'
                  ? 'border-[#0071e3] bg-[#0071e3]/5 shadow-sm'
                  : 'border-[#d2d2d7] bg-white hover:border-[#aeaeb2] shadow-sm'
              }`}
            >
              <div className={`text-lg font-semibold ${instrument === 'ES' ? 'text-[#0071e3]' : 'text-[#1d1d1f]'}`}>ES</div>
              <div className="text-[10px] text-[#86868b] mt-0.5">${POINT_VALUES.ES}/ponto</div>
            </button>
          </div>
        </div>

        {/* Result */}
        <div>
          <label className="block text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">Resultado</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setResult('Take')}
              className={`py-3.5 rounded-2xl border-2 transition-all font-medium text-sm ${
                result === 'Take'
                  ? 'border-[#34c759] bg-[#34c759]/5 text-[#248a3d] shadow-sm'
                  : 'border-[#d2d2d7] bg-white text-[#1d1d1f] hover:border-[#aeaeb2] shadow-sm'
              }`}
            >
              ✓ Take
            </button>
            <button
              type="button"
              onClick={() => setResult('Stop')}
              className={`py-3.5 rounded-2xl border-2 transition-all font-medium text-sm ${
                result === 'Stop'
                  ? 'border-[#ff3b30] bg-[#ff3b30]/5 text-[#c41e3a] shadow-sm'
                  : 'border-[#d2d2d7] bg-white text-[#1d1d1f] hover:border-[#aeaeb2] shadow-sm'
              }`}
            >
              ✕ Stop
            </button>
          </div>
        </div>

        {/* Points & Contracts */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">Pontos</label>
            <input
              type="number"
              step="0.25"
              min="0"
              value={points}
              onChange={e => setPoints(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">Contratos</label>
            <input
              type="number"
              min="1"
              value={contracts}
              onChange={e => setContracts(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {/* PnL Preview */}
        {pts > 0 && (
          <div className="p-5 bg-gradient-to-br from-white to-[#f5f5f7] rounded-2xl border border-[#d2d2d7] shadow-sm">
            <div className="text-[10px] text-[#86868b] uppercase tracking-wider mb-2">Resultado</div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-semibold ${pnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
                {pnl >= 0 ? '+' : ''}{pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </span>
              <span className="text-xs text-[#86868b]">
                ({pnlPerContract >= 0 ? '+' : ''}${pnlPerContract.toFixed(2)}/ct)
              </span>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!pts}
          className="w-full py-4 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0068d7] disabled:bg-[#d2d2d7] disabled:text-[#86868b] text-white font-medium rounded-2xl transition-all shadow-sm active:scale-[0.98] text-sm"
        >
          Registrar Trade
        </button>
      </form>
    </div>
  );
}
