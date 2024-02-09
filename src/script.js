import React, { useState, useEffect } from 'react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  // useEffect(() => {
  //   const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  //   setTransactions(localStorageTransactions || []);
  // }, []);

  useEffect(() => {
    // updateLocalStorage();
    updateValues();
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();

    if (text.trim() === '' || amount.trim() === '') {
      alert('Please add a text and amount');
    } else {
      const newTransaction = {
        id: generateID(),
        text,
        amount: +amount
      };

      if (newTransaction.amount === 0) {
        alert('Please enter a non-zero amount.');
      } else if (getTotalBalance() >= 0 && newTransaction.amount < 0) {
        if (Math.abs(newTransaction.amount) > getTotalBalance()) {
          alert('Cannot add an expense greater than the current balance.');
        } else {
          setTransactions([...transactions, newTransaction]);
          setText('');
          setAmount('');
        }
      } else if (getTotalBalance() < 0 && newTransaction.amount > 0) {
        alert('Cannot add positive income when the balance is negative.');
      } else {
        setTransactions([...transactions, newTransaction]);
        setText('');
        setAmount('');
      }
    }
  };

  const generateID = () => {
    return Math.floor(Math.random() * 100000000);
  };

  const removeTransaction = (id) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
  };

  // const updateLocalStorage = () => {
  //   localStorage.setItem('transactions', JSON.stringify(transactions));
  // };

  const getTotalBalance = () => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const updateValues = () => {
    const total = getTotalBalance().toFixed(2);
    const income = transactions
      .filter(item => item.amount > 0)
      .reduce((acc, item) => acc + item.amount, 0)
      .toFixed(2);
    const expense = (
      transactions
        .filter(item => item.amount < 0)
        .reduce((acc, item) => acc + item.amount, 0) * -1
    ).toFixed(2);

    document.getElementById('balance').innerText = `$${total}`;
    document.getElementById('money-plus').innerText = `$${income}`;
    document.getElementById('money-minus').innerText = `$${expense}`;
  };

  return (
    <div>
      
      <h2>Expense Tracker</h2>

      <div className="container">
        <h4>Your Balance</h4>
        <h1 id="balance">$0.00</h1>

        <div className="inc-exp-container">
          <div>
            <h4>Income</h4>
            <p id="money-plus" className="money plus">+$0.00</p>
          </div>
          <div>
            <h4>Expense</h4>
            <p id="money-minus" className="money minus">-$0.00</p>
          </div>
        </div>

        <h3>History</h3>
        <ul id="list" className="list">
          {transactions.map(transaction => (
            <li key={transaction.id} className={transaction.amount < 0 ? 'minus' : 'plus'}>
              {transaction.text} <span>${transaction.amount}</span>
              <button className="delete-btn" onClick={() => removeTransaction(transaction.id)}>x</button>
            </li>
          ))}
        </ul>

        <h3>Add new transaction</h3>
        <form onSubmit={addTransaction}>
          <div className="form-control">
            <label htmlFor="text">Text</label>
            <input type="text" id="text" placeholder="Enter text..." value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">
              Amount <br />
              (negative - expense, positive - income)
            </label>
            <input type="number" id="amount" placeholder="Enter amount..." value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button className="btn" type="submit">Add transaction</button>
        </form>
      </div>
    </div>
  );
}

export default App;
