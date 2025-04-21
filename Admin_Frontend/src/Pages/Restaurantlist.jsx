import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Utensils, MapPin, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("/api/v1/admin/getAllRestaurants", {
        withCredentials: true,
      });
      setRestaurants(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch restaurants");
      setLoading(false);
      toast.error("Failed to fetch restaurants");
    }
  };

  // Delete a restaurant
  const handleDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      const previousRestaurants = [...restaurants];
      // Optimistically update UI
      setRestaurants(
        restaurants.filter(
          (restaurant) => restaurant._id !== restaurantToDelete
        )
      );

      const response = await axios.delete("/api/v1/admin/removeRestaurant", {
        data: { _id: restaurantToDelete },
        withCredentials: true,
      });

      console.log("Delete response:", response.data); // Debug
      toast.success("Restaurant deleted successfully");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      // Roll back on failure
      setRestaurants(previousRestaurants);
      toast.error(
        "Failed to delete restaurant: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setShowPopup(false);
      setRestaurantToDelete(null);
    }
  };

  // Show delete confirmation popup
  const confirmDelete = (id) => {
    setRestaurantToDelete(id);
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setRestaurantToDelete(null);
  };

  // Fetch on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="bg-gray-100 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Our Restaurants</h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && restaurants.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">No active restaurants found</p>
          </div>
        )}

        {/* Restaurants Grid */}
        {!loading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-lg p-6 flex flex-col" // No shadow-md
              >
                {/* Image */}
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={restaurant.image || "/placeholder-restaurant.jpg"}
                    alt={restaurant.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {restaurant.name}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Utensils className="h-5 w-5 mr-2 text-orange-400" />
                  <p>{restaurant.cuisine || "Various Cuisines"}</p>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-orange-400" />
                  <p>{restaurant.address || "No address provided"}</p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => confirmDelete(restaurant._id)}
                  className="mt-auto flex items-center justify-center w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 roundedtransition-colors duration-300 rounded"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete Restaurant
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 pointer-events-none">
          <div className="bg-white text-gray-800 rounded-lg p-6 w-full max-w-md pointer-events-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <button onClick={closePopup}>
                <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this restaurant? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closePopup}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
