import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../CartContext";
import Button from "../Components/Button";
import CartButton from "../Components/CartButton";
import axios from "axios";

function Details() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [similarFoods, setSimilarFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useCart();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`/api/v1/user/getFoodById/${id}`, {
          withCredentials: true,
        });
        setFood(response.data.data);
      } catch (error) {
        setError(
          error.response?.status === 404
            ? "Food not found"
            : "Failed to load food details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  useEffect(() => {
    if (food) {
      const fetchSimilarFoods = async () => {
        try {
          const response = await axios.get("/api/v1/user/getAllFood", {
            withCredentials: true,
          });
          const relatedFoods = response.data.data.filter(
            (item) => item.category === food.category && item._id !== food._id
          );
          setSimilarFoods(relatedFoods);
        } catch (error) {
          console.error("Error fetching similar foods:", error);
        }
      };
      fetchSimilarFoods();
    }
  }, [food]);

  useEffect(() => {
    const foundItem = cart.find((item) => item.foodId._id === id);
    setIsInCart(!!foundItem);
    setCartItem(foundItem);
  }, [cart, id]);

  const handleAddToCart = () => addToCart(id);

  const handleRatingClick = (index) =>
    setRating(index + 1 === rating ? index : index + 1);

  const handleSubmitFeedback = async () => {
    if (!rating || !reviewText.trim()) {
      setFeedbackMessage("Please provide a rating and review.");
      return;
    }
    setIsSubmitting(true);
    setFeedbackMessage("");
    try {
      await axios.post(
        "/api/v1/user/createFeedback",
        { foodId: id, rating, review: reviewText },
        { withCredentials: true }
      );
      setFeedbackMessage("Feedback submitted successfully!");
      setRating(0);
      setReviewText("");
      setShowFeedbackForm(false);
      const updatedFood = await axios.get(`/api/v1/user/getFoodById/${id}`, {
        withCredentials: true,
      });
      setFood(updatedFood.data.data);
    } catch (error) {
      console.error("Feedback submission error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (!error.response) {
        setFeedbackMessage(
          "Network error. Please check your connection and try again."
        );
      } else {
        setFeedbackMessage(
          error.response.status === 401
            ? "Please log in to submit feedback."
            : error.response.status === 400
            ? error.response.data.message ||
              "You can only review items you've ordered and received."
            : `Server error (${error.response.status}). Please try again later.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < roundedRating ? "orange" : "none"}
            stroke="orange"
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading)
    return <div className="text-center py-16 text-gray-600">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-500 transition"
        >
          Retry
        </button>
      </div>
    );
  if (!food)
    return <p className="text-center py-16 text-gray-600">Food not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main content with equal height columns */}
        <div
          className="flex flex-col lg:flex-row gap-8"
          style={{ alignItems: "stretch" }}
        >
          {/* Image Section - Left side with fixed height div */}
          <div className="lg:w-1/2">
            <div
              className="bg-white p-6 rounded-lg"
              style={{ height: "680px" }}
            >
              <img
                src={food.foodImage || "/fallback-image.jpg"}
                alt={food.name}
                className="object-cover rounded-lg w-full h-full"
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
            </div>
          </div>

          {/* Info Sections - Right side with fixed total height */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* About Section */}
            <div className="bg-white p-6 rounded-lg flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                About the Dish
              </h2>
              <p className="text-gray-700 mb-4">
                {food.description || "No description available"}
              </p>
              {food.restaurantId && (
                <div className="text-sm text-gray-700 mb-4">
                  <p>
                    <span className="font-medium">Restaurant:</span>{" "}
                    {food.restaurantId.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {food.restaurantId.address || "N/A"}
                  </p>
                </div>
              )}
              <div className="mb-6">
                {food.averageRating ? (
                  <div className="flex items-center gap-2">
                    {renderStars(food.averageRating)}
                    <span className="text-gray-600">
                      ({food.totalRatings}{" "}
                      {food.totalRatings === 1 ? "rating" : "ratings"})
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-600">No ratings yet</p>
                )}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="bg-white p-6 rounded-lg flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Ingredients & Availability
              </h2>
              {food.ingredients && food.ingredients.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    Ingredients:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {food.ingredients.map((item, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm font-medium transition duration-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-lg font-medium text-gray-800 mb-2">
                {food.category}
              </div>
              <p className="text-2xl font-semibold text-red-500 mb-3">
                ₹{food.price || "N/A"}
              </p>
              <p
                className={`text-base font-medium mb-4 ${
                  food.isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {food.isAvailable ? "In Stock" : "Out of Stock"}
              </p>
              {isInCart ? (
                <CartButton food={{ _id: id, ...cartItem }} />
              ) : (
                <Button
                  onClick={handleAddToCart}
                  text="Add to Cart"
                  disabled={!food.isAvailable}
                  className={`w-full py-3 text-white font-semibold rounded-lg transition ${
                    food.isAvailable
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Similar Foods Section with fixed height image divs */}
        {similarFoods.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarFoods.map((item) => (
                <Link
                  key={item._id}
                  to={`/food/${item._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-6 bg-white" style={{ height: "300px" }}>
                    <img
                      src={item.foodImage || "/fallback-image.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    />
                  </div>
                  <div className="p-4 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-700 font-medium mt-1">
                        ₹{item.price}
                      </p>
                      {item.averageRating ? (
                        <div className="flex justify-center items-center gap-2 mt-2">
                          {renderStars(item.averageRating)}
                          <span className="text-gray-500 text-sm">
                            ({item.totalRatings} ratings)
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mt-2">
                          No ratings yet
                        </p>
                      )}
                      <p
                        className={`text-base font-medium mb-4 ${
                          item.isAvailable ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.isAvailable ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews & Feedback Section */}
        <div className="max-w-7xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Reviews & Feedback
          </h2>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-6 rounded mb-6"
          >
            {showFeedbackForm ? "Close Form" : "Write a Review"}
          </button>
          {feedbackMessage && (
            <p
              className={`mb-4 ${
                feedbackMessage.includes("success")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {feedbackMessage}
            </p>
          )}
          {showFeedbackForm && (
            <div className="border-t pt-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Feedback
              </h3>
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    onClick={() => handleRatingClick(index)}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={index < rating ? "orange" : "none"}
                    stroke="orange"
                    strokeWidth="1"
                    className="cursor-pointer"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <textarea
                placeholder="Tell us about your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
              />
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className={`mt-4 bg-orange-400 hover:bg-orange-500 text-white py-2 px-6 rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto space-y-6">
            {food.feedbackDetails &&
            Array.isArray(food.feedbackDetails) &&
            food.feedbackDetails.length > 0 ? (
              food.feedbackDetails.map((review, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0 flex items-start"
                >
                  <div className="w-14 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={
                        review.customer?.profileImage || "/fallback-image.jpg"
                      }
                      alt={review.customer?.name || "Profile"}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.customer?.name || "Anonymous"}
                    </p>
                    <div className="flex gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < review.rating ? "orange" : "none"}
                          stroke="orange"
                          strokeWidth="1"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700">
                      {review.review || "No review provided"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
