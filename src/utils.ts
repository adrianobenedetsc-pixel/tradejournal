import { Trade, DailySummary } from './types';

export const POINT_VALUES: Record<string, number> = {
  NQ: 2,
  ES: 5,
};

export function calculatePnL(
  instrument: 'NQ' | 'ES',
  result: 'Take' | 'Stop',
  points: number,
  contracts: number
): { pnl: number; pnlPerContract: number } {
  const pointValue = POINT_VALUES[instrument];
  const pnlPerContract = result === 'Take'
    ? points * pointValue
    : -(points * pointValue);
  const pnl = pnlPerContract * contracts;
  return { pnl: Math.round(pnl * 100) / 100, pnlPerContract: Math.round(pnlPerContract * 100) / 100 };
}

export function getTrades(): Trade[] {
  const data = localStorage.getItem('trades');
  return data ? JSON.parse(data) : [];
}

export function saveTrade(trade: Trade): void {
  const trades = getTrades();
  trades.push(trade);
  localStorage.setItem('trades', JSON.stringify(trades));
}

export function deleteTrade(id: string): void {
  const trades = getTrades().filter(t => t.id !== id);
  localStorage.setItem('trades', JSON.stringify(trades));
}

export function getDailySummaries(): DailySummary[] {
  const trades = getTrades();
  const grouped: Record<string, Trade[]> = {};

  trades.forEach(trade => {
    if (!grouped[trade.date]) grouped[trade.date] = [];
    grouped[trade.date].push(trade);
  });

  return Object.entries(grouped)
    .map(([date, dayTrades]) => ({
      date,
      totalPnl: Math.round(dayTrades.reduce((sum, t) => sum + t.pnl, 0) * 100) / 100,
      trades: dayTrades.length,
      wins: dayTrades.filter(t => t.pnl > 0).length,
      losses: dayTrades.filter(t => t.pnl <= 0).length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
