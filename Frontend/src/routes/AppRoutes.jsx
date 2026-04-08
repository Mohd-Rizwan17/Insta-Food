import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Saved from "../Pages/general/Saved";
import UserProfile from "../Pages/general/UserProfile";
import BottomNav from "../components/BottomNav";
import Home from "../Pages/general/Home";
import ChooseRegister from "../Pages/auth/ChooseRegister";
import UserRegister from "../Pages/auth/UserRegister";
import UserLogin from "../Pages/auth/UserLogin";
import FoodPartnerRegister from "../Pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../Pages/auth/FoodPartnerLogin";
import CreateFood from "../Pages/food-partner/CreateFood";
import Profile from "../Pages/food-partner/Profile";

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
        <Home />
        <BottomNav />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <UserProfile />
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
  { path: "/food-partner/:id", element: <Profile /> },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
