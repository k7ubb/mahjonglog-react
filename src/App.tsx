import React from 'react';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { initializeFirebaseApp } from 'lib/firebase/firebase';
import { AuthProvider } from 'feature/auth/provider/AuthProvider';

import { IndexPage } from 'components/Pages/IndexPage';
import { AccountCreatePage } from 'components/Pages/AccountCreatePage';
import { AccountLoginPage } from 'components/Pages/AccountLoginPage';
import { AddLogPage } from 'components/Pages/AddLogPage';
import { ViewLogPage } from 'components/Pages/ViewLogPage';
import { PlayerListPage } from 'components/Pages/PlayerListPage';
import { PlayerAddPage } from 'components/Pages/PlayerAddPage';

initializeFirebaseApp();

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/app" element={<IndexPage />} />
          <Route path="/app/account/create" element={<AccountCreatePage />} />
          <Route path="/app/account/login" element={<AccountLoginPage />} />
          <Route path="/app/addlog" element={<AddLogPage />} />
          <Route path="/app/viewlog" element={<ViewLogPage />} />
          <Route path="/app/player" element={<PlayerListPage />} />
          <Route path="/app/player/:player" element={<PlayerListPage />} />
          <Route path="/app/player/add" element={<PlayerAddPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
