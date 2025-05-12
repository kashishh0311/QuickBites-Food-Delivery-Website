import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRestaurant } from "../RestaurantContext";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Image,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

function Foods() {
  const { restaurant, loading: contextLoading } = useRestaurant();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [categories, setCategories] = useState([]);
  const [food, setFood] = useState({
    _id: "",
    name: "",
    category: "",
    price: "",
    foodImage: null,
    imagePreview: "",
    description: "",
    ingredients: "",
    isAvailable: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    show: false,
    message: "",
    action: null,
  });
  const [foodPopup, setFoodPopup] = useState(null);
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const formRef = useRef(null);

  const fetchData = async () => {
    if (!restaurant?._id) {
      setError("Please log in to view food items");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/v1/restaurant/getAllFoods", {
        withCredentials: true,
      });
      console.log("Fetch data response:", response.data);
      setData(response.data.data || []);
      if (response.data.data.length === 0) {
        setError("No food items found for your restaurant");
      }
    } catch (error) {
      console.error("Fetch data error:", error.response || error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch food items";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/v1/restaurant/getAllCategory", {
        withCredentials: true,
      });
      console.log("Fetch categories response:", response.data);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error.response || error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch categories";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const response = await axios.post(
        `/api/v1/restaurant/getAllFoodBySearch`,
        {
          search: searchQuery,
        }
      );
      const results = response.data.data || [];
      setSearchResult(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResult([]);
      toast.error("Failed to fetch search results", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
    }
  };

  useEffect(() => {
    if (!contextLoading && restaurant) {
      fetchData();
      fetchCategories();
    }
  }, [restaurant, contextLoading]);

  // Handle search and price filtering
  useEffect(() => {
    let results = searchQuery.trim() ? searchResult : data;
    const { min: minPrice, max: maxPrice } = priceFilter;

    // Apply client-side price filtering
    if (minPrice || maxPrice) {
      results = results.filter((food) => {
        const matchesPrice =
          (!minPrice || food.price >= parseFloat(minPrice)) &&
          (!maxPrice || food.price <= parseFloat(maxPrice));
        return matchesPrice;
      });
    }

    setFilteredData(results);
  }, [searchQuery, priceFilter, searchResult, data]);

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults();
    } else {
      setSearchResult([]);
    }
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value });
    setError(null);
  };

  const handlePriceFilterChange = (e) => {
    const { name, value } = e.target;
    // Allow empty strings or non-negative numbers
    if (value === "" || parseFloat(value) >= 0) {
      setPriceFilter({ ...priceFilter, [name]: value });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFood({
        ...food,
        foodImage: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !food.name ||
      !food.category ||
      !food.price ||
      !food.description ||
      !food.ingredients.trim()
    ) {
      setError("Please fill all required fields, including ingredients");
      toast.error("Please fill all required fields", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("description", food.description);
      formData.append("price", food.price);
      formData.append("category", food.category);
      formData.append("isAvailable", food.isAvailable);
      formData.append("ingredients", food.ingredients);
      if (food.foodImage instanceof File) {
        formData.append("foodImage", food.foodImage);
      }

      if (food._id) {
        formData.append("_id", food._id);
        setModal({
          show: true,
          message: "Are you sure you want to update this food item?",
          action: async () => {
            await axios.put("/api/v1/restaurant/updateFood", formData, {
              withCredentials: true,
            });
            toast.success("Food updated successfully!", {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: true,
              style: {
                backgroundColor: "black",
                color: "white",
                width: "300px",
              },
            });
            await fetchData();
            formEmpty();
            setShowAddFood(false);
            setModal({ show: false, message: "", action: null });
          },
        });
      } else {
        await axios.post("/api/v1/restaurant/addFood", formData, {
          withCredentials: true,
        });
        toast.success("Food added successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: { backgroundColor: "black", color: "white", width: "300px" },
        });
        await fetchData();
        formEmpty();
        setShowAddFood(false);
      }
    } catch (error) {
      console.error("Submit error:", error.response || error);
      const errorMsg =
        error.response?.data?.message || error.message || "Operation failed";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "black", color: "white", width: "300px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editFood = (selectedFood) => {
    setFood({
      _id: selectedFood._id,
      name: selectedFood.name,
      category: selectedFood.category,
      price: selectedFood.price,
      foodImage: null,
      imagePreview: selectedFood.foodImage || "",
      description: selectedFood.description,
      ingredients: Array.isArray(selectedFood.ingredients)
        ? selectedFood.ingredients.join(", ")
        : selectedFood.ingredients || "",
      isAvailable: selectedFood.isAvailable,
    });
    setShowAddFood(true);
    setError(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const removeFood = (foodId) => {
    setModal({
      show: true,
      message: "Are you sure you want to delete this food item?",
      action: async () => {
        setIsLoading(true);
        setError(null);
        try {
          await axios.delete("/api/v1/restaurant/deleteFood", {
            data: { _id: foodId },
            withCredentials: true,
          });
          toast.success("Food removed successfully!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            style: { backgroundColor: "black", color: "white", width: "300px" },
          });
          await fetchData();
          setModal({ show: false, message: "", action: null });
        } catch (error) {
          console.error("Delete error:", error.response || error);
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete food";
          setError(errorMsg);
          toast.error(errorMsg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            style: { backgroundColor: "black", color: "white", width: "300px" },
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const showFoodDetails = (item) => {
    setFoodPopup(item);
  };

  const formEmpty = () => {
    setFood({
      _id: "",
      name: "",
      category: "",
      price: "",
      foodImage: null,
      imagePreview: "",
      description: "",
      ingredients: "",
      isAvailable: true,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div className="p-8 bg-gray-100 rounded-xl w-4/5 mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 w-80">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="min"
                  placeholder="Min Price"
                  value={priceFilter.min}
                  onChange={handlePriceFilterChange}
                  className="pl-8 border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max Price"
                  value={priceFilter.max}
                  onChange={handlePriceFilterChange}
                  className="pl-8 border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
            onClick={() => {
              setShowAddFood(!showAddFood);
              if (!showAddFood) formEmpty();
            }}
            disabled={isLoading}
          >
            {showAddFood ? (
              <>
                <X size={20} />
                Close
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Food
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <XCircle size={20} />
            {error}
          </div>
        )}

        {showAddFood && (
          <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {food._id ? (
                <>
                  <Edit size={20} />
                  Edit Food
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add New Food
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Food Name"
                value={food.name}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full hover:ring-1 hover:ring-orange-500 focus:outline-none"
                required
                disabled={isLoading}
              />
              <select
                name="category"
                value={food.category}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full hover:ring-1 hover:ring-orange-500 focus:outline-none"
                required
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option
                    key={category._id || category}
                    value={category._id || category}
                  >
                    {category.name || category}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={food.description}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full col-span-1 hover:ring-1 hover:ring-orange-500 focus:outline-none"
                required
                disabled={isLoading}
              />
              <div className="flex flex-col">
                <label className="flex items-center gap-2 mb-2">
                  <Image size={20} />
                  Food Image
                </label>
                <input
                  type="file"
                  name="foodImage"
                  onChange={handleImageChange}
                  className="border border-gray-300 p-2 rounded-lg w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-400 file:text-white hover:file:bg-orange-500 transition duration-200"
                  accept="image/*"
                  required={!food._id}
                  disabled={isLoading}
                />
                {food.imagePreview && (
                  <img
                    src={food.imagePreview}
                    alt="Preview"
                    className="mt-2 w-20 h-20 rounded-lg object-cover border"
                  />
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={food.price}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full pl-8 hover:ring-1 hover:ring-orange-500 focus:outline-none"
                  required
                  disabled={isLoading}
                  min="0"
                />
              </div>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isAvailable"
                    value="true"
                    checked={food.isAvailable === true}
                    onChange={() => setFood({ ...food, isAvailable: true })}
                    disabled={isLoading}
                  />
                  <CheckCircle size={20} className="text-green-500" />
                  Available
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isAvailable"
                    value="false"
                    checked={food.isAvailable === false}
                    onChange={() => setFood({ ...food, isAvailable: false })}
                    disabled={isLoading}
                  />
                  <XCircle size={20} className="text-red-500" />
                  Not Available
                </label>
              </div>
              <input
                type="text"
                name="ingredients"
                placeholder="Ingredients (comma separated, e.g., Salt, Pepper)"
                value={food.ingredients}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full col-span-2 hover:ring-1 hover:ring-orange-500 focus:outline-none"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-orange-400 text-white py-2 px-6 rounded-lg w-full col-span-2 hover:bg-orange-500 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Processing..."
                ) : food._id ? (
                  <>
                    <Edit size={20} />
                    Update Food
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Add Food
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredData.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => showFoodDetails(item)}
            >
              <div className="p-4">
                <img
                  src={item.foodImage}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              <div className="p-4 pt-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {item.name}
                </h2>
                <p className="text-orange-500 font-semibold">₹{item.price}</p>
                <p className="text-gray-600">{item.category}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-1 px-4 rounded disabled:opacity-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      editFood(item);
                    }}
                    disabled={isLoading}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded disabled:opacity-50 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFood(item._id);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                    {isLoading ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {foodPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{foodPopup.name}</h2>
              <button onClick={() => setFoodPopup(null)}>
                <X size={24} />
              </button>
            </div>
            <img
              src={foodPopup.foodImage}
              alt={foodPopup.name}
              className="w-full h-48 rounded-lg object-cover mb-4"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
            <p className="text-gray-700 mb-2">
              <strong>Description:</strong> {foodPopup.description}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Price:</strong> ₹{foodPopup.price}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Category:</strong> {foodPopup.category}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Available:</strong>{" "}
              {foodPopup.isAvailable ? (
                <span className="inline text-gray-800">YES</span>
              ) : (
                <span className="inline text-gray-800">NO</span>
              )}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Ingredients:</strong> {foodPopup.ingredients.join(", ")}
            </p>
            <button
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center gap-2"
              onClick={() => setFoodPopup(null)}
            >
              <X size={20} />
              Close
            </button>
          </div>
        </div>
      )}

      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h2 className="text-xl mb-4">{modal.message}</h2>
            <div className="flex justify-around mt-4">
              <button
                className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                onClick={() => {
                  modal.action();
                }}
              >
                <CheckCircle size={20} />
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-600 hover:text-white flex items-center gap-2"
                onClick={() =>
                  setModal({ show: false, message: "", action: null })
                }
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        style={{ width: "500px" }}
      />
    </div>
  );
}

export default Foods;
