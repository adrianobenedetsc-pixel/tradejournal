export interface Trade {
  id: string;
  date: string;
  time: string;
  instrument: 'NQ' | 'ES';
  result: 'Take' | 'Stop';
  points: number;
  contracts: number;
  pnl: number;
  pnlPerContract: number;
}

export interface DailySummary {
  date: string;
  totalPnl: number;
  trades: number;
  wins: number;
  losses: number;
}
