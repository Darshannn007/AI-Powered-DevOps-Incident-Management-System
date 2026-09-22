import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/authContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
