import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import Details from "./Pages/Details";
import Order from "./Pages/Order";
import Menu from "./Pages/Menu";
import CartBtn from "./Components/CartButton";
import Signup from "./Pages/Signup";
import Layout from "./Layout";
import Error from "./Pages/Error";
import Profile from "./Pages/Profile";
import { CartProvider } from "./CartContext";
import Delivery from "./Pages/Delivery";
import ProtectedRoute from "./Components/ProtectedRoutes";
import { UserProvider } from "./UserContext";
import ChangePassword from "./Pages/ChangePassword";
import PasswordResetFlow from "./Pages/ForgotPassword";
import Restaurants from "./Pages/Restaurants"; // New import

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="food/:id" element={<Details />} />
              <Route path="restaurants" element={<Restaurants />} />{" "}
              {/* New route */}
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<Error />} />
              <Route path="changePassword" element={<ChangePassword />} />
              <Route path="reset-password" element={<PasswordResetFlow />} />
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<Profile />} />
                <Route path="cart" element={<Cart />} />
                <Route path="order" element={<Order />} />
                <Route path="delivery" element={<Delivery />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
