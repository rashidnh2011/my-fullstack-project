import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Alternative: If you prefer default export
// const ProtectedRoute = () => { ... };
// export default ProtectedRoute;