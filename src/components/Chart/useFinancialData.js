import { useState, useMemo } from 'react';

// Hook personalizado para processar dados financeiros
const useFinancialData = (transactions) => {
  const [period, setPeriod] = useState('all');

  // Função para filtrar transações pelo período selecionado
  const filterTransactionsByPeriod = (transactions, period) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (period) {
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '12months':
        cutoffDate.setMonth(now.getMonth() - 12);
        break;
      default:
        return transactions;
    }

    return transactions.filter(trans => new Date(trans.date) >= cutoffDate);
  };

  const filteredTransactions = useMemo(() => filterTransactionsByPeriod(transactions, period), [transactions, period]);

  // Cálculos de receitas, despesas e saldo
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Organiza transações por mês
  const monthlyData = useMemo(() => {
    return filteredTransactions.reduce((acc, trans) => {
      const date = new Date(trans.date);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }

      trans.type === 'income' 
        ? acc[month].income += trans.amount 
        : acc[month].expenses += trans.amount;

      return acc;
    }, {});
  }, [filteredTransactions]);

  // Gera dados históricos e projeção futura
  const sortedMonths = Object.keys(monthlyData).sort();
  let runningBalance = 0;
  const historicalData = sortedMonths.map(month => {
    const net = monthlyData[month].income - monthlyData[month].expenses;
    runningBalance += net;
    return { month, balance: runningBalance, type: 'historical' };
  });

  const recurringTransactions = transactions.filter(t => t.isRecurringTemplate);
  const monthsToProject = 6;
  const projectedData = [];

  let currentDate = historicalData.length > 0 
    ? new Date(historicalData[historicalData.length - 1].month + '-01') 
    : new Date();

  for (let i = 1; i <= monthsToProject; i++) {
    currentDate.setMonth(currentDate.getMonth() + 1);
    const month = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

    const recurringIncome = recurringTransactions.filter(t => t.type === 'income' && t.recurringFrequency === 'monthly')
      .reduce((sum, t) => sum + t.amount, 0);

    const recurringExpenses = recurringTransactions.filter(t => t.type === 'expense' && t.recurringFrequency === 'monthly')
      .reduce((sum, t) => sum + t.amount, 0);

    const net = recurringIncome - recurringExpenses;
    runningBalance += net;

    projectedData.push({ month, balance: runningBalance, type: 'projected' });
  }

  const fullBalanceData = [...historicalData, ...projectedData];

  return { period, setPeriod, totalIncome, totalExpenses, balance, fullBalanceData, monthlyData, sortedMonths };
};

export default useFinancialData;
