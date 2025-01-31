import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const formatMonthTick = (month) => {
  const [year, m] = month.split('-');
  return `${m}/${year.slice(2)}`;
};

const FinancialCharts = ({ fullBalanceData, totalIncome, totalExpenses, balance }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Gráfico de Evolução do Saldo */}
      <div>
        <h3>Evolução do Saldo</h3>
        <LineChart width={900} height={400} data={fullBalanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={formatMonthTick} />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          <Line dataKey="balance" stroke="#2ecc71" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </div>

      {/* Gráfico de Receitas vs Despesas */}
      <div>
        <h3>Receitas vs Despesas</h3>
        <BarChart width={300} height={250} data={[{ name: 'Receitas', value: totalIncome }, { name: 'Despesas', value: totalExpenses }]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          <Bar dataKey="value" fill="#3498db" radius={[5, 5, 0, 0]} />
        </BarChart>
        <div style={{ padding: '10px', backgroundColor: balance >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: '5px' }}>
          <strong>Saldo Atual:</strong> R$ {balance.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;
