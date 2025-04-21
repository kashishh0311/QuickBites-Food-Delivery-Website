import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useRestaurant } from "../RestaurantContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const navigate = useNavigate();
  const { restaurant, loading, fetchRestaurant } = useRestaurant();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Default placeholder image URL
  const defaultImage =
    "https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg";

  // Function to apply Cloudinary transformations and add cache-busting
  const applyCloudinaryTransform = (url, width, height) => {
    if (!url || !url.includes("cloudinary.com")) {
      return url;
    }
    const parts = url.split("/upload/");
    if (parts.length !== 2) return url;
    const cacheBuster = `t=${new Date().getTime()}`;
    return `${parts[0]}/upload/c_fit,w_${width},h_${height}/${parts[1]}?${cacheBuster}`;
  };

  useEffect(() => {
    if (restaurant) {
      console.log("Restaurant object:", restaurant);
      setName(restaurant.name || "");
      setEmail(restaurant.email || "");
      setPhone(restaurant.phone || "");
      setAddress(restaurant.address || "");
      setPreviewImage(
        restaurant.image
          ? applyCloudinaryTransform(restaurant.image, 160, 160)
          : defaultImage
      );
    }
  }, [restaurant]);

  const handleSave = async () => {
    if (isEditing && (!name || !email || !address || address.trim() === "")) {
      toast.error("Name, email, and address are required.", {
        position: "bottom-center",
        theme: "dark",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone || "");
      formData.append("address", address);
      if (image) {
        formData.append("image", image);
      }

      console.log("Sending FormData:", { name, email, phone, address, image });

      const response = await axios.put(
        "/api/v1/restaurant/updateRestaurantDetails",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Update response:", response.data);

      setIsEditing(false);
      setImage(null);
      await fetchRestaurant(); // Fixed: Changed from fetchUser to fetchRestaurant

      const newImage = response.data.data.image;
      if (newImage) {
        setPreviewImage(applyCloudinaryTransform(newImage, 160, 160));
      } else {
        setPreviewImage(defaultImage);
        toast.warn("Profile image not updated. Using default image.", {
          position: "bottom-center",
          theme: "dark",
        });
      }

      toast.success("Profile updated successfully!", {
        position: "bottom-center",
        theme: "dark",
      });
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string" &&
        error.response.data.includes("Error:")
          ? error.response.data.match(/Error:.*?(?=<br>|$)/)?.[0]
          : "Failed to update profile");
      toast.error(errorMsg, {
        position: "bottom-center",
        theme: "dark",
      });
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      handleSave();
    }
    setIsEditing(!isEditing);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-8 text-gray-800">
        Loading restaurant data...
      </div>
    );
  }

  if (!restaurant) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex justify-center py-12">
      <div className="w-4/5 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Restaurant Profile
            </h1>
            <button
              onClick={toggleEditing}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-lg"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 pr-2">
            {/* Top Section: Details and Image */}
            <div className="flex gap-6">
              {/* Left: Details */}
              <div className="w-2/3 space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isEditing
                        ? "border-orange-500 bg-white outline-none"
                        : "border-gray-300 bg-gray-100"
                    }`}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isEditing
                        ? "border-orange-500 bg-white outline-none"
                        : "border-gray-300 bg-gray-100"
                    }`}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isEditing
                        ? "border-orange-500 bg-white outline-none"
                        : "border-gray-300 bg-gray-100"
                    }`}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isEditing
                        ? "border-orange-500 bg-white outline-none"
                        : "border-gray-300 bg-gray-100"
                    }`}
                    disabled={!isEditing}
                    placeholder="Enter restaurant address"
                  />
                </div>
              </div>

              {/* Right: Profile Image */}
              <div className="w-1/3 flex flex-col items-center mt-5">
                <div className="relative h-40 w-40 rounded-full overflow-hidden ring-4 ring-orange-500 transform hover:scale-105 transition-transform duration-300 mb-4">
                  <img
                    src={
                      previewImage ||
                      (restaurant.image ? restaurant.image : defaultImage)
                    }
                    alt="Restaurant Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.target.src = defaultImage)}
                  />
                </div>
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                      Change Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-2 border rounded-lg text-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ToastContainer */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        style={{ width: "300px" }}
        theme="dark"
      />
    </div>
  );
}

export default Profile;
