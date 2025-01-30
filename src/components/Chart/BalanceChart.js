import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ReferenceLine } from 'recharts';

const InteractiveBudgetChart = ({ transactions, monthlyIncome, monthlyBudget }) => {
  const data = [];
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  let accumulatedIncome = 0;
  let accumulatedExpense = 0;

  // Inicializa o array de dados com dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    data.push({
      day: i,
      accumulatedIncome: 0,
      accumulatedExpense: 0,
    });
  }

  // Calcula receitas e despesas acumuladas por dia
  transactions.forEach((trans) => {
    const transDate = new Date(trans.date);
    const day = transDate.getDate();
    if (transDate.getMonth() === currentDate.getMonth() && transDate.getFullYear() === currentDate.getFullYear()) {
      if (trans.type === 'income') {
        accumulatedIncome += trans.amount;
        data[day - 1].accumulatedIncome = accumulatedIncome;
      } else if (trans.type === 'expense') {
        accumulatedExpense += trans.amount;
        data[day - 1].accumulatedExpense = accumulatedExpense;
      }
    }
  });

  // Preenche dias sem transações com os valores acumulados anteriores
  for (let i = 1; i < daysInMonth; i++) {
    if (data[i].accumulatedIncome === 0) {
      data[i].accumulatedIncome = data[i - 1].accumulatedIncome;
    }
    if (data[i].accumulatedExpense === 0) {
      data[i].accumulatedExpense = data[i - 1].accumulatedExpense;
    }
  }

  // Calcula a projeção de despesas futuras com base na média diária
  const averageDailyExpense = accumulatedExpense / currentDate.getDate();
  for (let i = currentDate.getDate(); i < daysInMonth; i++) {
    data[i].projectedExpense = data[i - 1].accumulatedExpense + averageDailyExpense;
  }

  // Verifica se as variáveis são definidas e converte para número
  const validMonthlyIncome = monthlyIncome !== undefined ? Number(monthlyIncome) : 0;
  const validMonthlyBudget = monthlyBudget !== undefined ? Number(monthlyBudget) : 0;
  const validAccumulatedExpense = accumulatedExpense !== undefined ? Number(accumulatedExpense) : 0;

  return (
    <div>
      <h2>Controle Interativo de Orçamento Mensal</h2>
      <BarChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="accumulatedIncome" fill="#00C49F" name="Receita Acumulada" />
        <Bar dataKey="accumulatedExpense" fill="#FF8042" name="Despesa Acumulada" />
        <Line type="monotone" dataKey="projectedExpense" stroke="#FF0000" name="Despesa Projetada" />
        {/* Linha de referência para a Receita Mensal Prevista */}
        <ReferenceLine y={validMonthlyIncome} label="Receita Mensal Prevista" stroke="#0088FE" strokeDasharray="3 3" />
        <ReferenceLine y={validMonthlyBudget} label="Orçamento Mensal" stroke="#00C49F" strokeDasharray="3 3" />
      </BarChart>
      <p>
        Receita Mensal Prevista: R$ {validMonthlyIncome.toFixed(2)}<br />
        Orçamento Mensal: R$ {validMonthlyBudget.toFixed(2)}<br />
        Despesa Acumulada Atual: R$ {validAccumulatedExpense.toFixed(2)}<br />
        {validAccumulatedExpense > validMonthlyBudget
          ? 'Atenção: Você ultrapassou seu orçamento mensal!'
          : 'Você está dentro do seu orçamento mensal.'}
      </p>
    </div>
  );
};

export default InteractiveBudgetChart;
