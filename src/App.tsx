import React from 'react';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { initializeFirebaseApp } from 'lib/firebase/firebase';
import { AuthProvider } from 'feature/auth/provider/AuthProvider';

import { IndexPage } from 'components/Pages/IndexPage';
import { AccountCreatePage } from 'components/Pages/AccountCreatePage';
import { AccountLoginPage } from 'components/Pages/AccountLoginPage';
import { AccountRegisterPage } from 'components/Pages/AccountRegisterPage';

initializeFirebaseApp();

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/app/" element={<IndexPage />} />
          <Route path="/app/account/create" element={<AccountCreatePage />} />
          <Route path="/app/account/login" element={<AccountLoginPage />} />
          <Route path="/app/account/register" element={<AccountRegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
