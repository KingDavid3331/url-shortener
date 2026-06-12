import { useState } from 'react';
import { isLoggedIn } from './api/client';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  return loggedIn
    ? <Dashboard onLogout={() => setLoggedIn(false)} />
    : <Auth onLogin={() => setLoggedIn(true)} />;
}
