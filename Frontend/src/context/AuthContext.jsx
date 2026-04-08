import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const setStoredUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch {
    // ignore
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useCallback((userData) => {
    setUserState(userData);
    if (userData) {
      setStoredUser(userData);
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const fetchUser = useCallback(() => {
    // User is loaded from localStorage on init
    const storedUser = getStoredUser();
    setUserState(storedUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Load from localStorage on mount
    const storedUser = getStoredUser();
    if (storedUser) {
      setUserState(storedUser);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
