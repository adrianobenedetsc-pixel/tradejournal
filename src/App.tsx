import { useState, useEffect, useCallback } from 'react';
import AddTrade from './components/AddTrade';
import DailyHistory from './components/DailyHistory';
import Reports from './components/Reports';
import TradeChart from './components/TradeChart';
import { Trade } from './types';
import { getTrades } from './utils';
import { PlusCircle, History, BarChart3, TrendingUp } from 'lucide-react';

type Page = 'add' | 'history' | 'reports' | 'chart';

function App() {
  const [page, setPage] = useState<Page>('add');
  const [trades, setTrades] = useState<Trade[]>([]);

  const loadTrades = useCallback(() => {
    setTrades(getTrades());
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  const navItems = [
    { id: 'add' as Page, label: 'Trade', icon: PlusCircle },
    { id: 'chart' as Page, label: 'Gráfico', icon: TrendingUp },
    { id: 'history' as Page, label: 'Histórico', icon: History },
    { id: 'reports' as Page, label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-[#d2d2d7]/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0071e3] to-[#5856d6] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold tracking-tight">TJ</span>
            </div>
            <div>
              <span className="text-base font-semibold text-[#1d1d1f] tracking-tight">Trade Journal</span>
              <p className="text-[10px] text-[#86868b] -mt-0.5">Futures Tracker</p>
            </div>
          </div>
          <div className="text-[10px] text-[#86868b] bg-[#f5f5f7] px-3 py-1.5 rounded-full font-medium border border-[#d2d2d7]/50">
            {trades.length} trades
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-28">
        {page === 'add' && <AddTrade onTradeAdded={loadTrades} />}
        {page === 'chart' && <TradeChart trades={trades} />}
        {page === 'history' && <DailyHistory trades={trades} onDelete={loadTrades} />}
        {page === 'reports' && <Reports trades={trades} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-[#d2d2d7]/50">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive ? 'text-[#0071e3]' : 'text-[#86868b]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.5} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
