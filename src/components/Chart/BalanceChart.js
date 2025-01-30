import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const FinancialOverview = ({ transactions }) => {
  // Cálculo de receitas e despesas totais
  const totalIncome = transactions
    .filter((trans) => trans.type === 'income')
    .reduce((sum, trans) => sum + trans.amount, 0);

  const totalExpenses = transactions
    .filter((trans) => trans.type === 'expense')
    .reduce((sum, trans) => sum + trans.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Dados para o gráfico de barras (receitas vs despesas)
  const incomeExpenseData = [
    { name: 'Receitas', value: totalIncome },
    { name: 'Despesas', value: totalExpenses },
  ];

  // Dados para o gráfico de pizza (despesas por categoria)
  const categories = {};
  transactions
    .filter((trans) => trans.type === 'expense')
    .forEach((trans) => {
      if (categories[trans.description]) {
        categories[trans.description] += trans.amount;
      } else {
        categories[trans.description] = trans.amount;
      }
    });
  const expenseData = Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));

  // Dados para o gráfico de linha (saldo ao longo do tempo)
  const balanceData = [];
  let runningBalance = 0;
  transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((trans) => {
      if (trans.type === 'income') {
        runningBalance += trans.amount;
      } else if (trans.type === 'expense') {
        runningBalance -= trans.amount;
      }
      balanceData.push({ date: trans.date, balance: runningBalance });
    });

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div>
      <h1>Visão Geral das Finanças</h1>

      {/* Gráfico de Barras: Receitas vs Despesas */}
      <div>
        <h2>Receitas vs Despesas</h2>
        <BarChart width={500} height={300} data={incomeExpenseData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
        <p>
          Saldo Final: R$ {balance.toFixed(2)} -{' '}
          {balance >= 0 ? '✅ Você está no azul!' : '⚠️ Cuidado! Você está no vermelho.'}
        </p>
      </div>

      {/* Gráfico de Pizza: Despesas por Categoria */}
      <div>
        <h2>Despesas por Categoria</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={expenseData}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Gráfico de Linha: Saldo ao Longo do Tempo */}
      <div>
        <h2>Saldo ao Longo do Tempo</h2>
        <LineChart width={600} height={300} data={balanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  );
};

export default FinancialOverview;