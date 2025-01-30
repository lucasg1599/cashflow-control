import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddTransaction from './components/Transictions/AddTransictions';
import MonthlySummary from './components/Sumary/MonthlySummary ';
import ExpenseChart from './components/Chart/ExpenseChart ';
import InteractiveBudgetChart from './components/Chart/BalanceChart';
import Login from './components/login/loginUser';
import RegisterComponent from './components/Register/RegisterUser';

function App() {
  console.log("App está sendo renderizado!");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/monthly-summary" element={<MonthlySummary />} />
        <Route path="/expense-chart" element={<ExpenseChart />} />
        <Route path="/balance-chart" element={<InteractiveBudgetChart />} />
      </Routes>
    </Router>
  );
}

export default App;
