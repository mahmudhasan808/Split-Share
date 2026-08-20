import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  switchRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to John Doe (Member) or Alex Rivera (Owner) so app opens fully populated
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[1]); // John Doe (Member)

  const switchRole = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    } else if (role === 'guest') {
      setCurrentUser(INITIAL_USERS.find(u => u.id === 'usr_guest_1') || null);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Fallback: log in as member
    setCurrentUser(INITIAL_USERS[1]);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role: 'member',
      verified: true,
      reputation: 5.0,
      joinedDate: new Date().toISOString().split('T')[0],
      ownedTeamsCount: 0,
      joinedTeamsCount: 0,
      status: 'active'
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  const isAuthenticated = currentUser !== null && currentUser.role !== 'guest';
  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser?.role === 'owner';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        login,
        register,
        logout,
        updateCurrentUser,
        isAuthenticated,
        isAdmin,
        isOwner
      }}
    >
      {children}
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
