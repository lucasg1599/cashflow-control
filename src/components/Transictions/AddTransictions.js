import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MonthlySummary from "../Sumary/MonthlySummary ";
import ExpenseChart from "../Chart/ExpenseChart ";
import FinancialOverview from "../Chart/BalanceChart";

const AddTransaction = () => {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [recurringFrequency, setRecurringFrequency] = useState("none");
  const [editingTransaction, setEditingTransaction] = useState(null); // Estado para a transação em edição

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
      const transactionsRef = collection(db, "users", userId, "transactions");
      const q = query(transactionsRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);

      const tempTransactions = [];
      querySnapshot.forEach((doc) => {
        tempTransactions.push({ id: doc.id, ...doc.data() });
      });

      setTransactions(tempTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      alert("Erro ao carregar transações!");
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
      alert("Faça login para adicionar transações!");
      return;
    }

    if (!amount || isNaN(amount)) {
      alert("Valor inválido!");
      return;
    }

    try {
      const transactionsRef = collection(db, "users", userId, "transactions");
      const newTransaction = {
        type,
        description: category,
        amount: parseFloat(amount),
        date: new Date(date).toISOString().split("T")[0],
        createdAt: serverTimestamp(),
      };

      if (recurringFrequency !== "none") {
        newTransaction.isRecurringTemplate = true;
        newTransaction.recurringFrequency = recurringFrequency;

        const currentDate = new Date(date);
        let nextDueDate = new Date(currentDate);

        switch (recurringFrequency) {
          case "monthly":
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
          case "weekly":
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
          case "yearly":
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
        }

        newTransaction.recurringNextDate = nextDueDate
          .toISOString()
          .split("T")[0];
      }

      if (editingTransaction) {
        // Atualizar uma transação existente
        const transactionRef = doc(
          db,
          "users",
          userId,
          "transactions",
          editingTransaction.id
        );
        await updateDoc(transactionRef, newTransaction);
        setEditingTransaction(null); // Limpar estado de edição
      } else {
        // Adicionar uma nova transação
        await addDoc(transactionsRef, newTransaction);
      }

      // Limpar os campos após salvar
      setCategory("");
      setAmount("");
      setDate("");
      await fetchTransactions();
      alert("Transação salva!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar transação!");
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setType(transaction.type);
    setCategory(transaction.description);
    setAmount(transaction.amount);
    setDate(transaction.date);
    setRecurringFrequency(transaction.recurringFrequency || "none");
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const transactionRef = doc(
        db,
        "users",
        userId,
        "transactions",
        transactionId
      );
      await deleteDoc(transactionRef);
      await fetchTransactions();
      alert("Transação apagada!");
    } catch (error) {
      console.error("Erro ao apagar transação:", error);
      alert("Erro ao apagar transação!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Tipo de transação</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
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
          <label htmlFor="recurring">Frequência de recorrência</label>
          <select
            id="recurring"
            value={recurringFrequency}
            onChange={(e) => setRecurringFrequency(e.target.value)}
          >
            <option value="none">Nenhuma</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="yearly">Anual</option>
          </select>
        </div>

        <button type="submit">
          {editingTransaction ? "Salvar alterações" : "Adicionar transação"}
        </button>
      </form>

      <MonthlySummary
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
      <ExpenseChart transactions={transactions} />
      <FinancialOverview transactions={transactions} />
    </div>
  );
};

export default AddTransaction;
