// // import React, { useContext, useEffect } from "react";
// // import { useCart } from "../CartContext";
// // import CartButton from "../Components/CartButton";
// // import { Link, useNavigate } from "react-router-dom";
// // import { UserContext } from "../UserContext";
// // import axios from "axios";
// // function Cart() {
// //   const { cart, setCart, addToOrder } = useCart();
// //   const { user } = useContext(UserContext);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchCart = async () => {
// //       try {
// //         const response = await axios.get("/api/v1/user/getCart", {
// //           withCredentials: true,
// //         });
// //         setCart(response.data.data);
// //       } catch (error) {
// //         console.error(
// //           "Failed to fetch cart:",
// //           error.response?.data?.message || "An error occurred."
// //         );
// //       }
// //     };
// //     fetchCart();
// //   }, [setCart]);

// //   const handleOrderNow = async () => {
// //     if (!user) {
// //       navigate("/login");
// //     } else {
// //       try {
// //         const response = await axios.post(
// //           "/api/v1/user/createOrder",
// //           { items: cart },
// //           {
// //             withCredentials: true, // Ensure cookies are sent
// //           }
// //         );
// //         addToOrder(response.data.data);
// //         navigate("/order");
// //       } catch (error) {
// //         error.response?.data?.message;
// //       }
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className=" flex min-h-screen bg-gray-100">
// //         <div className=" my-10  w-1/2 mx-20">
// //           {cart.length === 0 ? (
// //             <p className="text-center text-gray-500">Your Cart is Empty.</p>
// //           ) : (
// //             cart.map((food) => (
// //               <div
// //                 key={food.id}
// //                 className="flex items-center p-4 border rounded-lg mb-5 bg-white"
// //               >
// //                 <img
// //                   src={food.image}
// //                   alt={food.name}
// //                   className="w-16 h-16 rounded-lg object-cover mr-4"
// //                 />
// //                 <div className="flex-1">
// //                   <h2 className="text-lg font-bold">{food.name}</h2>
// //                   <span className="font-medium text-red-600">
// //                     ₹{food.price * food.quantity}
// //                   </span>
// //                 </div>
// //                 <CartButton food={food} />
// //               </div>
// //             ))
// //           )}
// //         </div>

// //         <div className=" flex-col p-4 border rounded-lg shadow-lg w-1/2 max-w-lg bg-white my-10 max-h-max h-auto inline-block">
// //           <h2 className="text-gray-500 font-bold text-sm">PRICE DETAILS</h2>
// //           {/* <div className="mt-2 flex justify-between text-gray-700">
// //             <span>Price ({cart.length} items)</span>
// //             <span className="font-medium">
// //               ₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
// //             </span>
// //           </div> */}
// //           <div className="mt-2 text-gray-800">
// //             {cart.map((item) => (
// //               <div
// //                 key={item.id}
// //                 className="flex justify-between items-center py-1 "
// //               >
// //                 {/* Left Side: Item Name & Quantity */}
// //                 <div>
// //                   {item.name} ({item.quantity} items)
// //                 </div>
// //                 {/* Right Side: Price */}
// //                 <div className="font-medium text-green-600 text-right">
// //                   ₹{item.price * item.quantity}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="my-2 border-t border-gray-300"></div>
// //           <div className="mt-1 flex justify-between text-black font-bold text-lg">
// //             <span>Total Amount</span>
// //             <span>
// //               ₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
// //             </span>
// //           </div>
// //           <Link to="/order">
// //             <button
// //               className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded mt-5 w-full"
// //               onClick={handleOrderNow}
// //             >
// //               {user ? "Order Now" : "Login to Order"}
// //             </button>
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Cart;

// import React, { useContext, useEffect } from "react";
// import { useCart } from "../CartContext";
// import CartButton from "../Components/CartButton";
// import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from "../UserContext";

// function Cart() {
//   const { cart, fetchCart, createOrder } = useCart();
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   const handleOrderNow = async () => {
//     if (!user) {
//       navigate("/login");
//     } else {
//       try {
//         const orderData = await createOrder();
//         if (orderData) {
//           navigate("/order", { state: { orderId: orderData._id } });
//         }
//       } catch (error) {
//         console.error("Order creation failed", error);
//       }
//     }
//   };

//   // Calculate total based on cart item structure
//   const calculateTotal = () => {
//     return cart.reduce((acc, item) => {
//       const price = item.foodId?.price || 0;
//       return acc + price * item.quantity;
//     }, 0);
//   };

//   console.log("Rendering Cart component with cart items:", cart);

//   return (
//     <div>
//       <div className="flex min-h-screen bg-gray-100">
//         <div className="my-10 w-1/2 mx-20">
//           {!cart || cart.length === 0 ? (
//             <p className="text-center text-gray-500">Your Cart is Empty.</p>
//           ) : (
//             cart.map((item) => (
//               <div
//                 key={item.foodId._id}
//                 className="flex items-center p-4 border rounded-lg mb-5 bg-white"
//               >
//                 <img
//                   src={item.foodId.foodImage}
//                   alt={item.foodId.name}
//                   className="w-16 h-16 rounded-lg object-cover mr-4"
//                 />
//                 <div className="flex-1">
//                   <h2 className="text-lg font-bold">{item.foodId.name}</h2>
//                   <span className="font-medium text-red-600">
//                     ₹{item.foodId.price * item.quantity}
//                   </span>
//                 </div>
//                 <CartButton food={item} />
//               </div>
//             ))
//           )}
//         </div>

//         <div className="flex-col p-4 border rounded-lg shadow-lg w-1/2 max-w-lg bg-white my-10 max-h-max h-auto inline-block">
//           <h2 className="text-gray-500 font-bold text-sm">PRICE DETAILS</h2>
//           <div className="mt-2 text-gray-800">
//             {cart && cart.length > 0 ? (
//               cart.map((item) => (
//                 <div
//                   key={item.foodId._id}
//                   className="flex justify-between items-center py-1"
//                 >
//                   <div>
//                     {item.foodId.name} ({item.quantity} items)
//                   </div>
//                   <div className="font-medium text-green-600 text-right">
//                     ₹{item.foodId.price * item.quantity}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="py-1">No items in cart</div>
//             )}
//           </div>

//           <div className="my-2 border-t border-gray-300"></div>
//           <div className="mt-1 flex justify-between text-black font-bold text-lg">
//             <span>Total Amount</span>
//             <span>₹{calculateTotal()}</span>
//           </div>
//           <button
//             className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded mt-5 w-full"
//             onClick={handleOrderNow}
//             disabled={!cart || cart.length === 0}
//           >
//             {user ? "Order Now" : "Login to Order"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cart;
import React, { useContext, useEffect } from "react";
import { useCart } from "../CartContext";
import CartButton from "../Components/CartButton";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Cart() {
  const { cart, fetchCart, createOrder } = useCart();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleOrderNow = async () => {
    if (!user) {
      navigate("/login");
    } else {
      try {
        const orderData = await createOrder();
        if (orderData) {
          navigate("/order", { state: { orderId: orderData._id } });
        }
      } catch (error) {
        console.error("Order creation failed", error);
      }
    }
  };

  // Calculate total based on cart item structure
  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.foodId?.price || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8">
      <div className="w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side: Cart Items */}
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">YOUR CART</h2>
            <p className="text-sm text-gray-500 italic mb-4">
              Freshly prepared meals are ready to be ordered!
            </p>

            {/* Cart Items */}
            {!cart || cart.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-gray-500 text-lg font-medium">
                    Your Cart is Empty
                  </p>
                  <Link
                    to="/menu"
                    className="mt-4 inline-block text-orange-400 hover:text-orange-500 font-semibold"
                  >
                    Explore Delicious Foods
                  </Link>
                </div>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-3">
                {cart.map((item) => (
                  <div
                    key={item.foodId._id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <img
                      src={item.foodId.foodImage}
                      alt={item.foodId.name}
                      className="w-14 h-14 rounded-md object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-800">
                        {item.foodId.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      {item.foodId.restaurantId && (
                        <p className="text-base text-gray-500">
                          Restaurant: {item.foodId.restaurantId.name}
                        </p>
                      )}
                      <p className="text-md text-orange-400 font-medium">
                        ₹{item.foodId.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <CartButton food={item} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Price Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              PRICE SUMMARY
            </h3>

            <div className="space-y-3 text-gray-600">
              {cart && cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.foodId._id}
                    className="flex justify-between text-sm"
                  >
                    <span className="truncate flex-1">
                      {item.foodId.name} (x{item.quantity})
                    </span>

                    <span className="text-orange-400">
                      ₹{item.foodId.price * item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items in cart</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold text-gray-800 mb-4">
                <span>TOTAL</span>
                <span className="text-orange-400">₹{calculateTotal()}</span>
              </div>
              <button
                onClick={handleOrderNow}
                className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
                  !cart || cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-orange-400 hover:bg-orange-500 text-white"
                }`}
                disabled={!cart || cart.length === 0}
              >
                {user ? "Order Now" : "Login to Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
