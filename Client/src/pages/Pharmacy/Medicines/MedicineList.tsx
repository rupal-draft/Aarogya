"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { FilterOptions, MedicineResponseDTO } from "../../../types/medicine"
import { getAllMedicines } from "../../../Services/medicineService"
import SearchBar from "../../../components/Pharmacy/Medicines/SearchBar"
import CategoryTabs from "../../../components/Pharmacy/Medicines/CategoryTabs"
import FilterSidebar from "../../../components/Pharmacy/FilterSidebar"
import LoadingSpinner from "../../../components/Spinners/LoadingSpinner"
import ErrorDisplay from "../../../components/Error/ErrorDisplay"
import MedicineCard from "../../../components/Pharmacy/Medicines/MedicineCard"


const MedicineListPage = () => {
  // State for medicines and loading
  const [medicines, setMedicines] = useState<MedicineResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({})
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch medicines on component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getAllMedicines()
        setMedicines(data)
      } catch (err) {
        setError("Failed to load medicines. Please try again.")
        console.error("Error fetching medicines:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [])

  // Extract unique categories and manufacturers for filters
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(medicines.map((medicine) => medicine.category))]
    return uniqueCategories.sort()
  }, [medicines])

  const manufacturers = useMemo(() => {
    const uniqueManufacturers = [...new Set(medicines.map((medicine) => medicine.manufacturer))]
    return uniqueManufacturers.sort()
  }, [medicines])

  // Get price range for filters
  const priceRange = useMemo(() => {
    if (medicines.length === 0) return { min: 0, max: 1000 }

    const prices = medicines.map((medicine) => Number(medicine.price))
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    }
  }, [medicines])

  // Apply filters to medicines (client-side filtering)
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      // Category filter
      if (filters.category && medicine.category !== filters.category) {
        return false
      }

      // Manufacturer filter
      if (filters.manufacturer && medicine.manufacturer !== filters.manufacturer) {
        return false
      }

      // Price range filter
      if (filters.minPrice !== undefined && Number(medicine.price) < filters.minPrice) {
        return false
      }
      if (filters.maxPrice !== undefined && Number(medicine.price) > filters.maxPrice) {
        return false
      }

      // Prescription required filter
      if (
        filters.prescriptionRequired !== undefined &&
        medicine.prescriptionRequired !== filters.prescriptionRequired
      ) {
        return false
      }

      // In stock filter
      if (filters.inStock && medicine.stockQuantity <= 0) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          medicine.name.toLowerCase().includes(searchLower) ||
          medicine.description.toLowerCase().includes(searchLower) ||
          medicine.manufacturer.toLowerCase().includes(searchLower) ||
          medicine.category.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [medicines, filters])

  // Sort filtered medicines
  const sortedMedicines = useMemo(() => {
    if (!filters.sortBy) return filteredMedicines

    return [...filteredMedicines].sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return Number(a.price) - Number(b.price)
        case "price-desc":
          return Number(b.price) - Number(a.price)
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })
  }, [filteredMedicines, filters.sortBy])

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Handle search
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }))
  }

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setActiveCategory(category)
    setFilters((prev) => ({ ...prev, category: category || undefined }))
  }

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-500 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>

          {/* Animated pills and medical symbols */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 w-12 h-12"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Health, Our Priority</h1>
            <p className="text-xl text-blue-100 mb-8">Discover our wide range of medicines and healthcare products</p>
            <div className="max-w-xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,144C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <motion.button
            onClick={toggleFilters}
            className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </motion.button>
        </div>

        {/* Category tabs */}
        <div className="mb-6">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter sidebar */}
          <FilterSidebar
            manufacturers={manufacturers}
            priceRange={priceRange}
            filters={filters}
            onFilterChange={handleFilterChange}
            showOnMobile={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Main content */}
          <div className="flex-1">
            {/* Results info */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {loading ? "Loading medicines..." : `${sortedMedicines.length} Medicines Found`}
              </h2>

              {/* Sort dropdown */}
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-600 mr-2 hidden sm:inline">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={filters.sortBy || ""}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterOptions["sortBy"] })}
                  className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Medicines grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-12"
                >
                  <LoadingSpinner />
                </motion.div>
              ) : error ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
                </motion.div>
              ) : sortedMedicines.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg p-8 text-center shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-teal-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Medicines Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                  <button
                    onClick={() => {
                      setFilters({})
                      setActiveCategory(null)
                    }}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="medicines"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  transition={{
                    staggerChildren: 0.05,
                  }}
                >
                  {sortedMedicines.map((medicine) => (
                    <MedicineCard key={medicine.id} medicine={medicine} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicineListPage
