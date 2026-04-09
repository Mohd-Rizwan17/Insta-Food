import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import "./styles/theme.css";
import "./styles/toast.css";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import Saved from "./Pages/general/Saved";
import UserProfile from "./Pages/general/UserProfile";
import BottomNav from "./components/BottomNav";
import Home from "./Pages/general/Home";
import ChooseRegister from "./Pages/auth/ChooseRegister";
import UserRegister from "./Pages/auth/UserRegister";
import UserLogin from "./Pages/auth/UserLogin";
import FoodPartnerRegister from "./Pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "./Pages/auth/FoodPartnerLogin";
import CreateFood from "./Pages/food-partner/CreateFood";
import Profile from "./Pages/food-partner/Profile";

function App() {
  const [orders, setOrders] = useState([]);
  const [following, setFollowing] = useState([]);

  const router = createBrowserRouter([
    { path: "/register", element: <ChooseRegister /> },
    { path: "/user/register", element: <UserRegister /> },
    { path: "/user/login", element: <UserLogin /> },
    { path: "/food-partner/register", element: <FoodPartnerRegister /> },
    { path: "/food-partner/login", element: <FoodPartnerLogin /> },
    {
      path: "/",
      element: (
        <>
          <Home
            orders={orders}
            setOrders={setOrders}
            following={following}
            setFollowing={setFollowing}
          />
          <BottomNav />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <UserProfile orders={orders} following={following} />
          <BottomNav />
        </>
      ),
    },
    {
      path: "/saved",
      element: (
        <>
          <Saved />
          <BottomNav />
        </>
      ),
    },
    { path: "/create-food", element: <CreateFood /> },
    {
      path: "/food-partner/:id",
      element: (
        <Profile
          orders={orders}
          setOrders={setOrders}
          following={following}
          setFollowing={setFollowing}
        />
      ),
    },
  ]);

  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
