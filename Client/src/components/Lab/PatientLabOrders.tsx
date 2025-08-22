"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  TestTube,
  FileText,
  Download,
  X,
  AlertTriangle,
  CheckCircle,
  Package,
  Activity,
  Filter,
  Search,
} from "lucide-react";
import type { LabOrderResponse, LabResultResponse } from "../../types/lab";
import { labOrderService, labResultService } from "../../Services/lab";
import type { OrderStatus } from "../../Data/enums/lab";

interface PatientLabOrdersProps {
  onBack: () => void;
}

const PatientLabOrders: React.FC<PatientLabOrdersProps> = () => {
  const [orders, setOrders] = useState<LabOrderResponse[]>([]);
  const [results, setResults] = useState<LabResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<LabOrderResponse | null>(
    null
  );
  const [selectedResult, setSelectedResult] =
    useState<LabResultResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "results">("orders");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, resultsData] = await Promise.all([
        labOrderService.getMyOrders(),
        labResultService.getMyResults(),
      ]);
      setOrders(ordersData.content);
      setResults(resultsData.content);
    } catch (error) {
      console.error("Error loading lab data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus | string) => {
    const colors = {
      PENDING: "from-yellow-500 to-orange-500",
      CONFIRMED: "from-blue-500 to-cyan-500",
      SAMPLE_COLLECTED: "from-purple-500 to-violet-500",
      IN_PROGRESS: "from-indigo-500 to-blue-500",
      COMPLETED: "from-green-500 to-emerald-500",
      CANCELLED: "from-red-500 to-pink-500",
      NORMAL: "from-green-500 to-emerald-500",
      ABNORMAL: "from-yellow-500 to-orange-500",
      CRITICAL: "from-red-500 to-pink-500",
    };
    return (
      colors[status as keyof typeof colors] || "from-gray-500 to-slate-500"
    );
  };

  const getStatusIcon = (status: OrderStatus | string) => {
    const icons = {
      PENDING: Clock,
      CONFIRMED: CheckCircle,
      SAMPLE_COLLECTED: Package,
      IN_PROGRESS: Activity,
      COMPLETED: CheckCircle,
      CANCELLED: X,
      NORMAL: CheckCircle,
      ABNORMAL: AlertTriangle,
      CRITICAL: AlertTriangle,
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderedTests.some((test) =>
        test.testName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const filteredResults = results.filter((result) => {
    const matchesStatus =
      filterStatus === "all" || result.overallResult === filterStatus;
    const matchesSearch =
      result.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 text-white"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/medical-lab-dashboard-patient.png"
            alt="Lab Dashboard"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-teal-600/90 to-blue-700/90" />
        </div>

        {/* Floating Medical Icons */}
        {[TestTube, FileText, Activity, Package, CheckCircle].map(
          (Icon, index) => (
            <motion.div
              key={index}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + index,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute text-white/20"
              style={{
                top: `${20 + index * 15}%`,
                left: `${10 + index * 20}%`,
              }}
            >
              <Icon size={30 + index * 5} />
            </motion.div>
          )
        )}

        {/* Floating Sparkles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                {/* Floating sparkles around the icon */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      rotate: 360,
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.375,
                    }}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      top: `${-5 + Math.cos((i * 45 * Math.PI) / 180) * 35}px`,
                      left: `${35 + Math.sin((i * 45 * Math.PI) / 180) * 35}px`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              My Lab
              <span className="block text-yellow-300">Dashboard 🧪</span>
            </h1>

            <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Track your lab orders, view results, and manage your health
              records all in one place.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <img
                    src="/placeholder-3op11.png"
                    alt="Total Orders"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center"
                  >
                    <Package className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-blue-300 mb-2">
                  {orders.length}
                </div>
                <div className="text-green-100">Total Orders</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <img
                    src="/lab-results-available.png"
                    alt="Results Available"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-green-300 mb-2">
                  {results.length}
                </div>
                <div className="text-green-100">Results Available</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <img
                    src="/pending-lab-tests.png"
                    alt="Pending Tests"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <Clock className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  {
                    orders.filter(
                      (o) =>
                        o.status !== "COMPLETED" && o.status !== "CANCELLED"
                    ).length
                  }
                </div>
                <div className="text-green-100">Pending Tests</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            className="w-full h-12 fill-current text-blue-50"
          >
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Lab Orders</span>
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "results"
                    ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Test Results</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            >
              <option value="all">All Status</option>
              {activeTab === "orders" ? (
                <>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SAMPLE_COLLECTED">Sample Collected</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="NORMAL">Normal</option>
                  <option value="ABNORMAL">Abnormal</option>
                  <option value="CRITICAL">Critical</option>
                </>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </motion.div>
          ) : activeTab === "orders" ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredOrders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={`/placeholder-k29hm.png?height=300&width=400&query=lab+order+${order.status.toLowerCase()}`}
                        alt={`Order ${order.orderNumber}`}
                        className="w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                      />
                    </div>

                    {/* Floating Sparkles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [-10, 10, -10],
                          x: [-5, 5, -5],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${getStatusColor(
                          order.status
                        )} rounded-full opacity-60`}
                        style={{
                          top: `${20 + i * 25}%`,
                          right: `${10 + i * 15}%`,
                        }}
                      />
                    ))}

                    <div className="relative">
                      {/* Header */}
                      <div
                        className={`p-6 bg-gradient-to-r ${getStatusColor(
                          order.status
                        )} text-white`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                              <StatusIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                #{order.orderNumber}
                              </h3>
                              <p className="text-white/80 text-sm">
                                {order.orderedTests.length} tests
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹{order.totalAmount}
                            </p>
                            <p className="text-white/80 text-sm">
                              {order.status}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(
                              order.scheduledDateTime
                            ).toLocaleDateString()}
                          </span>
                          <Clock className="w-4 h-4 ml-4" />
                          <span>
                            {new Date(
                              order.scheduledDateTime
                            ).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{order.location}</span>
                        </div>

                        {/* Tests Preview */}
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-700">
                            Tests:
                          </p>
                          {order.orderedTests.slice(0, 2).map((test) => (
                            <div
                              key={test.testId}
                              className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                            >
                              {test.testName}
                            </div>
                          ))}
                          {order.orderedTests.length > 2 && (
                            <p className="text-sm text-blue-600">
                              +{order.orderedTests.length - 2} more tests
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-semibold">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResults.map((result, index) => {
                const StatusIcon = getStatusIcon(result.overallResult);
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedResult(result)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={`/lab-result.png?height=300&width=400&query=lab+result+${result.overallResult.toLowerCase()}`}
                        alt={`Result ${result.testName}`}
                        className="w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                      />
                    </div>

                    {/* Floating Sparkles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [-10, 10, -10],
                          x: [-5, 5, -5],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${getStatusColor(
                          result.overallResult
                        )} rounded-full opacity-60`}
                        style={{
                          top: `${20 + i * 25}%`,
                          right: `${10 + i * 15}%`,
                        }}
                      />
                    ))}

                    <div className="relative">
                      {/* Header */}
                      <div
                        className={`p-6 bg-gradient-to-r ${getStatusColor(
                          result.overallResult
                        )} text-white`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                              <StatusIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                {result.testName}
                              </h3>
                              <p className="text-white/80 text-sm">
                                #{result.orderNumber}
                              </p>
                            </div>
                          </div>
                          {result.isCritical && (
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">
                            Overall Result:
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              result.overallResult === "NORMAL"
                                ? "bg-green-100 text-green-800"
                                : result.overallResult === "ABNORMAL"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.overallResult}
                          </span>
                        </div>

                        {result.interpretation && (
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-800 font-semibold mb-1">
                              Interpretation:
                            </p>
                            <p className="text-sm text-blue-700">
                              {result.interpretation}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Sample Collected:
                            </span>
                            <span className="font-semibold">
                              {result.sampleCollectedAt
                                ? new Date(
                                    result.sampleCollectedAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Result Generated:
                            </span>
                            <span className="font-semibold">
                              {result.resultGeneratedAt
                                ? new Date(
                                    result.resultGeneratedAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {result.isVerified && (
                          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-800 font-semibold">
                              Verified by Pathologist
                            </span>
                          </div>
                        )}

                        {result.reportUrl && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Report</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading &&
          ((activeTab === "orders" && filteredOrders.length === 0) ||
            (activeTab === "results" && filteredResults.length === 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} found
              </h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : `You don't have any ${activeTab} yet`}
              </p>
            </motion.div>
          )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`p-6 bg-gradient-to-r ${getStatusColor(
                  selectedOrder.status
                )} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-white/80">
                      #{selectedOrder.orderNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">{selectedOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">
                      ₹{selectedOrder.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedOrder.scheduledDateTime
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Time</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedOrder.scheduledDateTime
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{selectedOrder.location}</p>
                </div>

                {selectedOrder.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Special Instructions
                    </p>
                    <p className="font-semibold">
                      {selectedOrder.specialInstructions}
                    </p>
                  </div>
                )}

                {/* Tests */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Ordered Tests</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderedTests.map((test) => {
                      const TestStatusIcon = getStatusIcon(test.status);
                      return (
                        <div
                          key={test.testId}
                          className="p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{test.testName}</h4>
                              <p className="text-sm text-gray-600">
                                {test.testCode}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{test.price}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <TestStatusIcon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-600">
                                  {test.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          {test.sampleCollectedAt && (
                            <p className="text-sm text-gray-600 mt-2">
                              Sample collected:{" "}
                              {new Date(
                                test.sampleCollectedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                          {test.resultExpectedAt && (
                            <p className="text-sm text-gray-600">
                              Result expected:{" "}
                              {new Date(
                                test.resultExpectedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Detail Modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`p-6 bg-gradient-to-r ${getStatusColor(
                  selectedResult.overallResult
                )} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedResult.testName}
                    </h2>
                    <p className="text-white/80">
                      Order #{selectedResult.orderNumber}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {selectedResult.isCritical && (
                      <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Critical</span>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Result Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Overall Result</p>
                    <p
                      className={`text-lg font-bold ${
                        selectedResult.overallResult === "NORMAL"
                          ? "text-green-600"
                          : selectedResult.overallResult === "ABNORMAL"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedResult.overallResult}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Sample Collected</p>
                    <p className="text-lg font-bold">
                      {selectedResult.sampleCollectedAt
                        ? new Date(
                            selectedResult.sampleCollectedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Result Generated</p>
                    <p className="text-lg font-bold">
                      {selectedResult.resultGeneratedAt
                        ? new Date(
                            selectedResult.resultGeneratedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Interpretation */}
                {selectedResult.interpretation && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-2">
                      Clinical Interpretation
                    </h3>
                    <p className="text-blue-800">
                      {selectedResult.interpretation}
                    </p>
                  </div>
                )}

                {/* Parameters */}
                {selectedResult.parameters &&
                  selectedResult.parameters.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-4">
                        Test Parameters
                      </h3>
                      <div className="space-y-3">
                        {selectedResult.parameters.map((param, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border ${
                              param.isAbnormal
                                ? "bg-red-50 border-red-200"
                                : "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{param.name}</h4>
                                <p className="text-sm text-gray-600">
                                  Normal Range: {param.normalRange}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-lg font-bold ${
                                    param.isAbnormal
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {param.value} {param.unit}
                                </p>
                                {param.isAbnormal && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-red-600">
                                      Abnormal
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Technical Notes */}
                {selectedResult.technicalNotes && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Technical Notes
                    </h3>
                    <p className="text-gray-700">
                      {selectedResult.technicalNotes}
                    </p>
                  </div>
                )}

                {/* Verification Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Verification Status</p>
                    <p className="text-sm text-gray-600">
                      {selectedResult.isVerified
                        ? "Verified by Pathologist"
                        : "Pending Verification"}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedResult.isVerified
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {selectedResult.isVerified ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Clock className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                {/* Download Report */}
                {selectedResult.reportUrl && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Full Report</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientLabOrders;
