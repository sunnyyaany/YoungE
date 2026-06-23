import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Match from './pages/Match';
import Eros from './pages/Eros';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/match" element={<Match />} />
            <Route path="/eros" element={<Eros />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
