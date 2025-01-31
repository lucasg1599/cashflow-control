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

export const fetchTransactions = async (userId, setTransactions) => {
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

export const addOrUpdateTransaction = async (userId, transactionData, editingTransaction) => {
  if (!userId) {
    alert("Faça login para adicionar transações!");
    return;
  }

  if (!transactionData.amount || isNaN(transactionData.amount)) {
    alert("Valor inválido!");
    return;
  }

  try {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const newTransaction = {
      type: transactionData.type,
      description: transactionData.category,
      amount: parseFloat(transactionData.amount),
      date: new Date(transactionData.date).toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    };

    if (transactionData.recurringFrequency !== "none") {
      newTransaction.isRecurringTemplate = true;
      newTransaction.recurringFrequency = transactionData.recurringFrequency;

      const currentDate = new Date(transactionData.date);
      let nextDueDate = new Date(currentDate);

      switch (transactionData.recurringFrequency) {
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

      newTransaction.recurringNextDate = nextDueDate.toISOString().split("T")[0];
    }

    if (editingTransaction) {
      const transactionRef = doc(db, "users", userId, "transactions", editingTransaction.id);
      await updateDoc(transactionRef, newTransaction);
    } else {
      await addDoc(transactionsRef, newTransaction);
    }

    alert("Transação salva!");
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar transação!");
  }
};

export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await deleteDoc(transactionRef);
    alert("Transação apagada!");
  } catch (error) {
    console.error("Erro ao apagar transação:", error);
    alert("Erro ao apagar transação!");
  }
};
