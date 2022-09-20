import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRouter from './components/AppRouter';

function App() {
  // Opening the Cart
  const [isCartActive, setCartActive] = useState(false);

  return (
    <div className="wrapper">
      <Header setCartActive={setCartActive}/>
      <div className="main">
        <AppRouter isCartActive={isCartActive}/>
      </div>
      <Footer />
    </div>
  );
}

export default App;
