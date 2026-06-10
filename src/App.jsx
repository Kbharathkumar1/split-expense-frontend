// App.jsx
// Ee file — meeru app ki brain laantidi!
// Anni pages ikkade connect avutayi — Router ikkade set avutundi

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail';
import AddExpense from './pages/AddExpense';

// ✅ Protected Route — Login kaani vaallani Dashboard ki raakunda aaputhundi
function ProtectedRoute({ children }) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route — login ki redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public pages — login avvakundane access */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected pages — login ayinaaka matrame access */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/create-group" element={
          <ProtectedRoute><CreateGroup /></ProtectedRoute>
        } />
        <Route path="/group/:groupId" element={
          <ProtectedRoute><GroupDetail /></ProtectedRoute>
        } />
        <Route path="/group/:groupId/add-expense" element={
          <ProtectedRoute><AddExpense /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;