import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TransactionForm from "./TransicionForm";
import { fetchTransactions,
  addOrUpdateTransaction,
  deleteTransaction
 } from "./TransictionServices";
import MonthlySummary from "../Sumary/MonthlySummary ";
import FinancialOverview from "../Chart/FinancialOverview";

const AddTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId, setTransactions);
    }
  }, [userId]);

  const handleSubmit = async (transactionData) => {
    await addOrUpdateTransaction(userId, transactionData, editingTransaction);
    setEditingTransaction(null);
    fetchTransactions(userId, setTransactions);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = async (transactionId) => {
    await deleteTransaction(userId, transactionId);
    fetchTransactions(userId, setTransactions);
  };

  return (
    <div>
      <TransactionForm onSubmit={handleSubmit} editingTransaction={editingTransaction} />
      <MonthlySummary
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
      <FinancialOverview transactions={transactions} />
    </div>
  );
};

export default AddTransaction;
