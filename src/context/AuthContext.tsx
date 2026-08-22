import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      avatar
      role
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        avatar
        role
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        avatar
        role
      }
    }
  }
`;

interface AuthContextType {
  currentUser: any | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  updateCurrentUser: (updates: any) => void;
  switchRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const { data, loading: queryLoading, error, client } = useQuery(ME_QUERY, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!queryLoading) {
      if (data && (data as any).me) {
        setCurrentUser((data as any).me);
      } else if (error) {
        localStorage.removeItem('splitshare_token');
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    }
  }, [data, queryLoading, error]);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const login = async (email: string, password: string = "password123"): Promise<boolean> => {
    try {
      const response = await loginMutation({ variables: { email, password } });
      const responseData: any = response.data;
      if (responseData?.login) {
        localStorage.setItem('splitshare_token', responseData.login.token);
        setCurrentUser(responseData.login.user);
        client.resetStore();
        return true;
      }
    } catch (e) {
      console.error(e);
      alert(e);
    }
    return false;
  };

  const register = async (name: string, email: string, password: string = "password123"): Promise<boolean> => {
    try {
      const response = await registerMutation({ variables: { name, email, password } });
      const responseData: any = response.data;
      if (responseData?.register) {
        localStorage.setItem('splitshare_token', responseData.register.token);
        setCurrentUser(responseData.register.user);
        client.resetStore();
        return true;
      }
    } catch (e) {
      console.error(e);
      alert(e);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('splitshare_token');
    setCurrentUser(null);
    client.clearStore();
    window.location.href = "/";
  };

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'ADMIN';
  const isOwner = false; 
  const updateCurrentUser = (u: any) => {}; 

  const switchRole = () => {
    alert("Role switching is disabled in production. Please log in with a different account.");
  };

  const loading = queryLoading || isAuthLoading;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        switchRole,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isOwner,
        updateCurrentUser,
      }}
    >
      {loading && !currentUser && localStorage.getItem('splitshare_token') ? (
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
