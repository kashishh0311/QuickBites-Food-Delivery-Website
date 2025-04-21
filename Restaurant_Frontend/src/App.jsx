import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Layout";
// import FoodItemsTable from "./Pages/Foods";
import Foods from "./Pages/Foods";
import Order from "./Pages/Order";
import Feedback from "./Pages/Feedback";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Error from "./Pages/Error";
import Profile from "./Pages/Profile";
import RestaurantPanel from "./Pages/Reports";
import PasswordResetFlow from "./Pages/ForgotPassword";
import { RestaurantProvider } from "./RestaurantContext";
import ProtectedRoute from "./Components/ProtectedRoutes";
function App() {
  return (
    <>
      <RestaurantProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgetPassword" element={<PasswordResetFlow />} />
              <Route index element={<Dashboard />} />
              <Route path="*" element={<Error />} />
              <Route element={<ProtectedRoute />}>
                <Route path="foods" element={<Foods />} />
                <Route path="order" element={<Order />} />
                <Route path="profile" element={<Profile />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="reports" element={<RestaurantPanel />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </RestaurantProvider>
    </>
  );
}

export default App;
