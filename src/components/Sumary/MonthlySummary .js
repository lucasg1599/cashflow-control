import React from "react";

const MonthlySummary = ({ transactions, onEdit, onDelete }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const filteredTransactions = transactions.filter((trans) => {
    if (!trans.date) return false;
    const transDate = new Date(`${trans.date}T00:00:00`);
    return (
      transDate.getMonth() === currentMonth &&
      transDate.getFullYear() === currentYear
    );
  });

  const totalIncome = filteredTransactions
    .filter((trans) => trans.type === "income")
    .reduce((total, trans) => total + (trans.amount || 0), 0);

  const totalExpense = filteredTransactions
    .filter((trans) => trans.type === "expense")
    .reduce((total, trans) => total + (trans.amount || 0), 0);

  return (
    <div>
      <h2>Resumo Mensal</h2>
      
      {filteredTransactions.map((transaction) => (
        <div key={transaction.id} style={{ margin: '10px 0', padding: '5px', border: '1px solid #ccc' }}>
          <p>
            {transaction.description} - 
            R$ {transaction.amount.toFixed(2)} - 
            {new Date(transaction.date).toLocaleDateString()}
            
            <button 
              onClick={() => onEdit(transaction)}
              style={{ marginLeft: '10px', cursor: 'pointer' }}
            >
              ✏️
            </button>
            
            <button 
              onClick={() => onDelete(transaction.id)}
              style={{ marginLeft: '5px', cursor: 'pointer' }}
            >
              🗑️
            </button>
          </p>
          
          {transaction.parentRecurringId && (
            <small style={{ color: '#666' }}>(Recorrente)</small>
          )}
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <p><strong>Receitas Totais:</strong> R$ {totalIncome.toFixed(2)}</p>
        <p><strong>Despesas Totais:</strong> R$ {totalExpense.toFixed(2)}</p>
        <p><strong>Saldo:</strong> R$ {(totalIncome - totalExpense).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MonthlySummary;