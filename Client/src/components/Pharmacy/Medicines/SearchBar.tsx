"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MedicineResponseDTO } from "../../../types/medicine"
import { searchMedicines } from "../../../Services/medicineService"


interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<MedicineResponseDTO[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsSearching(true)
      try {
        const data = await searchMedicines(query)
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: MedicineResponseDTO) => {
    setQuery(suggestion.name)
    onSearch(suggestion.name)
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder="Search medicines..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className={`w-5 h-5 ${isSearching ? "text-teal-500 animate-pulse" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Search suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          >
            <ul className="py-1">
              {suggestions.map((suggestion) => (
                <motion.li
                  key={suggestion.id}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 cursor-pointer flex items-center"
                >
                  <div className="w-10 h-10 flex-shrink-0 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
                    {suggestion.images && suggestion.images.length > 0 ? (
                      <img
                        src={suggestion.images[0] || "/placeholder.svg"}
                        alt={suggestion.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{suggestion.name}</p>
                    <p className="text-xs text-gray-500">{suggestion.manufacturer}</p>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-semibold text-teal-600">${Number(suggestion.price).toFixed(2)}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
