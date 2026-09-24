# Trade Journal - Futures Tracker

Sistema de registro de trades para mercado de futuros (NQ e ES) com relatórios completos e análise de performance.

## Funcionalidades

- ✅ **Adicionar Trades**: Registro rápido com Take/Stop e pontos
- ✅ **Gráfico**: Evolução trade a trade (estilo poker)
- ✅ **Histórico**: Visualização por dia com exportação CSV/JSON
- ✅ **Relatórios**: Análise completa com regra de consistência 20%
- ✅ **Backup**: Exportar/Importar dados em JSON
- ✅ **Cálculo Automático**: NQ = $2/ponto, ES = $5/ponto

## Como Rodar

### 1. Instale o Node.js
Baixe em: https://nodejs.org/ (versão LTS 18 ou superior)

### 2. Instale as dependências
```bash
npm install
```

### 3. Rode o servidor de desenvolvimento
```bash
npm run dev
```

### 4. Abra no navegador
Acesse: http://localhost:3000

## Comandos Disponíveis

- `npm run dev` - Servidor de desenvolvimento com hot reload
- `npm run build` - Build para produção (gera pasta dist/)
- `npm run preview` - Preview do build de produção

## Estrutura do Projeto

```
src/
├── components/
│   ├── AddTrade.tsx       # Formulário de novo trade
│   ├── DailyHistory.tsx   # Histórico diário
│   ├── Reports.tsx        # Relatórios e análises
│   └── TradeChart.tsx     # Gráfico de performance
├── App.tsx                # Componente principal
├── main.tsx               # Entry point
├── index.css              # Estilos globais
├── types.ts               # Tipos TypeScript
└── utils.ts               # Funções utilitárias
```

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts (gráficos)
- Lucide React (ícones)

## Armazenamento de Dados

Os dados são salvos no **localStorage** do navegador. Para fazer backup:
- Use o botão "Backup JSON" no Histórico
- O arquivo pode ser importado posteriormente

## Design

Interface minimalista estilo Apple com:
- Fundo claro (#f5f5f7)
- Cards brancos com sombras suaves
- Tipografia SF Pro
- Cores: Azul (#0071e3), Verde (#34c759), Vermelho (#ff3b30)

## Regra de Consistência

Análise dos últimos 10 dias:
- Calcula % que o melhor dia representa do total
- Exibe apenas o valor percentual
- Ajuda a identificar se os lucros estão distribuídos ou concentrados

---

Desenvolvido para traders de futuros NQ e ES.
