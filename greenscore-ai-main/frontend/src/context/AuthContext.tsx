import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'SUPER_ADMIN' | 'DEPARTMENT_OFFICER' | 'CITIZEN';
  isAuthenticated: boolean;
  login: (username: string, role?: 'SUPER_ADMIN' | 'DEPARTMENT_OFFICER' | 'CITIZEN') => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: 'SUPER_ADMIN' | 'DEPARTMENT_OFFICER' | 'CITIZEN', departmentName?: string) => void;
}

const DEFAULT_ADMIN_USER: User = {
  id: 1,
  username: 'admin',
  email: 'commissioner@lucknowmc.gov.in',
  full_name: 'Dr. Anand Verma',
  role: 'SUPER_ADMIN',
  department_id: null,
  department_name: 'Municipal Corporation (Super Admin)'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('greenscore_user');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_USER;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('greenscore_token') || 'demo_token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('greenscore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('greenscore_user');
    }
  }, [user]);

  const login = async (username: string, targetRole: 'SUPER_ADMIN' | 'DEPARTMENT_OFFICER' | 'CITIZEN' = 'SUPER_ADMIN') => {
    const mockUser: User = {
      id: targetRole === 'SUPER_ADMIN' ? 1 : (targetRole === 'DEPARTMENT_OFFICER' ? 2 : 3),
      username: username,
      email: `${username}@lucknowmc.gov.in`,
      full_name: targetRole === 'SUPER_ADMIN' ? 'Dr. Anand Verma (Commissioner)' : (targetRole === 'DEPARTMENT_OFFICER' ? 'Rajesh Kumar Singh (Sanitation Officer)' : 'Amit Trivedi (Citizen)'),
      role: targetRole,
      department_id: targetRole === 'DEPARTMENT_OFFICER' ? 1 : null,
      department_name: targetRole === 'DEPARTMENT_OFFICER' ? 'Municipal Sanitation' : null
    };
    setUser(mockUser);
    setToken('jwt_token_sample');
    localStorage.setItem('greenscore_token', 'jwt_token_sample');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('greenscore_token');
    localStorage.removeItem('greenscore_user');
  };

  const switchDemoRole = (role: 'SUPER_ADMIN' | 'DEPARTMENT_OFFICER' | 'CITIZEN', departmentName?: string) => {
    let switchedUser: User;
    if (role === 'SUPER_ADMIN') {
      switchedUser = {
        id: 1,
        username: 'admin',
        email: 'commissioner@lucknowmc.gov.in',
        full_name: 'Dr. Anand Verma (Commissioner)',
        role: 'SUPER_ADMIN',
        department_id: null,
        department_name: 'Command Center'
      };
    } else if (role === 'DEPARTMENT_OFFICER') {
      switchedUser = {
        id: 2,
        username: 'officer_sanitation',
        email: 'sanitation.officer@lucknowmc.gov.in',
        full_name: 'Rajesh Kumar Singh (Lead Officer)',
        role: 'DEPARTMENT_OFFICER',
        department_id: 1,
        department_name: departmentName || 'Municipal Sanitation'
      };
    } else {
      switchedUser = {
        id: 4,
        username: 'citizen_amit',
        email: 'amit.trivedi@example.com',
        full_name: 'Amit Trivedi (Lucknow Resident)',
        role: 'CITIZEN',
        department_id: null,
        department_name: null
      };
    }
    setUser(switchedUser);
    localStorage.setItem('greenscore_user', JSON.stringify(switchedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'SUPER_ADMIN',
        isAuthenticated: !!user,
        login,
        logout,
        switchDemoRole
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
