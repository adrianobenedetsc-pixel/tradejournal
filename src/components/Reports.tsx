import { useMemo } from 'react';
import { Trade } from '../types';
import { formatCurrency, getDailySummaries } from '../utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Target, ShieldX, Calendar, Clock, Zap, Award, AlertTriangle } from 'lucide-react';

interface ReportsProps {
  trades: Trade[];
}

export default function Reports({ trades }: ReportsProps) {
  const summaries = useMemo(() => getDailySummaries(), [trades]);

  const stats = useMemo(() => {
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const losses = trades.filter(t => t.pnl <= 0).length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const avgWin = wins > 0 ? trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / wins : 0;
    const avgLoss = losses > 0 ? Math.abs(trades.filter(t => t.pnl <= 0).reduce((s, t) => s + t.pnl, 0) / losses) : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;
    const bestDay = summaries.length > 0 ? Math.max(...summaries.map(s => s.totalPnl)) : 0;
    const worstDay = summaries.length > 0 ? Math.min(...summaries.map(s => s.totalPnl)) : 0;
    const nqTrades = trades.filter(t => t.instrument === 'NQ');
    const esTrades = trades.filter(t => t.instrument === 'ES');
    const nqPnl = nqTrades.reduce((s, t) => s + t.pnl, 0);
    const esPnl = esTrades.reduce((s, t) => s + t.pnl, 0);
    const nqWins = nqTrades.filter(t => t.pnl > 0).length;
    const esWins = esTrades.filter(t => t.pnl > 0).length;
    const nqWinRate = nqTrades.length > 0 ? (nqWins / nqTrades.length) * 100 : 0;
    const esWinRate = esTrades.length > 0 ? (esWins / esTrades.length) * 100 : 0;

    // Streaks
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let tempWin = 0;
    let tempLoss = 0;
    trades.forEach(t => {
      if (t.pnl > 0) {
        tempWin++;
        tempLoss = 0;
        if (tempWin > maxWinStreak) maxWinStreak = tempWin;
      } else {
        tempLoss++;
        tempWin = 0;
        if (tempLoss > maxLossStreak) maxLossStreak = tempLoss;
      }
    });
    // Current streak
    for (let i = trades.length - 1; i >= 0; i--) {
      if (i === trades.length - 1) {
        currentStreak = trades[i].pnl > 0 ? 1 : -1;
        continue;
      }
      if ((currentStreak > 0 && trades[i].pnl > 0) || (currentStreak < 0 && trades[i].pnl <= 0)) {
        currentStreak += currentStreak > 0 ? 1 : -1;
      } else break;
    }

    // Drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;
    trades.forEach(t => {
      cumulative += t.pnl;
      if (cumulative > peak) peak = cumulative;
      const dd = peak - cumulative;
      if (dd > maxDrawdown) maxDrawdown = dd;
    });

    // Expectancy
    const expectancy = totalTrades > 0 ? totalPnl / totalTrades : 0;

    // Avg points
    const takeTrades = trades.filter(t => t.result === 'Take');
    const stopTrades = trades.filter(t => t.result === 'Stop');
    const avgTakePoints = takeTrades.length > 0 ? takeTrades.reduce((s, t) => s + t.points, 0) / takeTrades.length : 0;
    const avgStopPoints = stopTrades.length > 0 ? stopTrades.reduce((s, t) => s + t.points, 0) / stopTrades.length : 0;

    return {
      totalPnl, totalTrades, wins, losses, winRate, avgWin, avgLoss, profitFactor,
      bestDay, worstDay, nqPnl, esPnl, nqTrades: nqTrades.length, esTrades: esTrades.length,
      nqWinRate, esWinRate, maxWinStreak, maxLossStreak, currentStreak, maxDrawdown,
      expectancy, avgTakePoints, avgStopPoints
    };
  }, [trades, summaries]);

  // Day of week analysis
  const dayOfWeekData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = Array(7).fill(null).map((_, i) => ({ day: days[i], pnl: 0, trades: 0, wins: 0 }));
    trades.forEach(t => {
      const dayIndex = new Date(t.date + 'T12:00:00').getDay();
      data[dayIndex].pnl += t.pnl;
      data[dayIndex].trades++;
      if (t.pnl > 0) data[dayIndex].wins++;
    });
    return data.map(d => ({
      ...d,
      pnl: Math.round(d.pnl * 100) / 100,
      winRate: d.trades > 0 ? Math.round((d.wins / d.trades) * 100) : 0
    }));
  }, [trades]);

  // Monthly analysis
  const monthlyData = useMemo(() => {
    const grouped: Record<string, { pnl: number; trades: number; wins: number }> = {};
    trades.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!grouped[month]) grouped[month] = { pnl: 0, trades: 0, wins: 0 };
      grouped[month].pnl += t.pnl;
      grouped[month].trades++;
      if (t.pnl > 0) grouped[month].wins++;
    });
    return Object.entries(grouped)
      .map(([month, data]) => ({
        month: new Date(month + '-15T12:00:00').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        pnl: Math.round(data.pnl * 100) / 100,
        trades: data.trades,
        winRate: Math.round((data.wins / data.trades) * 100)
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [trades]);

  // Hour analysis
  const hourData = useMemo(() => {
    const data: Record<number, { pnl: number; trades: number; wins: number }> = {};
    trades.forEach(t => {
      const hour = parseInt(t.time.split(':')[0]);
      if (!data[hour]) data[hour] = { pnl: 0, trades: 0, wins: 0 };
      data[hour].pnl += t.pnl;
      data[hour].trades++;
      if (t.pnl > 0) data[hour].wins++;
    });
    return Object.entries(data)
      .map(([hour, d]) => ({
        hour: `${hour}h`,
        hourNum: parseInt(hour),
        pnl: Math.round(d.pnl * 100) / 100,
        trades: d.trades,
        winRate: Math.round((d.wins / d.trades) * 100)
      }))
      .sort((a, b) => a.hourNum - b.hourNum);
  }, [trades]);

  const equityCurve = useMemo(() => {
    let cumulative = 0;
    return summaries.map(s => {
      cumulative += s.totalPnl;
      return { date: s.date.slice(5), pnl: Math.round(cumulative * 100) / 100 };
    });
  }, [summaries]);

  const dailyPnlData = useMemo(() => {
    return summaries.map(s => ({
      date: s.date.slice(5),
      pnl: s.totalPnl,
    }));
  }, [summaries]);

  const pieData = useMemo(() => {
    return [
      { name: 'Wins', value: stats.wins, color: '#34c759' },
      { name: 'Losses', value: stats.losses, color: '#ff3b30' },
    ].filter(d => d.value > 0);
  }, [stats]);

  const instrumentData = useMemo(() => {
    return [
      { name: 'NQ', trades: stats.nqTrades, pnl: stats.nqPnl, winRate: stats.nqWinRate },
      { name: 'ES', trades: stats.esTrades, pnl: stats.esPnl, winRate: stats.esWinRate },
    ];
  }, [stats]);

  if (trades.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Relatórios</h1>
          <p className="text-[#86868b] text-base mt-2">Análise completa do seu desempenho</p>
        </div>
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#d2d2d7]">
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-[#86868b]">Nenhum dado disponível</p>
          <p className="text-[#aeaeb2] text-sm mt-1">Registre trades para ver relatórios</p>
        </div>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5ea',
    borderRadius: '14px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
    color: '#1d1d1f',
    fontSize: '12px',
  };

  const bestDayOfWeek = dayOfWeekData.reduce((best, d) => d.pnl > best.pnl ? d : best, dayOfWeekData[0]);
  const worstDayOfWeek = dayOfWeekData.reduce((worst, d) => d.pnl < worst.pnl ? d : worst, dayOfWeekData[0]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Relatórios</h1>
        <p className="text-[#86868b] text-base mt-2">Análise completa do seu desempenho</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">P&L Total</p>
          <p className={`text-xl font-semibold mt-1.5 ${stats.totalPnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
            {stats.totalPnl >= 0 ? '+' : ''}{formatCurrency(stats.totalPnl)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Win Rate</p>
          <p className="text-xl font-semibold mt-1.5 text-[#1d1d1f]">{stats.winRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Profit Factor</p>
          <p className="text-xl font-semibold mt-1.5 text-[#1d1d1f]">{stats.profitFactor.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Expectancy</p>
          <p className={`text-xl font-semibold mt-1.5 ${stats.expectancy >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
            {stats.expectancy >= 0 ? '+' : ''}{formatCurrency(stats.expectancy)}
          </p>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Total Trades</p>
          <p className="text-xl font-semibold mt-1.5 text-[#1d1d1f]">{stats.totalTrades}</p>
          <p className="text-[10px] text-[#86868b] mt-1">{stats.wins}W / {stats.losses}L</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Média Win</p>
          <p className="text-xl font-semibold mt-1.5 text-[#248a3d]">+{formatCurrency(stats.avgWin)}</p>
          <p className="text-[10px] text-[#86868b] mt-1">{stats.avgTakePoints.toFixed(1)} pts avg</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Média Loss</p>
          <p className="text-xl font-semibold mt-1.5 text-[#c41e3a]">-{formatCurrency(stats.avgLoss)}</p>
          <p className="text-[10px] text-[#86868b] mt-1">{stats.avgStopPoints.toFixed(1)} pts avg</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Max Drawdown</p>
          <p className="text-xl font-semibold mt-1.5 text-[#c41e3a]">{formatCurrency(stats.maxDrawdown)}</p>
          <p className="text-[10px] text-[#86868b] mt-1">Pico ao vale</p>
        </div>
      </div>

      {/* Streaks & Records */}
      <div className="bg-white rounded-2xl border border-[#d2d2d7] shadow-sm p-5 mb-5">
        <h3 className="text-xs font-medium text-[#86868b] mb-4 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" /> Sequências & Recordes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-[#f5f5f7] rounded-xl">
            <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Streak Atual</p>
            <p className={`text-2xl font-semibold mt-1 ${stats.currentStreak > 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
              {stats.currentStreak > 0 ? `${stats.currentStreak}W` : `${Math.abs(stats.currentStreak)}L`}
            </p>
          </div>
          <div className="p-3 bg-[#f5f5f7] rounded-xl">
            <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Melhor Win Streak</p>
            <p className="text-2xl font-semibold mt-1 text-[#248a3d]">{stats.maxWinStreak}W</p>
          </div>
          <div className="p-3 bg-[#f5f5f7] rounded-xl">
            <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Pior Loss Streak</p>
            <p className="text-2xl font-semibold mt-1 text-[#c41e3a]">{stats.maxLossStreak}L</p>
          </div>
          <div className="p-3 bg-[#f5f5f7] rounded-xl">
            <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Melhor Dia</p>
            <p className="text-2xl font-semibold mt-1 text-[#248a3d]">+{formatCurrency(stats.bestDay)}</p>
          </div>
        </div>
      </div>

      {/* Equity Curve */}
      <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm mb-5">
        <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider">Curva de Equity</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071e3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0071e3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Acumulado']} />
              <Area type="monotone" dataKey="pnl" stroke="#0071e3" strokeWidth={2.5} fill="url(#equityGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily PnL */}
      <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm mb-5">
        <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider">P&L Diário</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyPnlData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'P&L']} />
              <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                {dailyPnlData.map((entry, index) => (
                  <Cell key={index} fill={entry.pnl >= 0 ? '#34c759' : '#ff3b30'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day of Week Analysis */}
      <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm mb-5">
        <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" /> Performance por Dia da Semana
        </h3>
        <div className="h-44 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayOfWeekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'P&L']} />
              <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                {dayOfWeekData.map((entry, index) => (
                  <Cell key={index} fill={entry.pnl >= 0 ? '#34c759' : '#ff3b30'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#e5e5ea]">
          <div className="flex items-center gap-2 p-2.5 bg-[#34c759]/5 rounded-xl">
            <TrendingUp className="w-4 h-4 text-[#248a3d]" />
            <div>
              <p className="text-[10px] text-[#86868b]">Melhor dia</p>
              <p className="text-sm font-medium text-[#1d1d1f]">{bestDayOfWeek.day} <span className="text-[#248a3d]">+{formatCurrency(bestDayOfWeek.pnl)}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-[#ff3b30]/5 rounded-xl">
            <TrendingDown className="w-4 h-4 text-[#c41e3a]" />
            <div>
              <p className="text-[10px] text-[#86868b]">Pior dia</p>
              <p className="text-sm font-medium text-[#1d1d1f]">{worstDayOfWeek.day} <span className="text-[#c41e3a]">{formatCurrency(worstDayOfWeek.pnl)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Hour Analysis */}
      {hourData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm mb-5">
          <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Performance por Horário
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'P&L']} />
                <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                  {hourData.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? '#34c759' : '#ff3b30'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Monthly Analysis */}
      {monthlyData.length > 1 && (
        <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm mb-5">
          <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider">Performance Mensal</h3>
          <div className="h-44 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'P&L']} />
                <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={index} fill={entry.pnl >= 0 ? '#34c759' : '#ff3b30'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-[#e5e5ea]">
            {monthlyData.slice(-3).map(m => (
              <div key={m.month} className="p-3 bg-[#f5f5f7] rounded-xl">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider capitalize">{m.month}</p>
                <p className={`text-base font-semibold mt-1 ${m.pnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
                  {m.pnl >= 0 ? '+' : ''}{formatCurrency(m.pnl)}
                </p>
                <p className="text-[10px] text-[#86868b] mt-0.5">{m.trades} trades • {m.winRate}% WR</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Win/Loss Pie */}
        <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-3.5 h-3.5" /> Distribuição Win/Loss
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#86868b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Instrument Performance */}
        <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm">
          <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-3.5 h-3.5" /> Por Instrumento
          </h3>
          <div className="space-y-3 mt-2">
            {instrumentData.map(item => (
              <div key={item.name} className="p-4 bg-[#f5f5f7] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-[#1d1d1f] text-sm">{item.name}</p>
                  <span className={`font-semibold text-sm ${item.pnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
                    {item.pnl >= 0 ? '+' : ''}{formatCurrency(item.pnl)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#86868b]">
                  <span>{item.trades} trades</span>
                  <span>{item.winRate.toFixed(0)}% win rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Take vs Stop Analysis */}
      <div className="bg-white p-6 rounded-2xl border border-[#d2d2d7] shadow-sm mb-5">
        <h3 className="text-xs font-medium text-[#86868b] mb-5 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" /> Take vs Stop
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#34c759]/5 border border-[#34c759]/10 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#34c759]/20 rounded-lg flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-[#248a3d]" />
              </div>
              <span className="text-sm font-medium text-[#248a3d]">Take</span>
            </div>
            <p className="text-2xl font-semibold text-[#1d1d1f]">{trades.filter(t => t.result === 'Take').length}</p>
            <p className="text-[10px] text-[#86868b] mt-1">Média {stats.avgTakePoints.toFixed(1)} pts</p>
          </div>
          <div className="p-4 bg-[#ff3b30]/5 border border-[#ff3b30]/10 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#ff3b30]/20 rounded-lg flex items-center justify-center">
                <ShieldX className="w-3.5 h-3.5 text-[#c41e3a]" />
              </div>
              <span className="text-sm font-medium text-[#c41e3a]">Stop</span>
            </div>
            <p className="text-2xl font-semibold text-[#1d1d1f]">{trades.filter(t => t.result === 'Stop').length}</p>
            <p className="text-[10px] text-[#86868b] mt-1">Média {stats.avgStopPoints.toFixed(1)} pts</p>
          </div>
        </div>
      </div>

      {/* Discipline Section */}
      <div className="bg-gradient-to-br from-[#0071e3]/5 to-[#5856d6]/5 p-6 rounded-2xl border border-[#0071e3]/15 shadow-sm mb-5">
        <h3 className="text-xs font-medium text-[#0071e3] mb-4 uppercase tracking-wider">📌 Foco no Processo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-[#86868b]">Dias Ativos</p>
            <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">{summaries.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#86868b]">Média/Dia</p>
            <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">
              {summaries.length > 0 ? (stats.totalTrades / summaries.length).toFixed(1) : '0'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#86868b]">Dias Positivos</p>
            <p className="text-2xl font-semibold text-[#248a3d] mt-1">
              {summaries.filter(s => s.totalPnl > 0).length}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#86868b]">Status</p>
            <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">
              {stats.winRate >= 50 ? '✅' : stats.winRate >= 40 ? '⚡' : '🔥'}
            </p>
          </div>
        </div>
      </div>

      {/* Consistency Rule - 20% */}
      {summaries.length > 0 && (() => {
        const last10Days = summaries.slice(-10);
        const totalPnl10Days = last10Days.reduce((sum, day) => sum + day.totalPnl, 0);
        const bestDay = last10Days.reduce((best, day) => day.totalPnl > best.totalPnl ? day : best, last10Days[0]);
        const bestDayPercentage = totalPnl10Days > 0 ? (bestDay.totalPnl / totalPnl10Days) * 100 : 0;
        const isConsistent = bestDayPercentage <= 20;

        return (
          <div className="p-6 rounded-2xl border border-[#d2d2d7] bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-medium text-[#1d1d1f] uppercase tracking-wider">
                ⚖️ Consistência
              </h3>
              <div className="text-2xl font-semibold text-[#1d1d1f]">
                {bestDayPercentage.toFixed(1)}%
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white/50 rounded-xl">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Últimos {last10Days.length} Dias</p>
                <p className={`text-2xl font-semibold mt-1 ${totalPnl10Days >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
                  {totalPnl10Days >= 0 ? '+' : ''}{formatCurrency(totalPnl10Days)}
                </p>
              </div>
              <div className="p-4 bg-white/50 rounded-xl">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Melhor Dia</p>
                <p className="text-2xl font-semibold mt-1 text-[#248a3d]">
                  +{formatCurrency(bestDay.totalPnl)}
                </p>
                <p className="text-[10px] text-[#86868b] mt-1">
                  {new Date(bestDay.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </p>
              </div>
              <div className="p-4 bg-[#f5f5f7] rounded-xl">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider">% do Melhor Dia</p>
                <p className="text-2xl font-semibold mt-1 text-[#1d1d1f]">
                  {bestDayPercentage.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/30 rounded-xl">
              <p className="text-xs text-[#86868b] leading-relaxed">
                Melhor dia: <span className="font-semibold text-[#1d1d1f]">{bestDayPercentage.toFixed(1)}%</span> do total dos últimos {last10Days.length} dias
              </p>
            </div>

            {/* Visual bar */}
            <div className="mt-4 pt-4 border-t border-black/5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#86868b] uppercase tracking-wider">Nível</span>
                <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all bg-[#0071e3]"
                    style={{ width: `${Math.min(bestDayPercentage, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-[#1d1d1f]">{bestDayPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
