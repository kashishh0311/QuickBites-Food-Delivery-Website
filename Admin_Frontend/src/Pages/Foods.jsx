import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Foods() {
  const [data, setData] = useState([]);
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
  const formRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/v1/admin/getAllFood");
      setData(response.data.data);
    } catch (error) {
      setError("Failed to fetch food items");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/v1/admin/getAllCategory");
      setCategories(response.data.data);
    } catch (error) {
      setError("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value });
    setError(null);
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
            await axios.put("/api/v1/admin/updateFood", formData);
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
        await axios.post("/api/v1/admin/addFood", formData);
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
      const errorMsg = error.response?.data?.message || error.message;
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
      ...selectedFood,
      foodImage: null,
      imagePreview: selectedFood.foodImage || "",
      ingredients: selectedFood.ingredients.join(", "),
    });
    setShowAddFood(true);
    setError(null);
    // Scroll to form without scrollbar
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
          await axios.delete("/api/v1/admin/deleteFood", {
            data: { _id: foodId },
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
          const errorMsg = error.response?.data?.message || error.message;
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
      {/* No fixed height or overflow, natural scrolling */}
      <div className="p-8 bg-gray-100 rounded-xl w-4/5 mx-auto">
        <div className="flex justify-end">
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:opacity-50"
            onClick={() => {
              setShowAddFood(!showAddFood);
              if (!showAddFood) formEmpty();
            }}
            disabled={isLoading}
          >
            {showAddFood ? "Close" : "Add Food"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showAddFood && (
          <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">
              {food._id ? "Edit Food" : "Add New Food"}
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
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={food.price}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full col-1 hover:ring-1 hover:ring-orange-500 focus:outline-none"
                required
                disabled={isLoading}
                min="0"
              />
              <div className="flex space-x-4 mt-2">
                <label>
                  <input
                    type="radio"
                    name="isAvailable"
                    value="true"
                    checked={food.isAvailable === true}
                    onChange={() => setFood({ ...food, isAvailable: true })}
                    disabled={isLoading}
                  />
                  Available
                </label>
                <label>
                  <input
                    type="radio"
                    name="isAvailable"
                    value="false"
                    checked={food.isAvailable === false}
                    onChange={() => setFood({ ...food, isAvailable: false })}
                    disabled={isLoading}
                  />
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
                className="bg-orange-400 text-white py-2 px-6 rounded-lg w-full col-span-2 hover:bg-orange-500 shadow-md disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : food._id
                  ? "Update Food"
                  : "+ Add Food"}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {data.map((item) => (
            <div
              key={item._id}
              className="flex items-center p-5 border rounded-lg shadow-md bg-white h-32 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => showFoodDetails(item)}
            >
              <img
                src={item.foodImage}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover border mr-4"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-orange-500 font-bold">₹{item.price}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-5 rounded-lg shadow-md disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    editFood(item);
                  }}
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button
                  className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-5 rounded-lg shadow-md disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFood(item._id);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {foodPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">{foodPopup.name}</h2>
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
              <strong>Available:</strong> {foodPopup.isAvailable ? "Yes" : "No"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Ingredients:</strong> {foodPopup.ingredients.join(", ")}
            </p>
            <button
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded w-full"
              onClick={() => setFoodPopup(null)}
            >
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
                className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  modal.action();
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-600 hover:text-white"
                onClick={() =>
                  setModal({ show: false, message: "", action: null })
                }
              >
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
