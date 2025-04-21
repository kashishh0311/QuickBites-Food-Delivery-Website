import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  RefreshCw,
  Search,
  Download,
  Star,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import * as XLSX from "xlsx";

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState("feedback");

  // Feedback State
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState("");
  const [feedbackSortConfig, setFeedbackSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Sales Report State
  const [salesReport, setSalesReport] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState(null);
  const [salesSearchTerm, setSalesSearchTerm] = useState("");
  const [salesSortConfig, setSalesSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Order Report State
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderSortConfig, setOrderSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // Food Performance State
  const [foodPerformance, setFoodPerformance] = useState([]);
  const [performanceLoading, setPerformanceLoading] = useState(true);
  const [performanceError, setPerformanceError] = useState(null);
  const [performanceSearchTerm, setPerformanceSearchTerm] = useState("");
  const [performanceSortConfig, setPerformanceSortConfig] = useState({
    key: "totalOrders",
    direction: "desc",
  });

  // Fetch Functions
  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const response = await axios.get("/api/v1/restaurant/getFeedback");
      const feedbackData = response.data.data || [];
      setFeedback(feedbackData);
      setFeedbackError(null);
      return feedbackData;
    } catch (err) {
      setFeedbackError(
        err.response?.data?.message || "Failed to fetch feedback"
      );
      console.error("Error fetching feedback:", err);
      return [];
    } finally {
      setFeedbackLoading(false);
    }
  };

  const fetchSalesReport = async () => {
    try {
      setSalesLoading(true);
      const response = await axios.get("/api/v1/restaurant/getSalesReport");
      const salesData = response.data.data || [];
      setSalesReport(salesData);
      setSalesError(null);
      return salesData;
    } catch (err) {
      setSalesError(
        err.response?.data?.message || "Failed to fetch sales report"
      );
      console.error("Error fetching sales report:", err);
      return [];
    } finally {
      setSalesLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const response = await axios.get(
        "/api/v1/restaurant/getAllOrdersOfRestaurant"
      );
      const orderData = response.data.data || [];
      setOrders(orderData);
      setOrderError(null);
      return orderData;
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
      return [];
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchFoodPerformance = async () => {
    try {
      setPerformanceLoading(true);
      const response = await axios.get("/api/v1/restaurant/getFoodPerformance");
      const performanceData = response.data.data || [];
      setFoodPerformance(performanceData);
      setPerformanceError(null);
      return performanceData;
    } catch (err) {
      setPerformanceError(
        err.response?.data?.message || "Failed to fetch food performance"
      );
      console.error("Error fetching food performance:", err);
      return [];
    } finally {
      setPerformanceLoading(false);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchFeedback(),
        fetchSalesReport(),
        fetchOrders(),
        fetchFoodPerformance(),
      ]);
    };
    fetchData();
  }, []);

  // Feedback Functions
  const handleFeedbackSort = (key) => {
    let direction = "asc";
    if (
      feedbackSortConfig.key === key &&
      feedbackSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setFeedbackSortConfig({ key, direction });

    const sortedFeedback = [...feedback].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFeedback(sortedFeedback);
  };

  const filteredFeedback = feedback.filter(
    (item) =>
      item.foodId?.name
        ?.toLowerCase()
        .includes(feedbackSearchTerm.toLowerCase()) ||
      item.customerId?.name
        ?.toLowerCase()
        .includes(feedbackSearchTerm.toLowerCase())
  );

  // Sales Report Functions
  const handleSalesSort = (key) => {
    let direction = "asc";
    if (salesSortConfig.key === key && salesSortConfig.direction === "asc") {
      direction = "desc";
    }
    setSalesSortConfig({ key, direction });

    const sortedSales = [...salesReport].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSalesReport(sortedSales);
  };

  const filteredSalesReport = salesReport.filter((report) =>
    report.date.toLowerCase().includes(salesSearchTerm.toLowerCase())
  );

  // Order Report Functions
  const handleOrderSort = (key) => {
    let direction = "asc";
    if (orderSortConfig.key === key && orderSortConfig.direction === "asc") {
      direction = "desc";
    }
    setOrderSortConfig({ key, direction });

    const sortedOrders = [...orders].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setOrders(sortedOrders);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerId?.name
        ?.toLowerCase()
        .includes(orderSearchTerm.toLowerCase()) ||
      order.orderStatus.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  // Food Performance Functions
  const handlePerformanceSort = (key) => {
    let direction = "asc";
    if (
      performanceSortConfig.key === key &&
      performanceSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setPerformanceSortConfig({ key, direction });

    const sortedPerformance = [...foodPerformance].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFoodPerformance(sortedPerformance);
  };

  const filteredFoodPerformance = foodPerformance.filter((report) =>
    report.name.toLowerCase().includes(performanceSearchTerm.toLowerCase())
  );

  // Export Functions
  const exportFeedbackExcel = () => {
    if (filteredFeedback.length === 0) {
      alert("No feedback data available to export!");
      return;
    }
    const headers = ["Food Name", "Customer Name", "Rating", "Review", "Date"];
    const data = filteredFeedback.map((item) => ({
      "Food Name": item.foodId?.name || "N/A",
      "Customer Name": item.customerId?.name || "N/A",
      Rating: item.rating || 0,
      Review: item.review || "N/A",
      Date: formatDate(item.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
    XLSX.writeFile(workbook, "Restaurant_Feedback_Report.xlsx");
  };

  const exportSalesReportExcel = () => {
    if (filteredSalesReport.length === 0) {
      alert("No sales data available to export!");
      return;
    }
    const headers = ["Date", "Total Orders", "Total Revenue"];
    const data = filteredSalesReport.map((report) => ({
      Date: report.date,
      "Total Orders": report.totalOrders,
      "Total Revenue": report.totalRevenue,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales_Report");
    XLSX.writeFile(workbook, "Restaurant_Sales_Report.xlsx");
  };

  const exportOrdersExcel = () => {
    if (filteredOrders.length === 0) {
      alert("No orders available to export!");
      return;
    }
    const headers = [
      "Order ID",
      "Customer Name",
      "Total Amount",
      "Status",
      "Date",
    ];
    const data = filteredOrders.map((order) => ({
      "Order ID": order._id,
      "Customer Name": order.customerId?.name || "N/A",
      "Total Amount": order.totalPrice || 0,
      Status: order.orderStatus,
      Date: formatDate(order.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "Restaurant_Orders_Report.xlsx");
  };

  const exportFoodPerformanceExcel = () => {
    if (filteredFoodPerformance.length === 0) {
      alert("No food performance data available to export!");
      return;
    }
    const headers = [
      "Food Name",
      "Total Orders",
      "Total Revenue",
      "Average Rating",
    ];
    const data = filteredFoodPerformance.map((report) => ({
      "Food Name": report.name,
      "Total Orders": report.totalOrders,
      "Total Revenue": report.totalRevenue,
      "Average Rating": report.averageRating || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Food_Performance");
    XLSX.writeFile(workbook, "Restaurant_Food_Performance_Report.xlsx");
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        Restaurant Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: "feedback", label: "Feedback", icon: Star },
          { id: "sales", label: "Sales Report", icon: ShoppingBag },
          { id: "orders", label: "Order Report", icon: Utensils },
          { id: "performance", label: "Food Performance", icon: Utensils },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 ${
              activeTab === tab.id
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-600 hover:text-orange-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feedback Tab */}
      {activeTab === "feedback" && (
        <div>
          {feedbackLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : feedbackError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {feedbackError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Feedback Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by food or customer..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={feedbackSearchTerm}
                      onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchFeedback}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportFeedbackExcel}
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
                        onClick={() => handleFeedbackSort("foodId.name")}
                      >
                        Food Name{" "}
                        {feedbackSortConfig.key === "foodId.name" &&
                          (feedbackSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleFeedbackSort("customerId.name")}
                      >
                        Customer{" "}
                        {feedbackSortConfig.key === "customerId.name" &&
                          (feedbackSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleFeedbackSort("rating")}
                      >
                        Rating{" "}
                        {feedbackSortConfig.key === "rating" &&
                          (feedbackSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      {/* <th className="p-3 text-left">Review</th> */}
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleFeedbackSort("createdAt")}
                      >
                        Date{" "}
                        {feedbackSortConfig.key === "createdAt" &&
                          (feedbackSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeedback.map((item) => (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{item.foodId?.name || "N/A"}</td>
                        <td className="p-3">
                          {item.customerId?.name || "N/A"}
                        </td>
                        <td className="p-3">{item.rating || "N/A"}</td>
                        {/* <td className="p-3">{item.review || "N/A"}</td> */}
                        <td className="p-3">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Feedback: {filteredFeedback.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sales Report Tab */}
      {activeTab === "sales" && (
        <div>
          {salesLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : salesError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {salesError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Sales Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by date..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={salesSearchTerm}
                      onChange={(e) => setSalesSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchSalesReport}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportSalesReportExcel}
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
                        onClick={() => handleSalesSort("date")}
                      >
                        Date{" "}
                        {salesSortConfig.key === "date" &&
                          (salesSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleSalesSort("totalOrders")}
                      >
                        Total Orders{" "}
                        {salesSortConfig.key === "totalOrders" &&
                          (salesSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleSalesSort("totalRevenue")}
                      >
                        Total Revenue{" "}
                        {salesSortConfig.key === "totalRevenue" &&
                          (salesSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalesReport.map((report) => (
                      <tr
                        key={report.date}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{report.date}</td>
                        <td className="p-3">{report.totalOrders}</td>
                        <td className="p-3">{report.totalRevenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Sales Records: {filteredSalesReport.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Report Tab */}
      {activeTab === "orders" && (
        <div>
          {orderLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : orderError ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              Error: {orderError}. Please try again.
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Order Report</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by customer or status..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchOrders}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportOrdersExcel}
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
                        onClick={() => handleOrderSort("_id")}
                      >
                        Order ID{" "}
                        {orderSortConfig.key === "_id" &&
                          (orderSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleOrderSort("customerId.name")}
                      >
                        Customer{" "}
                        {orderSortConfig.key === "customerId.name" &&
                          (orderSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      {/* <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleOrderSort("totalPrice")}
                      >
                        Total Amount{" "}
                        {orderSortConfig.key === "totalPrice" &&
                          (orderSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th> */}
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleOrderSort("orderStatus")}
                      >
                        Status{" "}
                        {orderSortConfig.key === "orderStatus" &&
                          (orderSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handleOrderSort("createdAt")}
                      >
                        Date{" "}
                        {orderSortConfig.key === "createdAt" &&
                          (orderSortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{order._id}</td>
                        <td className="p-3">
                          {order.customerId?.name || "N/A"}
                        </td>
                        {/* <td className="p-3">{order.totalPrice || 0}</td> */}
                        <td className="p-3">{order.orderStatus}</td>
                        <td className="p-3">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Orders: {filteredOrders.length}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Food Performance Tab */}
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
                  Food Performance Report
                </h2>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by food name..."
                      className="w-full p-2 pl-10 border rounded-md"
                      value={performanceSearchTerm}
                      onChange={(e) => setPerformanceSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchFoodPerformance}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                      onClick={exportFoodPerformanceExcel}
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
                        Food Name{" "}
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
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handlePerformanceSort("totalRevenue")}
                      >
                        Total Revenue{" "}
                        {performanceSortConfig.key === "totalRevenue" &&
                          (performanceSortConfig.direction === "asc"
                            ? "↑"
                            : "↓")}
                      </th>
                      <th
                        className="p-3 text-left cursor-pointer"
                        onClick={() => handlePerformanceSort("averageRating")}
                      >
                        Average Rating{" "}
                        {performanceSortConfig.key === "averageRating" &&
                          (performanceSortConfig.direction === "asc"
                            ? "↑"
                            : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoodPerformance.map((report) => (
                      <tr
                        key={report.foodId}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{report.name}</td>
                        <td className="p-3">{report.totalOrders}</td>
                        <td className="p-3">{report.totalRevenue}</td>
                        <td className="p-3">{report.averageRating || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Total Foods: {filteredFoodPerformance.length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
