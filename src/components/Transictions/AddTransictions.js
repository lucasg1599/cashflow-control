import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MonthlySummary from '../Sumary/MonthlySummary ';
import ExpenseChart from '../Chart/ExpenseChart ';
import BalanceChart from '../Chart/BalanceChart';

const AddTransaction = () => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  // Busca transações quando o userId muda
  const fetchTransactions = async () => {
    if (!userId) return;

    try {
      const transactionsRef = collection(db, 'users', userId, 'transactions');
      const q = query(transactionsRef, orderBy('date', 'asc')); // Ordena por data
      const querySnapshot = await getDocs(q);

      const tempTransactions = [];
      querySnapshot.forEach((doc) => {
        tempTransactions.push({ id: doc.id, ...doc.data() });
      });

      console.log('Transações buscadas:', tempTransactions); // Depuração
      setTransactions(tempTransactions);
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
        date: new Date(date).toISOString().split('T')[0], // Formato YYYY-MM-DD
        createdAt: serverTimestamp(),
      });

      // Limpa os campos e recarrega transações
      setCategory('');
      setAmount('');
      setDate('');
      await fetchTransactions(); // Atualiza a lista de transações
      alert('Transação adicionada!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar transação!');
    }
  };

  return (
    <div>
      <h2>Adicionar Transação</h2>
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

        <button type="submit">Adicionar</button>
      </form>

      {/* Componentes para exibir resumo e gráficos */}
      <MonthlySummary transactions={transactions} />
      <ExpenseChart transactions={transactions} />
      <BalanceChart transactions={transactions} />
    </div>
  );
};

export default AddTransaction;