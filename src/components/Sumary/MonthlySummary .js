import React from "react";

const MonthlySummary = ({ transactions }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const filteredTransactions = transactions.filter((trans) => {
    const transDate = new Date(trans.date);
    return (
      transDate.getMonth() === currentMonth &&
      transDate.getFullYear() === currentYear
    );
  });

  // Calcula totais
  const totalIncome = filteredTransactions
    .filter((trans) => trans.type === "income")
    .reduce((total, trans) => total + trans.amount, 0);

  const totalExpense = filteredTransactions
    .filter((trans) => trans.type === "transactions")
    .reduce((total, trans) => total + trans.amount, 0);

  const net = totalIncome - totalExpense;

  return (
    <div>
      <h2>Resumo Mensal</h2>
      <p>Receitas: R$ {totalIncome.toFixed(2)}</p>
      <p>Despesas: R$ {totalExpense.toFixed(2)}</p>
      <p>Saldo: R$ {net.toFixed(2)}</p>
    </div>
  );
};

export default MonthlySummary;
