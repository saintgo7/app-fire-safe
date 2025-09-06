import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import EmergencyReport from './pages/EmergencyReport';
import SafetyCheck from './pages/SafetyCheck';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emergency" element={<EmergencyReport />} />
            <Route path="/safety-check" element={<SafetyCheck />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;