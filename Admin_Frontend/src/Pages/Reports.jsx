import React, { useState, useEffect } from "react";
import axios from "axios";
import { RefreshCw, Search, Download, Filter, Calendar } from "lucide-react";
import * as XLSX from "xlsx";

const Report = () => {
  const [activeTab, setActiveTab] = useState("users");

  // Users State
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userSortConfig, setUserSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Restaurants State
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurantSearchQuery, setRestaurantSearchQuery] = useState("");
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [restaurantError, setRestaurantError] = useState(null);

  // Orders Report State
  const [ordersReport, setOrdersReport] = useState([]);
  const [ordersSearchTerm, setOrdersSearchTerm] = useState("");
  const [ordersSortConfig, setOrdersSortConfig] = useState({
    key: "totalOrders",
    direction: "desc",
  });
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Restaurant Performance State
  const [restaurantPerformance, setRestaurantPerformance] = useState([]);
  const [performanceSearchTerm, setPerformanceSearchTerm] = useState("");
  const [performanceLoading, setPerformanceLoading] = useState(true);
  const [performanceError, setPerformanceError] = useState(null);
  const [performanceSortConfig, setPerformanceSortConfig] = useState({
    key: "totalOrders",
    direction: "desc",
  });

  // Fetch Functions
  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const response = await axios.get("/api/v1/admin/getAllUser");
      const userData = response.data.data || [];
      setUsers(userData);
      setUserError(null);
      return userData;
    } catch (err) {
      setUserError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
      return [];
    } finally {
      setUserLoading(false);
    }
  };

  const fetchOrders = async (userData) => {
    try {
      setOrdersLoading(true);
      const response = await axios.get("/api/v1/admin/getAllOrders");
      const orders = response.data.data || [];
      console.log("Sample order data:", orders[0] || "No orders returned");

      // Aggregate orders by user
      const ordersByUser = orders.reduce((acc, order) => {
        const userId = order.customerId?._id || order.customerId;
        if (userId) {
          acc[userId] = (acc[userId] || 0) + 1;
        }
        return acc;
      }, {});

      // Create orders report
      const ordersData = userData.map((user) => ({
        userId: user._id,
        name: user.name || "N/A",
        email: user.email || "N/A",
        totalOrders: ordersByUser[user._id] || 0,
      }));

      if (ordersData.every((report) => report.totalOrders === 0)) {
        console.warn("No orders linked to users. Check customerId mapping.");
      }

      setOrdersReport(ordersData);
      setOrdersError(null);
      return orders; // Return orders for performance report
    } catch (err) {
      setOrdersError(err.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
      return [];
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setRestaurantLoading(true);
      const response = await axios.get("/api/v1/admin/getAllRestaurants");
      const restaurantData = response.data.data || [];
      setRestaurants(restaurantData);
      setFilteredRestaurants(restaurantData);
      setRestaurantError(null);
      return restaurantData;
    } catch (err) {
      setRestaurantError(
        err.response?.data?.message || "Failed to fetch restaurants"
      );
      console.error("Error fetching restaurants:", err);
      return [];
    } finally {
      setRestaurantLoading(false);
    }
  };

  const fetchRestaurantPerformance = async (ordersData, restaurantData) => {
    try {
      setPerformanceLoading(true);

      // Aggregate orders by restaurant
      const ordersByRestaurant = ordersData.reduce((acc, order) => {
        const restaurantId = order.orderItems?.[0]?.foodId?.restaurantId?._id;
        if (restaurantId) {
          acc[restaurantId] = (acc[restaurantId] || 0) + 1;
        }
        return acc;
      }, {});

      // Create performance report
      const performanceData = restaurantData.map((restaurant) => ({
        restaurantId: restaurant._id,
        name: restaurant.name || "N/A",
        totalOrders: ordersByRestaurant[restaurant._id] || 0,
      }));

      if (performanceData.every((report) => report.totalOrders === 0)) {
        console.warn(
          "No orders linked to restaurants. Check restaurantId in orderItems."
        );
      }

      setRestaurantPerformance(performanceData);
      setPerformanceError(null);
    } catch (err) {
      setPerformanceError(
        err.response?.data?.message || "Failed to fetch performance data"
      );
      console.error("Error fetching performance:", err);
    } finally {
      setPerformanceLoading(false);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUsers();
      const ordersData = await fetchOrders(userData);
      const restaurantData = await fetchRestaurants();
      await fetchRestaurantPerformance(ordersData, restaurantData);
    };
    fetchData();
  }, []);

  // Users Functions
  const handleUserSort = (key) => {
    let direction = "asc";
    if (userSortConfig.key === key && userSortConfig.direction === "asc") {
      direction = "desc";
    }
    setUserSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Restaurants Functions
  const filterRestaurants = (search) => {
    const filtered = restaurants.filter((restaurant) =>
      restaurant.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  // Orders Report Functions
  const handleOrdersSort = (key) => {
    let direction = "asc";
    if (ordersSortConfig.key === key && ordersSortConfig.direction === "asc") {
      direction = "desc";
    }
    setOrdersSortConfig({ key, direction });

    const sortedOrders = [...ordersReport].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setOrdersReport(sortedOrders);
  };

  const filteredOrdersReport = ordersReport.filter(
    (report) =>
      report.name.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
      report.email.toLowerCase().includes(ordersSearchTerm.toLowerCase())
  );

  // Restaurant Performance Functions
  const handlePerformanceSort = (key) => {
    let direction = "asc";
    if (
      performanceSortConfig.key === key &&
      performanceSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setPerformanceSortConfig({ key, direction });

    const sortedPerformance = [...restaurantPerformance].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setRestaurantPerformance(sortedPerformance);
  };

  const filteredPerformanceReport = restaurantPerformance.filter((report) =>
    report.name.toLowerCase().includes(performanceSearchTerm.toLowerCase())
  );

  const exportOrdersReportExcel = () => {
    if (filteredOrdersReport.length === 0) {
      alert("No orders data available to export!");
      return;
    }
    const headers = ["User Name", "Email", "Total Orders"];
    const data = filteredOrdersReport.map((report) => ({
      "User Name": report.name,
      Email: report.email,
      "Total Orders": report.totalOrders,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
      skipHeader: false,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders_Report");
    XLSX.writeFile(workbook, "Quickbites_Orders_Report.xlsx");
  };

  const exportRestaurantsExcel = () => {
    if (filteredRestaurants.length === 0) {
      alert("No restaurants available to export!");
      return;
    }
    const headers = ["Restaurant Name", "Address", "Phone", "Email"];
    const data = filteredRestaurants.map((restaurant) => ({
      "Restaurant Name": restaurant.name || "N/A",
      Address: restaurant.address || "N/A",
      Phone: restaurant.phone || "N/A",
      Email: restaurant.email || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
      skipHeader: false,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Restaurants");
    XLSX.writeFile(workbook, "Quickbites_Restaurants_Report.xlsx");
  };

  const exportUsersExcel = () => {
    if (filteredUsers.length === 0) {
      alert("No users available to export!");
      return;
    }
    const headers = ["Name", "Email", "Phone", "Created At", "Updated At"];
    const data = filteredUsers.map((user) => ({
      Name: user.name || "N/A",
      Email: user.email || "N/A",
      Phone: user.phone || "N/A",
      "Created At": formatDate(user.createdAt),
      "Updated At": formatDate(user.updatedAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
      skipHeader: false,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Quickbites_Users_Report.xlsx");
  };

  const exportPerformanceReportExcel = () => {
    if (filteredPerformanceReport.length === 0) {
      alert("No performance data available to export!");
      return;
    }
    const headers = ["Restaurant Name", "Total Orders"];
    const data = filteredPerformanceReport.map((report) => ({
      "Restaurant Name": report.name,
      "Total Orders": report.totalOrders,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
      skipHeader: false,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Restaurant_Performance");
    XLSX.writeFile(workbook, "Quickbites_Restaurant_Performance_Report.xlsx");
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        Quickbites Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: "users", label: "Users" },
          { id: "restaurants", label: "Restaurants" },
          { id: "orders", label: "Orders Report" },
          { id: "performance", label: "Restaurant Performance" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 ${
              activeTab === tab.id
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-600 hover:text-orange-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          {userLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : userError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {userError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">User Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchUsers}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportUsersExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <Download className="h-4 w-4" /> Download Report
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-orange-50">
                    <tr>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("name")}
                      >
                        Name{" "}
                        {userSortConfig.key === "name" &&
                          (userSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("email")}
                      >
                        Email{" "}
                        {userSortConfig.key === "email" &&
                          (userSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="p-3 text-left">Phone</th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("createdAt")}
                      >
                        Created At{" "}
                        {userSortConfig.key === "createdAt" &&
                          (userSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleUserSort("updatedAt")}
                      >
                        Updated At{" "}
                        {userSortConfig.key === "updatedAt" &&
                          (userSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{user.name || "N/A"}</td>
                        <td className="p-3">{user.email || "N/A"}</td>
                        <td className="p-3">{user.phone || "N/A"}</td>
                        <td className="p-3">{formatDate(user.createdAt)}</td>
                        <td className="p-3">{formatDate(user.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Users: {filteredUsers.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Restaurants Tab */}
      {activeTab === "restaurants" && (
        <div>
          {restaurantLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : restaurantError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {restaurantError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Restaurants Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search restaurants..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={restaurantSearchQuery}
                      onChange={(e) => {
                        setRestaurantSearchQuery(e.target.value);
                        filterRestaurants(e.target.value);
                      }}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchRestaurants}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportRestaurantsExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <Download className="h-4 w-4" /> Download Report
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="p-3 text-left">Restaurant Name</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRestaurants.map((restaurant) => (
                      <tr
                        key={restaurant._id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{restaurant.name || "N/A"}</td>
                        <td className="p-3">{restaurant.address || "N/A"}</td>
                        <td className="p-3">{restaurant.phone || "N/A"}</td>
                        <td className="p-3">{restaurant.email || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Restaurants: {filteredRestaurants.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders Report Tab */}
      {activeTab === "orders" && (
        <div>
          {userLoading || ordersLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : userError || ordersError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {userError || ordersError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Orders Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={ordersSearchTerm}
                      onChange={(e) => setOrdersSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={async () => {
                        const userData = await fetchUsers();
                        await fetchOrders(userData);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportOrdersReportExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <Download className="h-4 w-4" /> Download Report
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-orange-50">
                    <tr>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleOrdersSort("name")}
                      >
                        Name{" "}
                        {ordersSortConfig.key === "name" &&
                          (ordersSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleOrdersSort("email")}
                      >
                        Email{" "}
                        {ordersSortConfig.key === "email" &&
                          (ordersSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleOrdersSort("totalOrders")}
                      >
                        Total Orders{" "}
                        {ordersSortConfig.key === "totalOrders" &&
                          (ordersSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrdersReport.map((report) => (
                      <tr
                        key={report.userId}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{report.name}</td>
                        <td className="p-3">{report.email}</td>
                        <td className="p-3">{report.totalOrders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Users with Orders: {filteredOrdersReport.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Restaurant Performance Tab */}
      {activeTab === "performance" && (
        <div>
          {performanceLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : performanceError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {performanceError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Restaurant Performance Report
                </h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search restaurants..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={performanceSearchTerm}
                      onChange={(e) => setPerformanceSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={async () => {
                        const ordersData = await fetchOrders(users);
                        const restaurantData = await fetchRestaurants();
                        await fetchRestaurantPerformance(
                          ordersData,
                          restaurantData
                        );
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportPerformanceReportExcel}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <Download className="h-4 w-4" /> Download Report
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-orange-50">
                    <tr>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handlePerformanceSort("name")}
                      >
                        Restaurant Name{" "}
                        {performanceSortConfig.key === "name" &&
                          (performanceSortConfig.direction === "asc"
                            ? "↑"
                            : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handlePerformanceSort("totalOrders")}
                      >
                        Total Orders{" "}
                        {performanceSortConfig.key === "totalOrders" &&
                          (performanceSortConfig.direction === "asc"
                            ? "↑"
                            : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPerformanceReport.map((report) => (
                      <tr
                        key={report.restaurantId}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{report.name}</td>
                        <td className="p-3">{report.totalOrders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Restaurants: {filteredPerformanceReport.length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Report;
