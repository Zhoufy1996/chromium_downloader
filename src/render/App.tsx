import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.global.css';
import AppRoutes from './app/AppRoutes';
import Header from './app/Header';
import ChromiumContainer from './stores/chromium';

export default function App() {
  return (
    <ChromiumContainer.Provider>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
    </ChromiumContainer.Provider>
  );
}
