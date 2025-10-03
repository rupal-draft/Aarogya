"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { getOrders } from "../../../Services/orderService";
import { Link } from "react-router-dom";
import type { OrderDTO } from "../../../types/order";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 0,
    size: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const ordersData = await getOrders();

      // Filter orders based on current filters
      let filteredOrders = ordersData;

      if (filters.status) {
        filteredOrders = filteredOrders.filter(
          (order) => order.status.toUpperCase() === filters.status.toUpperCase()
        );
      }

      if (filters.search) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
            order.patientName
              .toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            order.items.some((item) =>
              item.medicineName
                .toLowerCase()
                .includes(filters.search.toLowerCase())
            )
        );
      }

      // Apply pagination
      const startIndex = filters.page * filters.size;
      const endIndex = startIndex + filters.size;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      setOrders(paginatedOrders);
      setTotalElements(filteredOrders.length);
      setTotalPages(Math.ceil(filteredOrders.length / filters.size));
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? Number(value) : 0,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "PROCESSING":
        return <Package className="w-4 h-4" />;
      case "SHIPPED":
        return <Truck className="w-4 h-4" />;
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const OrderCard = ({ order, index }: { order: OrderDTO; index: number }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Order #{order.id.slice(-8)}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(order.orderDate)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">
              ${(order.totalAmount * 1.1).toFixed(2)}
            </p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() +
                order.status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-4">
          {order.items.slice(0, 2).map((item, itemIndex) => (
            <motion.div
              key={item.medicineId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + itemIndex * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={
                    item.medicineImage || "/placeholder.svg?height=48&width=48"
                  }
                  alt={item.medicineName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.medicineName}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </motion.div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 text-center">
              +{order.items.length - 2} more item(s)
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3 sm:mb-0">
            <Truck className="w-4 h-4" />
            <span>Shipping to {order.shippingAddress.split(",")[0]}</span>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/order-confirmation/${order.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors duration-200"
            >
              View Details
            </Link>
            {order.status === "PENDING" && (
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-teal-500 rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white"
          >
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Floating Background Elements */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full"
            />

            <div className="relative z-10 p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold mb-2 flex items-center"
                  >
                    <Package className="w-10 h-10 mr-4" />
                    My Orders
                  </motion.h2>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-emerald-100 text-lg"
                  >
                    {totalElements} order{totalElements !== 1 ? "s" : ""} found
                  </motion.p>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 md:mt-0"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl"
                  >
                    📦
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
              (status) => {
                const count = orders.filter(
                  (order) => order.status.toUpperCase() === status
                ).length;

                return (
                  <motion.div
                    key={status}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`p-6 rounded-2xl border-2 ${getStatusColor(
                      status
                    )} text-center cursor-pointer transition-all duration-300`}
                    onClick={() =>
                      handleFilterChange(
                        "status",
                        filters.status === status ? "" : status
                      )
                    }
                  >
                    <div className="flex justify-center mb-2">
                      {getStatusIcon(status)}
                    </div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm font-medium">{status}</div>
                  </motion.div>
                );
              }
            )}
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Filter className="w-6 h-6 mr-3 text-emerald-500" />
                  Filter Orders
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>{showFilters ? "Hide" : "Show"} Filters</span>
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                      <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          id="search"
                          value={filters.search}
                          onChange={(e) =>
                            handleFilterChange("search", e.target.value)
                          }
                          placeholder="Order ID, patient, medicine..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">All Statuses</option>
                        {[
                          "PENDING",
                          "PROCESSING",
                          "SHIPPED",
                          "DELIVERED",
                          "CANCELLED",
                        ].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Page Size */}
                    <div>
                      <label
                        htmlFor="size"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Items per page
                      </label>
                      <select
                        id="size"
                        value={filters.size}
                        onChange={(e) =>
                          handleFilterChange(
                            "size",
                            Number.parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    {/* Refresh Button */}
                    <div className="flex items-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchOrders}
                        className="w-full px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(filters.status || filters.search) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600">
                        Active filters:
                      </span>
                      {filters.status && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                            filters.status
                          )} flex items-center space-x-1`}
                        >
                          <span>{filters.status}</span>
                          <button
                            onClick={() => handleFilterChange("status", "")}
                            className="hover:text-red-600 ml-1"
                          >
                            ×
                          </button>
                        </motion.span>
                      )}
                      {filters.search && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200 flex items-center space-x-1"
                        >
                          <Search className="w-3 h-3" />
                          <span>"{filters.search}"</span>
                          <button
                            onClick={() => handleFilterChange("search", "")}
                            className="hover:text-red-600 ml-1"
                          >
                            ×
                          </button>
                        </motion.span>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-red-500 text-6xl mb-4"
              >
                ⚠️
              </motion.div>
              <h3 className="text-xl font-bold text-red-800 mb-2">
                Error Loading Orders
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchOrders}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}

          {/* Orders List */}
          {!error && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-6"
                  >
                    📦
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No orders found
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {filters.status || filters.search
                      ? "Try adjusting your filters or place a new order"
                      : "You haven't placed any orders yet. Start shopping for medicines today!"}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/medicines"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold space-x-3"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Shop Medicines</span>
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    variants={containerVariants}
                    className="space-y-6"
                  >
                    {orders.map((order, index) => (
                      <OrderCard key={order.id} order={order} index={index} />
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      variants={itemVariants}
                      className="flex justify-center items-center space-x-4 mt-12"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleFilterChange(
                            "page",
                            Math.max(0, filters.page - 1)
                          )
                        }
                        disabled={filters.page === 0 || loading}
                        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </motion.button>

                      <div className="flex space-x-2">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNum =
                              Math.max(
                                0,
                                Math.min(totalPages - 5, filters.page - 2)
                              ) + i;
                            if (pageNum >= totalPages) return null;

                            return (
                              <motion.button
                                key={pageNum}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleFilterChange("page", pageNum)
                                }
                                className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                                  filters.page === pageNum
                                    ? "bg-emerald-500 text-white shadow-lg"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum + 1}
                              </motion.button>
                            );
                          }
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleFilterChange(
                            "page",
                            Math.min(totalPages - 1, filters.page + 1)
                          )
                        }
                        disabled={filters.page >= totalPages - 1 || loading}
                        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Loading overlay for pagination */}
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center py-8"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <RefreshCw className="w-8 h-8 text-emerald-500" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrdersPage;
