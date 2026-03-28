import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister";
import ChooseRegister from "../pages/auth/ChooseRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import Saved from "../pages/general/Saved";
import BottomNav from "../components/BottomNav";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/Profile";
import Home from "../Pages/general/Home";

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
