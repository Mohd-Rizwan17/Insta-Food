import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/user/me");
      if (response?.data?.user) {
        setUser(response.data.user);
      } else if (response?.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.log(
        "Auth fetch user error",
        error.response?.data || error.message,
      );
      try {
        const response = await api.get("/api/auth/session");
        if (response?.data?.user) {
          setUser(response.data.user);
        }
      } catch (fallbackError) {
        console.log(
          "Auth fallback session error",
          fallbackError.response?.data || fallbackError.message,
        );
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
