import { useContext } from 'react';
import { AuthContext } from '../features/authContext';

// Simple custom hook jisse koi bhi component easily auth state use kar sake
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
