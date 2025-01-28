import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ExpenseChart = ({ transactions }) => {
  const categories = {};

  // Agrupa despesas por categoria
  transactions
    .filter((trans) => trans.type === 'expense')
    .forEach((trans) => {
      if (categories[trans.description]) {
        categories[trans.description] += trans.amount;
      } else {
        categories[trans.description] = trans.amount;
      }
    });

  const data = Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div>
      <h2>Gráfico de Despesas por Categoria</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ExpenseChart;