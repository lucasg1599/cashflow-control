import React, { useState, useEffect } from "react";

const TransactionForm = ({ onSubmit, editingTransaction }) => {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [recurringFrequency, setRecurringFrequency] = useState("none");

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setCategory(editingTransaction.description);
      setAmount(editingTransaction.amount);
      setDate(editingTransaction.date);
      setRecurringFrequency(editingTransaction.recurringFrequency || "none");
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, category, amount, date, recurringFrequency });
    setCategory("");
    setAmount("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="type">Tipo de transação</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
      </div>

      <div>
        <label htmlFor="category">Categoria</label>
        <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="amount">Valor</label>
        <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="date">Data</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="recurring">Frequência de recorrência</label>
        <select id="recurring" value={recurringFrequency} onChange={(e) => setRecurringFrequency(e.target.value)}>
          <option value="none">Nenhuma</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
          <option value="yearly">Anual</option>
        </select>
      </div>

      <button type="submit">{editingTransaction ? "Salvar alterações" : "Adicionar transação"}</button>
    </form>
  );
};

export default TransactionForm;
