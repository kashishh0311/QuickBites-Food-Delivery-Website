// import React from "react";
// import { createContext, useContext, useState } from "react";
// import axios from "axios";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   // const [orders, setOrders] = useState([]);

//   // const addToCart = (food) => {
//   //   setCart([...cart, { ...food, quantity: 1 }]);
//   // };

//   const addToCart = async (food) => {
//     try {
//       const response = await axios.post(
//         "/api/v1/user/addToCart",
//         { _id: food._id },
//         { withCredentials: true }
//       );
//       // setCart(response.data.data.items);
//       setCart((prevCart) => [...response.data.data.items]);
//     } catch (error) {
//       console.error(
//         "Error adding to cart:",
//         error.response?.data?.message || "Server error."
//       );
//     }
//   };

//   const updateQuantity = async (id, quantity) => {
//     try {
//       const response = await axios.put(
//         "/api/v1/user/updateQuantity",
//         { _id: id, quantity },
//         { withCredentials: true }
//       );
//       setCart(response.data.data.items);
//     } catch (error) {
//       console.error(
//         "Error updating quantity:",
//         error.response?.data?.message || "Server error."
//       );
//     }
//   };

//   // const increment = (id) => {
//   //   setCart(
//   //     cart.map((item) =>
//   //       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//   //     )
//   //   );
//   // };

//   // const increment = (id) => updateQuantity(id, "increase");
//   const increment = (id) => {
//     const item = cart.find((item) => item._id === id);
//     if (item) updateQuantity(id, item.quantity + 1);
//   };

//   // const decrement = (id) => {
//   //   setCart(
//   //     cart
//   //       .map((item) =>
//   //         item.id === id ? { ...item, quantity: item.quantity - 1 } : item
//   //       )
//   //       .filter((item) => item.quantity > 0)
//   //   );
//   // };

//   // const decrement = (id) => updateQuantity(id, "decrease");
//   const decrement = (id) => {
//     const item = cart.find((item) => item._id === id);
//     if (item && item.quantity > 1) {
//       updateQuantity(id, item.quantity - 1);
//     } else {
//       // Remove item from cart if quantity reaches 0
//       updateQuantity(id, 0);
//     }
//   };

//   // const addToOrder = () => {
//   //   setOrders([...cart]);
//   // };

//   // const delivery = () => {
//   //   setOrders([]);
//   //   setCart([]);
//   // };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         setCart,
//         // orders,
//         addToCart,
//         increment,
//         decrement,
//         // addToOrder,
//         // delivery,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart on initial load
  useEffect(() => {
    fetchCart();
  }, []);

  // Get cart data from server
  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/v1/user/getCart", {
        withCredentials: true,
      });

      console.log("GET CART RESPONSE:", response.data);

      // Handle the correct structure based on API response
      if (response.data.data && response.data.data.items) {
        setCart(response.data.data.items);
      } else {
        setCart(response.data.data || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error.response?.data?.message || "An error occurred."
      );
    }
  };

  // Add item to cart
  const addToCart = async (foodId) => {
    setLoading(true);
    try {
      console.log("Adding to cart, foodId:", foodId);
      const response = await axios.post(
        "/api/v1/user/addToCart",
        { _id: foodId },
        { withCredentials: true }
      );
      console.log("Add to cart response:", response.data);
      await fetchCart(); // Refresh cart after adding item
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data?.message || "Server error."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update quantity of item in cart
  const updateQuantity = async (foodId, quantity) => {
    setLoading(true);
    try {
      console.log("Updating quantity:", { foodId, quantity });

      const response = await axios.put(
        "/api/v1/user/updateQuantity",
        { _id: foodId, quantity },
        { withCredentials: true }
      );

      console.log("Update quantity response:", response.data);

      // Make sure we're setting the cart state correctly
      if (response.data.data && response.data.data.items) {
        setCart(response.data.data.items);
      } else {
        setCart(response.data.data || []);
      }
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error.response?.data?.message || "Server error.",
        error.response?.data || error
      );

      // If there was an error, refresh the cart to ensure it's in sync
      fetchCart();
    } finally {
      setLoading(false);
    }
  };

  // Increment quantity
  const increment = (foodId) => {
    console.log("Increment called for foodId:", foodId);

    // Find the correct item
    const item = findItemInCart(foodId);

    if (item) {
      console.log("Found item to increment:", item);
      // Use foodId from the item object, which should match what the server expects
      const idToUse = item.foodId._id;
      updateQuantity(idToUse, item.quantity + 1);
    } else {
      console.error("Item not found in cart for increment:", foodId);
    }
  };

  // Decrement quantity
  const decrement = (foodId) => {
    console.log("Decrement called for foodId:", foodId);

    // Find the correct item
    const item = findItemInCart(foodId);

    if (item && item.quantity > 1) {
      console.log("Found item to decrement:", item);
      // Use foodId from the item object, which should match what the server expects
      const idToUse = item.foodId._id;
      updateQuantity(idToUse, item.quantity - 1);
    } else if (item) {
      // Remove item from cart if quantity reaches 0
      console.log("Removing item from cart:", item);
      const idToUse = item.foodId._id;
      updateQuantity(idToUse, 0);
    } else {
      console.error("Item not found in cart for decrement:", foodId);
    }
  };

  // Helper function to find an item in the cart by ID
  const findItemInCart = (foodId) => {
    console.log("Looking for item in cart with foodId:", foodId);
    console.log("Current cart:", cart);

    // Try to find the item based on possible structures
    let item = cart.find((item) => {
      // Main case: Match foodId._id with the passed foodId
      return item.foodId && item.foodId._id === foodId;
    });

    // If not found, try other ways
    if (!item) {
      item = cart.find((item) => item._id === foodId);
    }

    if (!item) {
      item = cart.find((item) => item.foodId === foodId);
    }

    console.log("Found item:", item);
    return item;
  };

  // Create order from cart
  const createOrder = async () => {
    try {
      const response = await axios.post(
        "/api/v1/user/createOrder",
        { items: cart },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data?.message || "Server error."
      );
      return null;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await axios.delete("/api/v1/user/clearCart", {
        withCredentials: true,
      });
      setCart([]);
    } catch (error) {
      console.error(
        "Error clearing cart:",
        error.response?.data?.message || "Server error."
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increment,
        decrement,
        fetchCart,
        createOrder,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
