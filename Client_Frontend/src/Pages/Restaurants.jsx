import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/api/v1/user/restaurants", {
          withCredentials: true,
        });
        setRestaurants(response.data.data);
      } catch (error) {
        setError(
          error.response?.status === 404
            ? "No restaurants found"
            : "Failed to load restaurants. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-600 mb-4 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">
          Our Restaurants
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/menu?restaurant=${restaurant._id}`} // Link to Menu with restaurant filter
              className="inset-0 w-full h-full object-cover p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-72 w-full overflow-hidden">
                <img
                  src={restaurant.image || "/fallback-image.jpg"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-lg "
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600 mt-1">{restaurant.address}</p>
                <p className="text-gray-600">{restaurant.phone}</p>
                <p className="text-gray-700 mt-2 line-clamp-2">
                  {restaurant.description || "No description available"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Restaurants;
