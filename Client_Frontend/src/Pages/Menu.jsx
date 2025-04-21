import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Card from "../Components/Card";
import axios from "axios";

function Menu() {
  const [foodData, setFoodData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    searchParams.get("restaurant") || ""
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let foodResponse;
        if (selectedRating && selectedRating !== "") {
          foodResponse = await axios.get("/api/v1/user/getAllFoodByRating", {
            params: {
              restaurantId: selectedRestaurant || undefined,
              rating: selectedRating,
            },
            withCredentials: true,
          });
        } else if (selectedRestaurant) {
          foodResponse = await axios.get("/api/v1/user/getAllFood", {
            params: { restaurantId: selectedRestaurant },
            withCredentials: true,
          });
        } else {
          foodResponse = await axios.get("/api/v1/user/getAllFood", {
            withCredentials: true,
          });
        }

        const [categoriesResponse, restaurantsResponse] = await Promise.all([
          axios.get("/api/v1/user/getAllCategory", { withCredentials: true }),
          axios.get("/api/v1/user/restaurants", { withCredentials: true }),
        ]);

        console.log(
          "Food Response:",
          JSON.stringify(foodResponse.data, null, 2)
        );
        console.log("Food Data:", foodResponse.data.data);
        setFoodData(foodResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
        setRestaurants(restaurantsResponse.data.data || []);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedRating, selectedRestaurant]);

  const filteredFoodData = useMemo(() => {
    console.log("Filtering:", {
      foodDataLength: foodData.length,
      foodData: foodData,
      selectedCategory,
      minPrice,
      maxPrice,
      selectedAvailability,
      selectedRating,
    });

    return foodData.filter((food) => {
      const matchesCategory =
        !selectedCategory || food.category === selectedCategory;
      const matchesPrice =
        (!minPrice || food.price >= parseFloat(minPrice)) &&
        (!maxPrice || food.price <= parseFloat(maxPrice));
      const matchesAvailability =
        selectedAvailability === "" ||
        food.isAvailable.toString() === selectedAvailability;
      const matchesRating =
        !selectedRating ||
        (food.averageRating &&
          Math.abs(food.averageRating - parseFloat(selectedRating)) <= 0.5);

      const passes =
        matchesCategory && matchesPrice && matchesAvailability && matchesRating;
      console.log(`Food ${food.name || "Unknown"} passes:`, passes, {
        matchesCategory,
        matchesPrice,
        matchesAvailability,
        matchesRating,
      });
      return passes;
    });
  }, [
    foodData,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedAvailability,
    selectedRating,
  ]);

  const resetFilters = async () => {
    const restaurantIdFromUrl = searchParams.get("restaurant") || "";
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedRating("");
    setSelectedAvailability("");
    setSelectedRestaurant(restaurantIdFromUrl);
    setSearchParams(
      restaurantIdFromUrl ? { restaurant: restaurantIdFromUrl } : {}
    );
    setIsLoading(true);
    try {
      const response = await axios.get("/api/v1/user/getAllFood", {
        params: restaurantIdFromUrl
          ? { restaurantId: restaurantIdFromUrl }
          : {},
        withCredentials: true,
      });
      console.log("Reset Response:", JSON.stringify(response.data, null, 2));
      setFoodData(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error(
        "Error resetting filters:",
        error.response?.data || error.message
      );
      setError("Failed to load food items.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <p className="text-red-500 mb-6 text-xl">{error}</p>
          <button
            onClick={resetFilters}
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 relative">
      <div
        className="pr-2 overflow-y-auto h-[95vh]"
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 tracking-wide">
            Discover Delicious Flavors
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Explore our carefully curated menu, where every dish tells a story
            and every bite is a culinary adventure.
          </p>
        </div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-start">
          <button
            onClick={() => setShowFilters(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          {showFilters && (
            <div className="fixed top-20 left-0 w-64 h-[95vh] bg-white shadow-lg p-6 rounded-r-lg z-20 border-r-4 border-orange-500 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                    Price Range (₹)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                    Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors"
                  >
                    <option value="">All Ratings</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-gray-700 text-xs font-medium">
                    Availability
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors"
                  >
                    <option value="">All</option>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div>
                <button
                  onClick={resetFilters}
                  className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFoodData.length > 0 ? (
                filteredFoodData.map((food) => (
                  <div
                    key={food._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Card id={food._id} {...food} />
                  </div>
                ))
              ) : foodData.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-xl mb-4">
                    No food items available at the moment.
                  </p>
                  <button className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                    <Link to="/restaurants">View Restaurants</Link>
                  </button>
                </div>
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-xl mb-4">
                    No dishes match your current selection.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setShowFilters(false)}
        ></div>
      )}
    </div>
  );
}

export default Menu;
