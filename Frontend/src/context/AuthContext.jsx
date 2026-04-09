import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [orders, setOrders] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/auth/session");
        if (response.data.authenticated && response.data.role === "user") {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        orders,
        setOrders,
        following,
        setFollowing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
