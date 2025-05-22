"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { FilterOptions } from "../../types/medicine"

interface FilterSidebarProps {
  manufacturers: string[]
  priceRange: { min: number; max: number }
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  showOnMobile: boolean
  onClose: () => void
}

const FilterSidebar = ({
  manufacturers,
  priceRange,
  filters,
  onFilterChange,
  showOnMobile,
  onClose,
}: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)
  const [priceValues, setPriceValues] = useState<[number, number]>([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max,
  ])

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
    setPriceValues([filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max])
  }, [filters, priceRange])

  // Handle manufacturer selection
  const handleManufacturerChange = (manufacturer: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      manufacturer: prev.manufacturer === manufacturer ? undefined : manufacturer,
    }))
  }

  // Handle prescription filter
  const handlePrescriptionChange = (value: boolean | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      prescriptionRequired: value,
    }))
  }

  // Handle in-stock filter
  const handleInStockChange = (value: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      inStock: prev.inStock === value ? undefined : value,
    }))
  }

  // Handle price range change
  const handlePriceChange = (index: number, value: number) => {
    const newValues = [...priceValues] as [number, number]
    newValues[index] = value

    // Ensure min <= max
    if (index === 0 && value > newValues[1]) {
      newValues[1] = value
    } else if (index === 1 && value < newValues[0]) {
      newValues[0] = value
    }

    setPriceValues(newValues)

    setLocalFilters((prev) => ({
      ...prev,
      minPrice: newValues[0],
      maxPrice: newValues[1],
    }))
  }

  // Apply filters
  const applyFilters = () => {
    onFilterChange(localFilters)
    if (showOnMobile) {
      onClose()
    }
  }

  // Reset filters
  const resetFilters = () => {
    const resetValues: FilterOptions = {}
    setLocalFilters(resetValues)
    setPriceValues([priceRange.min, priceRange.max])
    onFilterChange(resetValues)
    if (showOnMobile) {
      onClose()
    }
  }

  // Sidebar variants for mobile animation
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.2 } },
  }

  // Desktop sidebar
  const desktopSidebar = (
    <motion.div
      className="w-full md:w-64 bg-white rounded-xl shadow-md p-6 h-fit sticky top-24"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">Min Price: ${priceValues[0]}</label>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceValues[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max Price: ${priceValues[1]}</label>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceValues[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Manufacturers */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Manufacturers</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {manufacturers.map((manufacturer) => (
                <div key={manufacturer} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`manufacturer-${manufacturer}`}
                    checked={localFilters.manufacturer === manufacturer}
                    onChange={() => handleManufacturerChange(manufacturer)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor={`manufacturer-${manufacturer}`} className="ml-2 text-sm text-gray-700">
                    {manufacturer}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Required */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Prescription</h4>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="prescription-all"
                  name="prescription"
                  checked={localFilters.prescriptionRequired === undefined}
                  onChange={() => handlePrescriptionChange(undefined)}
                  className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                />
                <label htmlFor="prescription-all" className="ml-2 text-sm text-gray-700">
                  All
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="prescription-yes"
                  name="prescription"
                  checked={localFilters.prescriptionRequired === true}
                  onChange={() => handlePrescriptionChange(true)}
                  className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                />
                <label htmlFor="prescription-yes" className="ml-2 text-sm text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="prescription-no"
                  name="prescription"
                  checked={localFilters.prescriptionRequired === false}
                  onChange={() => handlePrescriptionChange(false)}
                  className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                />
                <label htmlFor="prescription-no" className="ml-2 text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Availability</h4>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="in-stock"
                checked={localFilters.inStock === true}
                onChange={() => handleInStockChange(true)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700">
                In Stock Only
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <motion.button
              onClick={applyFilters}
              className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Apply
            </motion.button>
            <motion.button
              onClick={resetFilters}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Reset
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Mobile sidebar
  const mobileSidebar = (
    <AnimatePresence>
      {showOnMobile && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white z-50 md:hidden overflow-y-auto"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500">Min Price: ${priceValues[0]}</label>
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={priceValues[0]}
                        onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Max Price: ${priceValues[1]}</label>
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={priceValues[1]}
                        onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Manufacturers */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Manufacturers</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {manufacturers.map((manufacturer) => (
                      <div key={manufacturer} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-manufacturer-${manufacturer}`}
                          checked={localFilters.manufacturer === manufacturer}
                          onChange={() => handleManufacturerChange(manufacturer)}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor={`mobile-manufacturer-${manufacturer}`} className="ml-2 text-sm text-gray-700">
                          {manufacturer}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescription Required */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Prescription</h4>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mobile-prescription-all"
                        name="mobile-prescription"
                        checked={localFilters.prescriptionRequired === undefined}
                        onChange={() => handlePrescriptionChange(undefined)}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <label htmlFor="mobile-prescription-all" className="ml-2 text-sm text-gray-700">
                        All
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mobile-prescription-yes"
                        name="mobile-prescription"
                        checked={localFilters.prescriptionRequired === true}
                        onChange={() => handlePrescriptionChange(true)}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <label htmlFor="mobile-prescription-yes" className="ml-2 text-sm text-gray-700">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mobile-prescription-no"
                        name="mobile-prescription"
                        checked={localFilters.prescriptionRequired === false}
                        onChange={() => handlePrescriptionChange(false)}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <label htmlFor="mobile-prescription-no" className="ml-2 text-sm text-gray-700">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Availability</h4>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="mobile-in-stock"
                      checked={localFilters.inStock === true}
                      onChange={() => handleInStockChange(true)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="mobile-in-stock" className="ml-2 text-sm text-gray-700">
                      In Stock Only
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <motion.button
                    onClick={applyFilters}
                    className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Apply Filters
                  </motion.button>
                  <motion.button
                    onClick={resetFilters}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Reset
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block">{desktopSidebar}</div>

      {/* Mobile sidebar */}
      {mobileSidebar}
    </>
  )
}

export default FilterSidebar
