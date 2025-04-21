import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RestaurantContext } from "../RestaurantContext";
const ProtectedRoute = () => {
  const { restaurant, loading } = useContext(RestaurantContext);

  if (loading) return <p>Loading...</p>; // Show loading while checking auth

  return restaurant ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
