"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MedicineResponseDTO } from "../../../types/medicine"
import { searchMedicinesFromPrescription } from "../../../Services/medicineService"

interface PrescriptionUploadProps {
  onUploadSuccess: (medicines: MedicineResponseDTO[]) => void
  onUploadStart: () => void
  onUploadError: (error: string) => void
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onUploadSuccess, onUploadStart, onUploadError }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf", "text/plain"]

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0]
        handleFileSelection(droppedFile)
      }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0]
        handleFileSelection(selectedFile)
      }
    }

    const handleFileSelection = (selectedFile: File) => {
      if (!allowedFileTypes.includes(selectedFile.type)) {
        onUploadError("Please upload an image (JPEG, PNG), PDF, or text file.")
        return
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        onUploadError("File size exceeds 5MB limit.")
        return
      }

      setFile(selectedFile)
    }

    const handleUpload = async () => {
      if (!file) return

      try {
        setUploading(true)
        onUploadStart()

        const medicines = await searchMedicinesFromPrescription(file)
        onUploadSuccess(medicines)

        // Reset file after successful upload
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        console.error("Error uploading prescription:", error)
        onUploadError("Failed to process prescription. Please try again.")
      } finally {
        setUploading(false)
      }
    }

    const triggerFileInput = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    }

    const pulseAnimation = {
      scale: [1, 1.02, 1],
      boxShadow: ["0 4px 6px rgba(0, 0, 0, 0.1)", "0 10px 15px rgba(0, 0, 0, 0.2)", "0 4px 6px rgba(0, 0, 0, 0.1)"],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
      >
        {/* Decorative header with prescription illustration */}
        <div className="relative h-40 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: Math.random() * 20 + 5,
                  height: Math.random() * 20 + 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                  />
                  <motion.path
                    d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1, delay: 0.5 }}
                  />
                  <motion.path
                    d="M9 12H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2, delay: 1 }}
                  />
                  <motion.path
                    d="M9 16H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2, delay: 1.5 }}
                  />
                </svg>
              </motion.div>
              <motion.h3
                className="text-white font-bold text-xl mt-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Upload Prescription
              </motion.h3>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="p-5">
          <motion.p className="text-sm text-gray-500 mb-4" variants={itemVariants}>
            Upload your prescription to get personalized medicine recommendations instantly
          </motion.p>

          <motion.div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-purple-500 bg-purple-50"
                : file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            animate={isDragging ? pulseAnimation : {}}
            variants={itemVariants}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.txt"
            />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-2"
                >
                  <motion.div
                    className="flex items-center justify-center mb-2"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="bg-green-100 text-green-800 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </motion.div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">File Selected</h4>
                  <p className="text-xs text-gray-600 truncate max-w-full">{file.name}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-2"
                >
                  <motion.div
                    className="flex justify-center mb-2"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </motion.div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Drop prescription here</h4>
                  <p className="text-xs text-gray-500">JPG, PNG, PDF, TXT (max 5MB)</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="mt-4">
            <motion.button
              onClick={handleUpload}
              className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
                file && !uploading
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              whileHover={file && !uploading ? { scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" } : {}}
              whileTap={file && !uploading ? { scale: 0.98 } : {}}
              disabled={!file || uploading}
              variants={itemVariants}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Find Medicines"
              )}
            </motion.button>
          </div>

          {/* Additional information */}
          <motion.div className="mt-4 bg-purple-50 rounded-lg p-3 border border-purple-100" variants={itemVariants}>
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-purple-700">
                Your prescription will be analyzed to find the exact medicines you need. We ensure complete privacy and
                security of your medical information.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }


export default PrescriptionUpload
