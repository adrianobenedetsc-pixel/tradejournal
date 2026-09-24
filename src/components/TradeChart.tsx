import { useMemo } from 'react';
import { Trade } from '../types';
import { formatCurrency } from '../utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceDot
} from 'recharts';

interface TradeChartProps {
  trades: Trade[];
}

export default function TradeChart({ trades }: TradeChartProps) {
  const { chartData, maxPoint, minPoint } = useMemo(() => {
    let cumulative = 0;
    const data = trades.map((trade, index) => {
      cumulative += trade.pnl;
      return {
        index: index + 1,
        pnl: trade.pnl,
        cumulative: Math.round(cumulative * 100) / 100,
        instrument: trade.instrument,
        result: trade.result,
        points: trade.points,
        contracts: trade.contracts,
      };
    });

    let max = data[0];
    let min = data[0];
    data.forEach(d => {
      if (d.cumulative > max.cumulative) max = d;
      if (d.cumulative < min.cumulative) min = d;
    });

    return { chartData: data, maxPoint: max, minPoint: min };
  }, [trades]);

  const totalPnl = useMemo(() => trades.reduce((s, t) => s + t.pnl, 0), [trades]);
  const winRate = useMemo(() => {
    if (trades.length === 0) return 0;
    return (trades.filter(t => t.pnl > 0).length / trades.length) * 100;
  }, [trades]);

  if (trades.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-[#86868b] text-sm tracking-[0.3em] uppercase">Nenhum trade registrado</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-2xl border border-[#d2d2d7] px-4 py-3 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#86868b] text-[10px] tracking-wider uppercase">Trade</span>
            <span className="text-[#1d1d1f] text-xs font-medium">#{data.index}</span>
            <span className="text-[#d2d2d7]">•</span>
            <span className="text-[#86868b] text-xs">{data.instrument}</span>
            <span className="text-[#d2d2d7]">•</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              data.result === 'Take' ? 'bg-[#34c759]/10 text-[#248a3d]' : 'bg-[#ff3b30]/10 text-[#c41e3a]'
            }`}>
              {data.result}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`text-lg font-semibold tabular-nums ${data.pnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
              {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl)}
            </span>
            <span className="text-[#86868b] text-[10px]">
              {data.points} pts × {data.contracts}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#e5e5ea] flex items-baseline gap-2">
            <span className="text-[#86868b] text-[10px] uppercase tracking-wider">Acumulado</span>
            <span className={`text-sm font-medium tabular-nums ${data.cumulative >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
              {data.cumulative >= 0 ? '+' : ''}{formatCurrency(data.cumulative)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Performance</h1>
        <p className="text-[#86868b] text-base mt-2">Evolução trade a trade</p>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-3xl border border-[#d2d2d7] shadow-sm overflow-hidden">
        {/* Chart Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#e5e5ea]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#86868b] text-[10px] tracking-[0.3em] uppercase mb-2">Equity Curve</p>
              <h2 className="text-[#1d1d1f] text-3xl font-light">
                {trades.length} <span className="text-[#86868b] text-xl">trades</span>
              </h2>
              <p className="text-[#86868b] text-xs mt-2">
                {winRate.toFixed(0)}% win rate • {trades.length > 0 ? new Date(trades[0].date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : ''} — {trades.length > 0 ? new Date(trades[trades.length - 1].date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#86868b] text-[10px] tracking-[0.3em] uppercase mb-1">Net P&L</p>
              <p className={`text-4xl font-light tabular-nums ${totalPnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 pt-6 pb-4 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 6" 
                stroke="#e5e5ea" 
                vertical={false}
              />

              <XAxis 
                dataKey="index" 
                tick={{ fontSize: 10, fill: '#86868b' }} 
                axisLine={false} 
                tickLine={false}
                interval="preserveStartEnd"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#86868b' }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(v) => `$${v}`}
                width={70}
                domain={['auto', 'auto']}
              />

              <ReferenceLine 
                y={0} 
                stroke="#d2d2d7" 
                strokeDasharray="4 4"
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d2d2d7', strokeWidth: 1 }} />

              <Line 
                type="linear" 
                dataKey="cumulative" 
                stroke={totalPnl >= 0 ? '#34c759' : '#ff3b30'}
                strokeWidth={1.5}
                dot={{ 
                  r: 3, 
                  fill: totalPnl >= 0 ? '#34c759' : '#ff3b30',
                  stroke: totalPnl >= 0 ? '#34c759' : '#ff3b30',
                  strokeWidth: 0,
                }}
                activeDot={{ 
                  r: 5, 
                  fill: totalPnl >= 0 ? '#34c759' : '#ff3b30',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />

              {/* Max marker */}
              {maxPoint && (
                <ReferenceDot
                  x={maxPoint.index}
                  y={maxPoint.cumulative}
                  r={4}
                  fill="#34c759"
                  stroke="#34c759"
                  strokeWidth={0}
                />
              )}

              {/* Min marker */}
              {minPoint && minPoint.cumulative < 0 && (
                <ReferenceDot
                  x={minPoint.index}
                  y={minPoint.cumulative}
                  r={4}
                  fill="#ff3b30"
                  stroke="#ff3b30"
                  strokeWidth={0}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#f5f5f7] border-t border-[#e5e5ea] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-[#0071e3] to-[#5856d6] rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">TJ</span>
            </div>
            <span className="text-[#86868b] text-[10px] tracking-[0.2em] uppercase">Trade Journal</span>
          </div>
          <p className="text-[#aeaeb2] text-[10px] tracking-wider">
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
