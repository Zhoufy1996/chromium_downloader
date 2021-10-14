import React from 'react';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import LocalChromiumContainer from './stores/localChromium';
import './App.global.css';
import CustomDrawer from './app/Drawer';
import AppRoutes from './app/AppRoutes';
import { defaultTheme } from './theme/default';

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <LocalChromiumContainer.Provider>
        <Router>
          <CustomDrawer>
            <AppRoutes />
          </CustomDrawer>
        </Router>
      </LocalChromiumContainer.Provider>
    </ThemeProvider>
  );
}
