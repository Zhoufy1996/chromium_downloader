import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.global.css';
import AppRoutes from './app/AppRoutes';
import Header from './app/Header';
import SubHeader from './app/SubHeader';
import IpcListener from './components/IpcListener';
import ChromiumContainer from './stores/chromium';
import { isMainWindow } from './utils';

export default function App() {
  const isMain = isMainWindow();
  return (
    <ChromiumContainer.Provider>
      <Router>
        <IpcListener />
        {isMain ? <Header /> : <SubHeader />}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <AppRoutes />
        </div>
      </Router>
    </ChromiumContainer.Provider>
  );
}
