"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid,
  List,
  TestTube,
  Sparkles,
  Heart,
  Activity,
  Zap,
  Shield,
} from "lucide-react";
import type { LabTestResponse } from "../../types/lab";
import LabTestCard from "./LabTestCard";
import { labTestService } from "../../Services/lab";

interface LabTestSearchProps {
  selectedTests: LabTestResponse[];
  onTestToggle: (test: LabTestResponse) => void;
  onContinue: () => void;
}

const LabTestSearch: React.FC<LabTestSearchProps> = ({
  selectedTests,
  onTestToggle,
  onContinue,
}) => {
  const [tests, setTests] = useState<LabTestResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else if (selectedCategory === "all") {
      loadAllTests();
    } else {
      loadTestsByCategory();
    }
  }, [searchQuery, selectedCategory]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [testsData, categoriesData] = await Promise.all([
        labTestService.getAllTestsList(),
        labTestService.getCategories(),
      ]);
      setTests(testsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading lab tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllTests = async () => {
    try {
      setLoading(true);
      const testsData = await labTestService.getAllTestsList();
      setTests(testsData);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTestsByCategory = async () => {
    try {
      setLoading(true);
      const testsData = await labTestService.getTestsByCategory(
        selectedCategory
      );
      setTests(testsData);
    } catch (error) {
      console.error("Error loading tests by category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchResults = await labTestService.searchTests(searchQuery);
      setTests(searchResults.content);
    } catch (error) {
      console.error("Error searching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      Blood: TestTube,
      Cardiac: Heart,
      Liver: Shield,
      Kidney: Zap,
      Thyroid: Activity,
      Diabetes: TestTube,
      Lipid: Sparkles,
      Urine: TestTube,
    };
    return icons[category as keyof typeof icons] || TestTube;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Blood: "from-red-500 to-pink-500",
      Cardiac: "from-blue-500 to-cyan-500",
      Liver: "from-green-500 to-emerald-500",
      Kidney: "from-purple-500 to-violet-500",
      Thyroid: "from-indigo-500 to-blue-500",
      Diabetes: "from-orange-500 to-red-500",
      Lipid: "from-pink-500 to-rose-500",
      Urine: "from-yellow-500 to-orange-500",
    };
    return (
      colors[category as keyof typeof colors] || "from-gray-500 to-slate-500"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/modern-medical-lab.png"
            alt="Lab Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90" />
        </div>

        {/* Floating Medical Icons */}
        {[TestTube, Heart, Activity, Shield, Zap].map((Icon, index) => (
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
        ))}

        {/* Floating Sparkles */}
        {[...Array(15)].map((_, i) => (
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
                  <TestTube className="w-10 h-10 text-white" />
                </div>
                {/* Floating hearts around the icon */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      rotate: 360,
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}
                    className="absolute w-4 h-4 text-pink-300"
                    style={{
                      top: `${-10 + Math.cos((i * 60 * Math.PI) / 180) * 40}px`,
                      left: `${30 + Math.sin((i * 60 * Math.PI) / 180) * 40}px`,
                    }}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Lab Tests
              <span className="block text-yellow-300">Made Simple 🧪</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive range of diagnostic tests. Get
              accurate results with world-class laboratory services.
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
                    src="/placeholder-jfxao.png"
                    alt="Tests Available"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  200+
                </div>
                <div className="text-blue-100">Available Tests</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <img
                    src="/medical-laboratory-accuracy.png"
                    alt="Accuracy"
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
                    <Shield className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-green-300 mb-2">
                  99.9%
                </div>
                <div className="text-blue-100">Accuracy Rate</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <img
                    src="/placeholder-5l4nx.png"
                    alt="Fast Results"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center"
                  >
                    <Zap className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <div className="text-4xl font-bold text-pink-300 mb-2">24h</div>
                <div className="text-blue-100">Fast Results</div>
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

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for lab tests..."
              className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg"
            />
          </div>
        </div>

        {/* Categories and View Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0">
          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All Tests
            </motion.button>

            {categories.map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? `bg-gradient-to-r ${getCategoryColor(
                          category
                        )} text-white shadow-lg`
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category}</span>
                </motion.button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Tests Summary */}
        {selectedTests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selected Tests ({selectedTests.length})
                </h3>
                <p className="text-gray-600">
                  Total: ₹
                  {selectedTests.reduce((sum, test) => sum + test.price, 0)}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue to Booking
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Tests Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {tests.map((test, index) => (
                <LabTestCard
                  key={test.id}
                  test={test}
                  isSelected={selectedTests.some(
                    (selected) => selected.id === test.id
                  )}
                  onToggleSelect={onTestToggle}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && tests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tests found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LabTestSearch;
