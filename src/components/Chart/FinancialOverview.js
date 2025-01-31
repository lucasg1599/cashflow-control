import React from 'react';
import useFinancialData from './useFinancialData';
import FinancialCharts from './FinancialChart';

const FinancialOverview = ({ transactions }) => {
  const { period, setPeriod, totalIncome, totalExpenses, balance, fullBalanceData } = useFinancialData(transactions);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Projeção Financeira Mensal</h1>

      {/* Filtro de Período */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px' }}>Período:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ padding: '5px', borderRadius: '5px' }}>
          <option value="all">Todos</option>
          <option value="3months">Últimos 3 meses</option>
          <option value="6months">Últimos 6 meses</option>
          <option value="12months">Últimos 12 meses</option>
        </select>
      </div>

      {/* Componentes de gráficos */}
      <FinancialCharts fullBalanceData={fullBalanceData} totalIncome={totalIncome} totalExpenses={totalExpenses} balance={balance} />
    </div>
  );
};

export default FinancialOverview;
