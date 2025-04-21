// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Order() {
//   const [order, setOrder] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await axios.get("/api/v1/admin/getAllOrders");
//         setOrder(response.data.data);
//         console.log(setOrder);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchOrder();
//   }, []);
//   return (
//     <div>
//       <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">
//         {/* Left Sidebar: Order List */}
//         <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Orders</h2>
//           <div className="space-y-3">
//             {order.map((order) => (
//               <div
//                 key={order._id}
//                 className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center cursor-pointer"
//                 onClick={() => {
//                   setSelectedOrder(order);
//                 }}
//               >
//                 <div>
//                   <p className="text-gray-700 font-medium">
//                     Order {selectedOrder._id}
//                   </p>
//                   {/* <p className="text-gray-500 text-sm">{order.details}</p> */}
//                 </div>
//                 <p className="text-orange-500 font-semibold">
//                   {order.orderStatus}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Side: Order Details */}

//         {selectedOrder && (
//           <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold mb-4">Order Details</h2>
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <p className="text-gray-700 font-medium">
//                   Order {selectedOrder._id}
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <img src="" alt="User" className="w-10 h-10 rounded-full" />
//                 <div>
//                   <p className="text-gray-700 font-medium">
//                     {selectedOrder.customerId.name}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-4">
//               <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
//                 {selectedOrder.orderStatus}
//               </span>
//             </div>

//             <div className="mb-4">
//               <p className="font-semibold">📍 Address:</p>
//               <p className="text-gray-700">{selectedOrder.deliveryAddress}</p>
//             </div>

//             <h3 className="font-semibold text-gray-700 mt-4 mb-3">
//               Order Menu
//             </h3>
//             <div className="space-y-3">
//               {selectedOrder.orderItems.map((food) => (
//                 <div
//                   key={food._id}
//                   className="flex items-center p-4 border rounded-lg mb-5 bg-white"
//                 >
//                   <img
//                     src={food.image}
//                     alt={food.name}
//                     className="w-16 h-16 rounded-lg object-cover mr-4"
//                   />
//                   <div className="flex-1">
//                     <h2 className="text-lg font-bold">{food.name}</h2>
//                     <p className="text-orange-500 font-bold">₹{food.price}</p>
//                   </div>
//                 </div>
//               ))}
//               <div className="mt-4 flex justify-between text-gray-700 font-semibold text-lg">
//                 <p>Total</p>
//                 <p>₹{selectedOrder.totalOrderAmount}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Order() {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await axios.get("/api/v1/admin/getAllOrders");
//         setOrders(response.data.data);
//         console.log(setOrder);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchOrder();
//   }, []);

//   return (
//     <div className="flex h-screen">
//       {/* Orders List (Left Panel) */}
//       <div className="w-1/3 bg-gray-100 p-4 overflow-auto">
//         <h2 className="text-xl font-bold mb-4">Orders</h2>
//         <ul>
//           {orders.map((order) => (
//             <li
//               key={order._id}
//               className={`p-2 border rounded-md cursor-pointer mb-2
//                 ${
//                   selectedOrder?._id === order._id
//                     ? "bg-blue-500 text-white"
//                     : "bg-white"
//                 }
//               `}
//               onClick={() => setSelectedOrder(order)}
//             >
//               Order #{order._id}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Order Details (Right Panel) */}
//       <div className="w-2/3 p-4">
//         {selectedOrder ? (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <p>
//               <strong>Order ID:</strong> {selectedOrder._id}
//             </p>
//             <p>
//               <strong>Customer:</strong> {selectedOrder.customerName}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedOrder.status}
//             </p>
//             <p>
//               <strong>Total Amount:</strong> ${selectedOrder.total}
//             </p>
//             <h3 className="text-lg font-semibold mt-4">Items:</h3>
//             <ul className="mt-2">
//               {selectedOrder.items.map((item) => (
//                 <li key={item._id} className="border-b py-1">
//                   {item.name} - {item.quantity} x ${item.price}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ) : (
//           <p className="text-gray-500">Select an order to view details</p>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Order() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await axios.get("/api/v1/admin/getAllOrders");
//         setOrders(response.data.data);
//         console.log(setOrders);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchOrder();
//   }, []);

//   return (
//     <div>
//       <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">
//         {/* Left Sidebar: Order List */}
//         <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Orders</h2>
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//           {orders.length > 0 ? (
//             <div className="space-y-3">
//               {orders.map((order) => (
//                 <div
//                   key={order._id}
//                   className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
//                   onClick={() => setSelectedOrder(order)}
//                 >
//                   <div>
//                     <p className="text-gray-700 font-medium">
//                       Order #{order._id}
//                     </p>
//                   </div>
//                   <p className="text-orange-500 font-semibold">
//                     {order.orderStatus}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             !error && <p className="text-gray-500 text-sm">No orders found.</p>
//           )}
//         </div>

//         {/* Right Side: Order Details */}
//         <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
//           {selectedOrder ? (
//             <>
//               <h2 className="text-lg font-semibold mb-4">Order Details</h2>
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <p className="text-gray-700 font-medium">
//                     Order #{selectedOrder._id}
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     {new Date(selectedOrder.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={
//                       selectedOrder.customerId?.profileImage
//                       // "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
//                     }
//                     alt="User"
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                   <div>
//                     <p className="text-gray-700 font-medium">
//                       {selectedOrder.customerId?.name}
//                     </p>
//                     <p className="text-gray-500 text-sm">
//                       Email: {selectedOrder.customerId?.email}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold text-gray-700">Order Status</h3>
//                 <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
//                   {selectedOrder.orderStatus}
//                 </span>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold text-gray-700">
//                   Delivery Details
//                 </h3>
//                 <p className="font-semibold mt-2">
//                   {" "}
//                   <span className="text-gray-700">
//                     {selectedOrder.deliveryAddress?.type}:{" "}
//                     {selectedOrder.deliveryAddress?.details}
//                   </span>
//                 </p>
//                 <div className="flex gap-6 mt-2 text-sm text-gray-600">
//                   <p>💰 Payment: {selectedOrder.paymentStatus || "Pending"}</p>
//                 </div>
//               </div>

//               <h3 className="font-semibold text-gray-700 mt-4 mb-3">
//                 Order Menu
//               </h3>
//               <div className="space-y-3">
//                 {selectedOrder.orderItems.map((item) => (
//                   <div
//                     key={item._id}
//                     className="flex items-center p-4 border rounded-lg bg-white"
//                   >
//                     <img
//                       src={item.foodId?.foodImage || ""}
//                       alt={item.foodId?.name || "Food Item"}
//                       className="w-16 h-16 rounded-lg object-cover mr-4"
//                     />
//                     <div className="flex-1">
//                       <h2 className="text-lg font-bold">
//                         {item.foodId?.name || "Unknown Item"}
//                       </h2>
//                       <p className="text-orange-500 font-bold">
//                         ₹{item.totalPrice || 0}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 flex justify-between text-gray-700 font-semibold text-lg">
//                 <p>Total</p>
//                 <p>₹{selectedOrder.totalOrderAmount || 0}</p>
//               </div>
//             </>
//           ) : (
//             <p className="text-gray-500 text-center">
//               Select an order to view details.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/v1/admin/getAllOrders");
        console.log("Fetched orders:", response.data.data);
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Fetch orders error:", error);
        setError("Failed to fetch orders");
      }
    };

    const fetchStatusOptions = async () => {
      try {
        const response = await axios.get("/api/v1/admin/getAllStatus");
        console.log("Fetched status options:", response.data.data);
        setStatusOptions(response.data.data || []);
      } catch (error) {
        console.error("Status fetch error:", error);
        toast.error("Failed to fetch status options");
        setStatusOptions([]);
      }
    };

    fetchOrders();
    fetchStatusOptions();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder?._id || !newStatus) {
      toast.error("Missing order ID or status");
      return;
    }

    try {
      console.log("Sending update request:", {
        orderId: selectedOrder._id,
        status: newStatus,
      });
      const response = await axios.put(
        "/api/v1/admin/updateOrderStatus",
        {
          orderId: selectedOrder._id,
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);
      const updatedOrder = response.data.data;

      if (!updatedOrder || !updatedOrder.orderStatus) {
        throw new Error("Invalid response: Updated order data missing");
      }

      toast.success("Order status updated successfully");

      // Update states
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: updatedOrder.orderStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );

      setNewStatus("");
      setShowPopup(false);
    } catch (error) {
      console.error(
        "Update status error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status - Check server route"
      );
    }
  };

  return (
    <div>
      <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">
        <div className="w-1/3 h-[80vh] bg-white p-4 rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <h2 className="text-lg font-semibold mb-4">Orders</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div>
                    <p className="text-gray-700 font-medium">
                      Order #{order._id}
                    </p>
                  </div>
                  <p className="text-orange-500 font-semibold">
                    {order.orderStatus}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !error && <p className="text-gray-500 text-sm">No orders found.</p>
          )}
        </div>

        <div className="w-2/3 h-[80vh] bg-white p-6 rounded-lg shadow-md overflow-y-auto">
          {selectedOrder ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-700 font-medium">
                    Order #{selectedOrder._id}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedOrder.customerId?.profileImage ||
                      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-700 font-medium">
                      {selectedOrder.customerId?.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Email: {selectedOrder.customerId?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700">
                  Delivery Details
                </h3>
                <p className="font-semibold mt-2">
                  <span className="text-gray-700">
                    {selectedOrder.deliveryAddress?.type}:{" "}
                    {selectedOrder.deliveryAddress?.details}
                  </span>
                </p>
                <div className="flex gap-6 mt-2 text-sm text-gray-600">
                  <p>💰 Payment: {selectedOrder.paymentStatus || "Pending"}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700">Order Status</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full">
                    {selectedOrder.orderStatus}
                  </span>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-700 mt-4 mb-3">
                Order Menu
              </h3>
              <div className="space-y-3">
                {selectedOrder.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center p-4 bg-white"
                  >
                    <img
                      src={item.foodId?.foodImage || ""}
                      alt={item.foodId?.name || "Food Item"}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-bold">
                        {item.foodId?.name || "Unknown Item"}
                      </h2>
                      <p className="text-orange-500 font-bold">
                        ₹{item.totalPrice || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-gray-700 font-semibold text-lg">
                <p>Total</p>
                <p>₹{selectedOrder.totalOrderAmount || 0}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Select an order to view details.
            </p>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">
              Update Order Status
            </h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select Status</option>
              {statusOptions.length > 0 ? (
                statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No statuses available
                </option>
              )}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus}
                className={`px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ${
                  !newStatus ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
