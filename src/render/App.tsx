import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.global.css';
import AppRoutes from './app/AppRoutes';
import Header from './app/Header';
import ChromiumContainer from './stores/chromium';
import IpcResContainer from './stores/ipcRes';

export default function App() {
  return (
    <ChromiumContainer.Provider>
      <IpcResContainer.Provider>
        <Router>
          <Header />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <AppRoutes />
          </div>
        </Router>
      </IpcResContainer.Provider>
    </ChromiumContainer.Provider>
  );
}
