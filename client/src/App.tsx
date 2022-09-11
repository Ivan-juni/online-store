import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <div className="wrapper">
      <Header />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
