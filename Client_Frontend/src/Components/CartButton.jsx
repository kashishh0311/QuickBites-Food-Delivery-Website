import React from "react";
import { useCart } from "../CartContext";

function CartButton({ food }) {
  const { increment, decrement } = useCart();

  // Extract the ID based on food structure
  // This could be different based on where the component is used
  let foodId = null;

  if (food.foodId && food.foodId._id) {
    // If the food object contains a nested foodId object (common in cart items)
    foodId = food.foodId._id;
  } else if (food._id) {
    // If the food object has a direct _id property
    foodId = food._id;
  }

  if (!foodId) {
    console.error("Invalid food object in CartButton - missing ID", food);
    return null;
  }

  return (
    <div className="mt-2">
      <button
        className="rounded-l-lg bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 mt-4 h-4/5"
        onClick={() => {
          decrement(foodId);
        }}
      >
        -
      </button>
      <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 mt-4 h-4/5">
        {food.quantity}
      </button>
      <button
        className="rounded-r-lg bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 mt-4 h-4/5"
        onClick={() => {
          increment(foodId);
        }}
      >
        +
      </button>
    </div>
  );
}

export default CartButton;
