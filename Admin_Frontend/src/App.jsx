import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Layout";
import FoodItemsTable from "./Pages/Foods";
import Foods from "./Pages/Foods";
import Order from "./Pages/Order";
import Users from "./Pages/Users";
import Login from "./Pages/Login";
import Error from "./Pages/Error";
import ForgotPassword from "./Pages/ForgetPassword";
import RestaurantsList from "./Pages/Restaurantlist";
import Report from "./Pages/Reports";
import { AdminProvider } from "./AdminContext";
import ProtectedRoute from "./Components/ProtectedRoutes";
function App() {
  return (
    <>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="forgetPassword" element={<ForgotPassword />} />
              <Route index element={<Dashboard />} />
              <Route path="*" element={<Error />} />
              <Route element={<ProtectedRoute />}>
                <Route path="foods" element={<Foods />} />
                <Route path="order" element={<Order />} />
                <Route path="users" element={<Users />} />
                <Route path="foodItems" element={<FoodItemsTable />} />
                <Route path="restaurant" element={<RestaurantsList />} />
                <Route path="report" element={<Report />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </>
  );
}

export default App;
