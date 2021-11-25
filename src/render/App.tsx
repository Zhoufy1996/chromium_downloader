import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LocalChromiumContainer from './stores/localChromium';
import './App.global.css';
import AppRoutes from './app/AppRoutes';
import Header from './app/Header';

export default function App() {
  return (
    <LocalChromiumContainer.Provider>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
    </LocalChromiumContainer.Provider>
  );
}
