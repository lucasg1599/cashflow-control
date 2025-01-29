import React from "react";

const MonthlySummary = ({ transactions }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  console.log("Todas as transações recebidas:", transactions); // Debugging

  // Verifica se transactions é um array válido
  if (!Array.isArray(transactions)) {
    console.error("Erro: transactions não é um array!", transactions);
    return <p>Erro ao carregar transações.</p>;
  }

  // Filtrar as transações do mês atual
  const filteredTransactions = transactions.filter((trans) => {
    if (!trans.date) return false;
    const transDate = new Date(`${trans.date}T00:00:00`);
    console.log("Verificando transação:", trans, "Data convertida:", transDate);
    return (
      transDate.getMonth() === currentMonth &&
      transDate.getFullYear() === currentYear
    );
  });
  

  console.log("Transações filtradas:", filteredTransactions);

  // Calcula os totais corretamente
  const totalIncome = filteredTransactions
    .filter((trans) => trans.type === "income")
    .reduce((total, trans) => total + (trans.amount || 0), 0);

  const totalExpense = filteredTransactions
    .filter((trans) => trans.type === "expense")
    .reduce((total, trans) => total + (trans.amount || 0), 0);

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
