import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(
        "/api/v1/restaurant/getRestaurantDetails",
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setRestaurant(response.data.data);
    } catch (error) {
      console.error(
        "Failed to fetch restaurant:",
        error.response?.data || error
      );
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "/api/v1/restaurant/loginRestaurant",
        credentials,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setRestaurant(response.data.data);
      await fetchRestaurant(); // Sync with backend immediately after login
      console.log("Login response:", response.data.data);
      return response.data.data; // Return user data for immediate use
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "/api/v1/restaurant/logoutRestaurant",
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setRestaurant(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <RestaurantContext.Provider
      value={{ restaurant, login, logout, loading, fetchRestaurant }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
