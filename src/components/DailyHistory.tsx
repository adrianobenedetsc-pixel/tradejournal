import { Trade } from '../types';
import { formatCurrency, deleteTrade } from '../utils';
import { Trash2, Target, ShieldX, Download, Upload } from 'lucide-react';

interface DailyHistoryProps {
  trades: Trade[];
  onDelete: () => void;
}

export default function DailyHistory({ trades, onDelete }: DailyHistoryProps) {
  const grouped: Record<string, Trade[]> = {};
  trades.forEach(trade => {
    if (!grouped[trade.date]) grouped[trade.date] = [];
    grouped[trade.date].push(trade);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleDelete = (id: string) => {
    if (confirm('Excluir este trade?')) {
      deleteTrade(id);
      onDelete();
    }
  };

  const exportToCSV = () => {
    if (trades.length === 0) return;

    const headers = ['Data', 'Horário', 'Instrumento', 'Resultado', 'Pontos', 'Contratos', 'P&L'];
    const rows = trades.map(trade => [
      trade.date,
      trade.time,
      trade.instrument,
      trade.result,
      trade.points,
      trade.contracts,
      trade.pnl
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trades_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (trades.length === 0) return;

    const jsonData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      totalTrades: trades.length,
      trades: trades
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trade_journal_backup_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!data.trades || !Array.isArray(data.trades)) {
          alert('Arquivo JSON inválido. Certifique-se de que é um backup válido do Trade Journal.');
          return;
        }

        const confirmMessage = `Deseja importar ${data.trades.length} trades?\n\nIsso substituirá todos os trades atuais.`;
        if (confirm(confirmMessage)) {
          localStorage.setItem('trades', JSON.stringify(data.trades));
          onDelete();
          alert(`${data.trades.length} trades importados com sucesso!`);
        }
      } catch (error) {
        alert('Erro ao ler o arquivo JSON. Verifique se o arquivo não está corrompido.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  if (sortedDates.length === 0) {
    return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Histórico</h1>
        <p className="text-[#86868b] text-base mt-2">Seus trades registrados</p>
      </div>
      <div className="text-center py-20">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#d2d2d7]">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-[#86868b]">Nenhum trade registrado</p>
          <p className="text-[#aeaeb2] text-sm mt-1">Adicione seu primeiro trade</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Histórico</h1>
          <p className="text-[#86868b] text-base mt-2">Seus trades por dia</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm font-medium hover:bg-[#f5f5f7] transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Backup JSON
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm font-medium hover:bg-[#f5f5f7] transition-all shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            Importar
            <input
              type="file"
              accept=".json"
              onChange={importFromJSON}
              className="hidden"
            />
          </label>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm font-medium hover:bg-[#f5f5f7] transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {sortedDates.map(date => {
          const dayTrades = grouped[date];
          const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
          const wins = dayTrades.filter(t => t.pnl > 0).length;
          const losses = dayTrades.filter(t => t.pnl <= 0).length;

          return (
            <div key={date} className="bg-white rounded-2xl border border-[#d2d2d7] overflow-hidden shadow-sm">
              {/* Day Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-[#f5f5f7] to-white border-b border-[#e5e5ea] flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#1d1d1f] text-sm capitalize">{formatDate(date)}</h3>
                  <p className="text-[10px] text-[#86868b] mt-0.5">
                    {dayTrades.length} trades • {wins}W / {losses}L
                  </p>
                </div>
                <div className={`text-lg font-semibold ${dayPnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
                  {dayPnl >= 0 ? '+' : ''}{formatCurrency(dayPnl)}
                </div>
              </div>

              {/* Trades */}
              <div className="divide-y divide-[#e5e5ea]">
                {dayTrades.map(trade => (
                  <div key={trade.id} className="px-5 py-4 flex items-center justify-between group hover:bg-[#f5f5f7]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        trade.result === 'Take' ? 'bg-[#34c759]/10' : 'bg-[#ff3b30]/10'
                      }`}>
                        {trade.result === 'Take'
                          ? <Target className="w-4 h-4 text-[#248a3d]" />
                          : <ShieldX className="w-4 h-4 text-[#c41e3a]" />
                        }
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#1d1d1f] text-sm">{trade.instrument}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            trade.result === 'Take' ? 'bg-[#34c759]/10 text-[#248a3d]' : 'bg-[#ff3b30]/10 text-[#c41e3a]'
                          }`}>
                            {trade.result}
                          </span>
                          <span className="text-[10px] text-[#aeaeb2]">{trade.contracts}x</span>
                        </div>
                        <p className="text-[10px] text-[#86868b] mt-0.5">
                          {trade.points} pts • {trade.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-medium text-sm ${trade.pnl >= 0 ? 'text-[#248a3d]' : 'text-[#c41e3a]'}`}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </span>
                      <button
                        onClick={() => handleDelete(trade.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#ff3b30]/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#ff3b30]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
