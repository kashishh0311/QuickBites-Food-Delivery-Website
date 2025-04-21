import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRestaurant } from "../RestaurantContext";

const COLORS = ["#66BB6A", "#FF7043"]; // Green for Income, Orange for Expense

function Dashboard() {
  const { restaurant, loading: contextLoading } = useRestaurant();
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [incomeExpense, setIncomeExpense] = useState([]);
  const [orderStatus, setOrderStatus] = useState({
    Complete: 0,
    Delivered: 0,
    Cancelled: 0,
    Pending: 0,
  });
  const [overview, setOverview] = useState({
    netRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    menuItems: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [foodFeedback, setFoodFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!restaurant?._id) {
      setError("Please log in to view dashboard");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [
        monthlyOrdersRes,
        incomeExpenseRes,
        orderStatusRes,
        overviewRes,
        recentActivityRes,
        topSellingItemsRes,
        foodFeedbackRes,
      ] = await Promise.all([
        axios.get("/api/v1/restaurant/monthly-orders", {
          withCredentials: true,
        }),
        axios.get("/api/v1/restaurant/income-expense", {
          withCredentials: true,
        }),
        axios.get("/api/v1/restaurant/order-status", {
          withCredentials: true,
        }),
        axios.get("/api/v1/restaurant/overview-metrics", {
          withCredentials: true,
        }),
        axios.get("/api/v1/restaurant/recent-activity", {
          withCredentials: true,
        }),
        axios.get("/api/v1/restaurant/top-selling-items", {
          withCredentials: true,
        }),
        axios.get("/api/v1/restaurant/food-feedback", {
          withCredentials: true,
        }),
      ]);

      setMonthlyOrders(monthlyOrdersRes.data.data || []);
      setIncomeExpense(incomeExpenseRes.data.data || []);
      setOrderStatus(
        orderStatusRes.data.data || {
          Complete: 0,
          Delivered: 0,
          Cancelled: 0,
          Pending: 0,
        }
      );
      setOverview(
        overviewRes.data.data || {
          netRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          menuItems: 0,
        }
      );
      setRecentActivity(recentActivityRes.data.data || []);
      setTopSellingItems(topSellingItemsRes.data.data || []);
      setFoodFeedback(foodFeedbackRes.data.data || []);
    } catch (error) {
      console.error("Fetch dashboard error:", error.response || error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch dashboard data";
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

  useEffect(() => {
    if (!contextLoading && restaurant) {
      fetchDashboardData();
    }
  }, [restaurant, contextLoading]);

  return (
    <div className="bg-gray-100 min-h-[240vh] py-12 px-10 font-sans">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
          Restaurant Hub
        </h1>
        <p className="text-gray-600 mt-3 text-xl tracking-wide">
          Your centralized vegetarian business dashboard
        </p>
      </div>

      {/* Refresh Button */}
      <div className="mx-6 mb-8 flex justify-end">
        <button
          onClick={fetchDashboardData}
          disabled={isLoading || contextLoading}
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Error and Loading */}
      {error && (
        <div className="mx-6 mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="mx-6 mb-8 p-4 bg-blue-100 text-blue-700 rounded-lg">
          Loading dashboard...
        </div>
      )}

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 mx-6">
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">Net Revenue</h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            ₹{overview.netRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">+12% this month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">
            Orders Processed
          </h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            {overview.totalOrders.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {overview.totalOrders
              ? Math.round((orderStatus.Complete / overview.totalOrders) * 100)
              : 0}
            % completed
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">Total Customers</h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            {overview.totalCustomers.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">+100 new</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">Menu Items</h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            {overview.menuItems.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">92% in stock</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 mx-6">
        {/* Monthly Orders Bar Chart */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
              📦
            </span>
            Monthly Orders
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={monthlyOrders}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={1} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "2px solid #F97316",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "#F97316", fontWeight: "bold" }}
              />
              <Legend
                iconType="square"
                formatter={(value) => (
                  <span style={{ color: "#F97316", fontWeight: "bold" }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="orders"
                fill="url(#ordersGradient)"
                barSize={30}
                name="Orders"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expense Donut Chart */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
              💰
            </span>
            Income & Expense
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={incomeExpense}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) =>
                  `${name}: ₹${value.toLocaleString()}`
                }
                labelLine={true}
              >
                {incomeExpense.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Total Orders Section */}
      <div className="mx-6 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Total Orders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 font-medium">Complete</p>
              <p className="text-lg font-bold text-orange-400 mt-1">
                {orderStatus.Complete.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 font-medium">Delivered</p>
              <p className="text-lg font-bold text-orange-400 mt-1">
                {orderStatus.Delivered.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 font-medium">Cancelled</p>
              <p className="text-lg font-bold text-orange-400 mt-1">
                {orderStatus.Cancelled.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 font-medium">Pending</p>
              <p className="text-lg font-bold text-orange-400 mt-1">
                {orderStatus.Pending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mx-6 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Performance Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Order Completion Rate</p>
              <p className="text-3xl font-extrabold text-orange-400 mt-2">
                {overview.totalOrders
                  ? Math.round(
                      (orderStatus.Complete / overview.totalOrders) * 100
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-gray-500">
                {orderStatus.Complete}/{overview.totalOrders} orders
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Customer Engagement</p>
              <p className="text-3xl font-extrabold text-orange-400 mt-2">
                {overview.totalCustomers ? 70 : 0}%
              </p>
              <p className="text-sm text-gray-500">
                {overview.totalCustomers} customers
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Stock Availability</p>
              <p className="text-3xl font-extrabold text-orange-400 mt-2">
                {overview.menuItems ? 92 : 0}%
              </p>
              <p className="text-sm text-gray-500">
                {overview.menuItems}/
                {overview.menuItems + (overview.menuItems ? 8 : 0)} items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flex Section: Recent Activity and Top Selling Veg Items */}
      <div className="mx-6 mb-16 flex flex-col lg:flex-row gap-10">
        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400 flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-6">
            {recentActivity.length === 0 && !isLoading && (
              <p className="text-gray-500">No recent activity.</p>
            )}
            {recentActivity.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-gray-700 font-medium">{item.action}</p>
                </div>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Vegetarian Items */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400 flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Top Selling Veg Items
          </h2>
          <div className="space-y-6">
            {topSellingItems.length === 0 && !isLoading && (
              <p className="text-gray-500">No top-selling items.</p>
            )}
            {topSellingItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-gray-700 font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.sales} units sold
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-400">
                  ₹{item.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Particular Foods Feedback */}
      <div className="mx-6 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Particular Foods Feedback
          </h2>
          <div className="space-y-6">
            {foodFeedback.length === 0 && !isLoading && (
              <p className="text-gray-500">No feedback available.</p>
            )}
            {foodFeedback.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4"
              >
                <div>
                  <p className="text-gray-700 font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.comment || "No comment provided"}
                  </p>
                </div>
                <p className="text-lg font-bold text-orange-400">
                  {item.rating}/5
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        style={{ width: "300px" }}
      />
    </div>
  );
}

export default Dashboard;
