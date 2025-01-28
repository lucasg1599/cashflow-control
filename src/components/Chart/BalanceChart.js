import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BalanceChart = ({ transactions }) => {
  const balanceData = [];
  let balance = 0;

  // Calcula o saldo ao longo do tempo
  transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((trans) => {
      if (trans.type === 'income') {
        balance += trans.amount;
      } else if (trans.type === 'expense') {
        balance -= trans.amount;
      }
      balanceData.push({ date: trans.date, balance });
    });

  return (
    <div>
      <h2>Gráfico de Saldo ao Longo do Tempo</h2>
      <LineChart width={600} height={300} data={balanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

export default BalanceChart;