import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MonthlySummary from '../Sumary/MonthlySummary ';
import BalanceChart from '../Chart/BalanceChart';
import ExpenseChart from '../Chart/ExpenseChart ';

const AddTransaction = () => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('none');
  const [incomeAmount, setIncomeAmount] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  const fetchTransactions = async () => {
    if (!userId) return;

    try {
      const transactionsRef = collection(db, 'users', userId, 'transactions');
      const q = query(transactionsRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);

      const tempTransactions = [];
      querySnapshot.forEach((doc) => {
        tempTransactions.push({ id: doc.id, ...doc.data() });
      });

      setTransactions(tempTransactions);

      const hasIncome = tempTransactions.some((transaction) => transaction.type === 'income');
      setShowIncomeModal(!hasIncome);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      alert('Erro ao carregar transações!');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('Faça login para adicionar transações!');
      return;
    }

    if (!amount || isNaN(amount)) {
      alert('Valor inválido!');
      return;
    }

    try {
      const transactionsRef = collection(db, 'users', userId, 'transactions');

      await addDoc(transactionsRef, {
        type: type,
        description: category,
        amount: parseFloat(amount),
        date: new Date(date).toISOString().split('T')[0],
        isRecurring: recurringFrequency !== 'none',
        recurringFrequency: recurringFrequency !== 'none' ? recurringFrequency : null,
        createdAt: serverTimestamp(),
      });

      setCategory('');
      setAmount('');
      setDate('');
      setRecurringFrequency('none');
      await fetchTransactions();
      alert('Transação adicionada!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar transação!');
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();

    if (!incomeAmount || isNaN(incomeAmount)) {
      alert('Valor inválido!');
      return;
    }

    try {
      const transactionsRef = collection(db, 'users', userId, 'transactions');

      await addDoc(transactionsRef, {
        type: 'income',
        description: 'Receita Mensal',
        amount: parseFloat(incomeAmount),
        date: new Date().toISOString().split('T')[0],
        isRecurring: true,
        recurringFrequency: 'monthly',
        createdAt: serverTimestamp(),
      });

      setIncomeAmount('');
      setShowIncomeModal(false);
      await fetchTransactions();
      alert('Receita adicionada!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar receita!');
    }
  };

  return (
    <div>
      <h2>Adicionar Transação</h2>
      
      {!showIncomeModal && (
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
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="amount">Valor</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="recurring">Recorrência</label>
            <select
              id="recurring"
              value={recurringFrequency}
              onChange={(e) => setRecurringFrequency(e.target.value)}
            >
              <option value="none">Não recorrente</option>
              <option value="monthly">Mensal</option>
              <option value="weekly">Semanal</option>
              <option value="yearly">Anual</option>
            </select>
          </div>

          <button type="submit">Adicionar</button>
        </form>
      )}

      {showIncomeModal && (
        <div className="modal">
          <h2>Adicionar Receita Mensal</h2>
          <form onSubmit={handleIncomeSubmit}>
            <div>
              <label htmlFor="incomeAmount">Valor da Receita</label>
              <input
                id="incomeAmount"
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit">Adicionar Receita Mensal Recorrente</button>
          </form>
        </div>
      )}

      <MonthlySummary transactions={transactions} />
      <ExpenseChart transactions={transactions} />
      <BalanceChart transactions={transactions} />
    </div>
  );
};

export default AddTransaction;