import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('loopwear_token') || null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load users
  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      try {
        // Fetch all available demo users
        const usersRes = await apiClient.getUsers();
        if (usersRes.success && usersRes.users) {
          setAllUsers(usersRes.users);
        }

        // Check current session
        const storedToken = localStorage.getItem('loopwear_token');
        const storedUserId = localStorage.getItem('loopwear_userId');

        if (storedToken || storedUserId) {
          const meRes = await apiClient.getMe(storedUserId);
          if (meRes.success && meRes.user) {
            setCurrentUser(meRes.user);
          } else if (usersRes.users && usersRes.users.length > 0) {
            setCurrentUser(usersRes.users[0]);
          }
        } else if (usersRes.users && usersRes.users.length > 0) {
          // Default to first user for seamless demo
          setCurrentUser(usersRes.users[0]);
          localStorage.setItem('loopwear_userId', usersRes.users[0].id);
        }
      } catch (err) {
        console.error('[AuthContext] Init error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await apiClient.login({ identifier, password });
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setToken(res.token);
        localStorage.setItem('loopwear_token', res.token);
        localStorage.setItem('loopwear_userId', res.user.id);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed.' };
    } catch (err) {
      return { success: false, message: err.message || 'Server error occurred during login.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiClient.register(userData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setToken(res.token);
        localStorage.setItem('loopwear_token', res.token);
        localStorage.setItem('loopwear_userId', res.user.id);
        
        // Refresh users list
        const usersRes = await apiClient.getUsers();
        if (usersRes.success && usersRes.users) setAllUsers(usersRes.users);

        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err) {
      return { success: false, message: err.message || 'Server error occurred during registration.' };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('loopwear_token');
    localStorage.removeItem('loopwear_userId');
    setToken(null);
    // Keep first demo user active so browsing works smoothly or null
    if (allUsers.length > 0) {
      setCurrentUser(allUsers[0]);
      localStorage.setItem('loopwear_userId', allUsers[0].id);
    } else {
      setCurrentUser(null);
    }
  };

  const switchUser = (userId) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('loopwear_userId', target.id);
      // Switch demo token
      const demoToken = `demo_jwt_token_${target.id}`;
      setToken(demoToken);
      localStorage.setItem('loopwear_token', demoToken);
    }
  };

  const refreshUserData = async () => {
    if (!currentUser) return;
    try {
      const meRes = await apiClient.getMe(currentUser.id);
      if (meRes.success && meRes.user) {
        setCurrentUser(meRes.user);
      }
      const usersRes = await apiClient.getUsers();
      if (usersRes.success && usersRes.users) {
        setAllUsers(usersRes.users);
      }
    } catch (e) {
      console.warn('Failed refreshing user data:', e);
    }
  };

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      allUsers,
      isLoading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      switchUser,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
