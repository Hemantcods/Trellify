import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "./auth.api";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await authApi.me();
        setUser(response.data)
      } catch (error) {
        console.error(error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    };
    getCurrentUser()
  }, [])
  const logout = async() => {
    try{
    await authApi.signout()
    }finally{
      setUser(null)
    }
  }
  return <AuthContext.Provider value={{
    user, isLoading,isAuthenticated:user!==null,logout}}>
    {children}
  </AuthContext.Provider>
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};