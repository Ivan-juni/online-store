import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Games from './components/Games/Games';

function App() {
  return (
    <div className="App">
      <Header />
      <Games />
      <Footer />
    </div>
  );
}

export default App;
