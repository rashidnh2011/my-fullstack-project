import { createContext, useContext, ReactNode, useState } from 'react';

// Define your context type
type AuthContextType = {
  currentUser: any; // Replace 'any' with your user type
  login: (credentials: any) => Promise<void>;
  logout: () => void;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null); // Replace 'any' with your user type

  const login = async (credentials: any) => {
    // Your login logic here
    setCurrentUser({ /* user data */ });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};