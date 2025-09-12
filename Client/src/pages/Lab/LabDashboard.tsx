import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TestTube,
  FileText,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import type { LabResultResponse, LabTestResponse } from "../../types/labV2";
import { labResultsApi, labTestsApi } from "../../Services/labV2";
import { StatsCard } from "../../components/Lab/StatsCard";
import { ResultCard } from "../../components/Lab/ResultCard";
import { TestCard } from "../../components/Lab/TestCard";
import { LoadingSpinner } from "../../common/Spinners/LoadingSpinner2";

export const LabDashboard: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();

  // State management
  const [activeTab, setActiveTab] = useState<"results" | "tests">("results");
  const [results, setResults] = useState<LabResultResponse[]>([]);
  const [tests, setTests] = useState<LabTestResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [resultsLoading, setResultsLoading] = useState(false);
  const [testsLoading, setTestsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [currentResultsPage, setCurrentResultsPage] = useState(0);
  const [currentTestsPage, setCurrentTestsPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  // Load patient results
  const loadResults = async (page: number = 0) => {
    if (!patientId) return;

    setResultsLoading(true);
    try {
      const response = await labResultsApi.getPatientResults(
        patientId,
        page,
        10
      );
      setResults(response.data.content);
      setTotalResults(response.data.totalElements);
      setCurrentResultsPage(page);
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setResultsLoading(false);
    }
  };

  // Load available tests
  const loadTests = async (page: number = 0) => {
    setTestsLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await labTestsApi.searchTests(searchQuery, page, 20);
      } else if (selectedCategory) {
        response = await labTestsApi.getTestsByCategory(selectedCategory);
        setTests(response.data);
        setTestsLoading(false);
        return;
      } else {
        response = await labTestsApi.getAllTests(page, 20);
      }

      setTests(response.data.content);
      setTotalTests(response.data.totalElements);
      setCurrentTestsPage(page);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setTestsLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await labTestsApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadResults();
    loadTests();
    loadCategories();
  }, [patientId]);

  // Handle search and filter changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (activeTab === "tests") {
        loadTests(0);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedCategory]);

  // Calculate statistics
  const stats = {
    totalResults: results.length,
    normalResults: results.filter((r) =>
      r.overallResult.toLowerCase().includes("normal")
    ).length,
    criticalResults: results.filter((r) => r.critical).length,
    pendingResults: results.filter((r) => !r.verified).length,
  };

  const handleAssignTest = (testId: string) => {
    // Implementation for test assignment
    console.log("Assigning test:", testId, "to patient:", patientId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <Stethoscope className="text-white" size={28} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Lab Dashboard
                </h1>
                <p className="text-gray-600">Patient ID: {patientId}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                loadResults(currentResultsPage);
                loadTests(currentTestsPage);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Results"
            value={totalResults}
            icon={FileText}
            color="from-blue-500 to-blue-600"
            index={0}
          />
          <StatsCard
            title="Normal Results"
            value={stats.normalResults}
            icon={CheckCircle}
            color="from-green-500 to-green-600"
            index={1}
          />
          <StatsCard
            title="Critical Results"
            value={stats.criticalResults}
            icon={AlertTriangle}
            color="from-red-500 to-red-600"
            index={2}
          />
          <StatsCard
            title="Available Tests"
            value={totalTests}
            icon={TestTube}
            color="from-purple-500 to-purple-600"
            index={3}
          />
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8"
        >
          <div className="flex gap-2">
            {[
              { key: "results", label: "Lab Results", icon: FileText },
              { key: "tests", label: "Available Tests", icon: TestTube },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key as "results" | "tests")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters (for tests tab) */}
        <AnimatePresence>
          {activeTab === "tests" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="md:w-64">
                  <div className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {resultsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner text="Loading lab results..." />
                </div>
              ) : (
                <div className="space-y-6">
                  {results.length > 0 ? (
                    results.map((result, index) => (
                      <ResultCard
                        key={result.id}
                        result={result}
                        index={index}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12 bg-white rounded-xl shadow-sm"
                    >
                      <FileText
                        className="mx-auto mb-4 text-gray-400"
                        size={48}
                      />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Results Found
                      </h3>
                      <p className="text-gray-600">
                        This patient doesn't have any lab results yet.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Pagination for Results */}
              {totalResults > 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-8"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadResults(currentResultsPage - 1)}
                      disabled={currentResultsPage === 0}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {currentResultsPage + 1} of{" "}
                      {Math.ceil(totalResults / 10)}
                    </span>
                    <button
                      onClick={() => loadResults(currentResultsPage + 1)}
                      disabled={(currentResultsPage + 1) * 10 >= totalResults}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "tests" && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {testsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner text="Loading available tests..." />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tests.length > 0 ? (
                    tests.map((test, index) => (
                      <TestCard
                        key={test.id}
                        test={test}
                        index={index}
                        onAssign={handleAssignTest}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm"
                    >
                      <TestTube
                        className="mx-auto mb-4 text-gray-400"
                        size={48}
                      />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Tests Found
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery || selectedCategory
                          ? "No tests match your search criteria."
                          : "No lab tests are available at the moment."}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Pagination for Tests */}
              {!selectedCategory && totalTests > 20 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-8"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadTests(currentTestsPage - 1)}
                      disabled={currentTestsPage === 0}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {currentTestsPage + 1} of{" "}
                      {Math.ceil(totalTests / 20)}
                    </span>
                    <button
                      onClick={() => loadTests(currentTestsPage + 1)}
                      disabled={(currentTestsPage + 1) * 20 >= totalTests}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
