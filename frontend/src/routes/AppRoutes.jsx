import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Mainlayout from '../layouts/Mainlayout';
import Dashboard from '../pages/Dashboard';
import Incidents from '../pages/Incidents';
import Alerts from '../pages/Alerts';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected App Routes (Login ke bina access nahi honge) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Mainlayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/alerts" element={<Alerts />} />
        </Route>
      </Route>

      {/* Wildcard fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
