import React, { useEffect, useState } from "react";
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
import axios from "axios";

// Colors for charts
const COLORS = ["#66BB6A", "#FF7043"];

// Helper function to make authenticated API calls
const fetchWithAuth = async (url, config = {}) => {
  try {
    const response = await axios.get(url, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: config.withCredentials
          ? undefined
          : `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data.data; // Assuming ApiResponce structure
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
};

function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantRegistrations, setRestaurantRegistrations] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch restaurants
        const restaurantData = await fetchWithAuth(
          "/api/v1/admin/getAllRestaurants",
          { withCredentials: true }
        );
        setRestaurants(restaurantData || []);

        // Fetch users
        const userData = await fetchWithAuth("/api/v1/admin/getAllUser", {
          withCredentials: true,
        });
        setUsers(userData || []);

        // Process restaurant registrations by month
        const restaurantByMonth = (restaurantData || []).reduce(
          (acc, restaurant) => {
            const month = new Date(restaurant.createdAt).toLocaleString(
              "default",
              { month: "short" }
            );
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          },
          {}
        );
        const restaurantChartData = Object.keys(restaurantByMonth).map(
          (month) => ({
            month,
            registrations: restaurantByMonth[month],
          })
        );
        setRestaurantRegistrations(restaurantChartData);

        // Process user registrations by month
        const userByMonth = (userData || []).reduce((acc, user) => {
          const month = new Date(user.createdAt).toLocaleString("default", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        const userChartData = Object.keys(userByMonth).map((month) => ({
          month,
          registrations: userByMonth[month],
        }));
        setUserRegistrations(userChartData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalRestaurants = restaurants.length;
  const totalUsers = users.length;
  const activeRestaurants = restaurants.filter((r) => r.isActive).length;
  const userRestaurantRatio = totalRestaurants
    ? (totalUsers / totalRestaurants).toFixed(2)
    : 0;

  // Income vs Expense (mock data, replace with real data if available)
  const incomeExpenseData = [
    { name: "Income", value: 43450 },
    { name: "Expense", value: 28900 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-10 font-sans">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
          Admin Hub
        </h1>
        <p className="text-gray-600 mt-3 text-xl tracking-wide">
          Centralized dashboard for users and restaurants
        </p>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 mx-6">
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">
            Total Restaurants
          </h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            {totalRestaurants}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {activeRestaurants} active
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            {totalUsers}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {userRestaurantRatio} users/restaurant
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">
            Active Restaurants
          </h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            {activeRestaurants}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {((activeRestaurants / totalRestaurants) * 100 || 0).toFixed(1)}%
            active
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl border-b-4 border-orange-400 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-medium text-gray-700">
            New Registrations
          </h3>
          <p className="text-4xl font-extrabold mt-2 text-orange-400">
            {restaurantRegistrations.reduce(
              (sum, item) => sum + item.registrations,
              0
            ) +
              userRegistrations.reduce(
                (sum, item) => sum + item.registrations,
                0
              )}
          </p>
          <p className="text-sm text-gray-500 mt-1">This year</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 mx-6">
        {/* Restaurant Registrations Bar Chart */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-orange-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
              🏪
            </span>
            Restaurant Registrations
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={restaurantRegistrations}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="registrationsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F97316" stopOpacity={1} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" strokeWidth={1} stroke="#6b7280" />
              <YAxis strokeWidth={1} stroke="#6b7280" />
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
                dataKey="registrations"
                fill="url(#registrationsGradient)"
                barSize={30}
                name="Registrations"
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
                data={incomeExpenseData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                label={({ name, value }) =>
                  `${name}: ₹${value.toLocaleString()}`
                }
                labelLine={{
                  stroke: "#6b7280",
                  strokeWidth: 1,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
              >
                {incomeExpenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={1}
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

      {/* User and Restaurant Details */}
      <div className="mx-6 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            User & Restaurant Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Users */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Top Users
              </h3>
              {users.slice(0, 5).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between mb-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        user.profileImage || "https://via.placeholder.com/40"
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-gray-700 font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            {/* Top Restaurants */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Top Restaurants
              </h3>
              {restaurants.slice(0, 5).map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="flex items-center justify-between mb-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={restaurant.image || "https://via.placeholder.com/40"}
                      alt={restaurant.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-gray-700 font-medium">
                        {restaurant.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {restaurant.address}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Active: {restaurant.isActive ? "Yes" : "No"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mx-6 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-6">
            {[
              ...restaurants.slice(0, 3).map((r) => ({
                action: `New restaurant: ${r.name}`,
                time: new Date(r.createdAt).toLocaleString(),
                icon: "🏪",
              })),
              ...users.slice(0, 2).map((u) => ({
                action: `New user: ${u.name}`,
                time: new Date(u.createdAt).toLocaleString(),
                icon: "👤",
              })),
            ].map((item, index) => (
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
      </div>
    </div>
  );
}

export default Dashboard;
