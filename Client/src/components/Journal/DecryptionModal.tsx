import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Key,
  AlertTriangle,
  Shield,
  Edit,
} from "lucide-react";
import { journalService } from "../../Services/journalService";
import type { JournalEntryResponse } from "../../types/journal";

interface DecryptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId: string;
  onDecryptionSuccess: (entry: JournalEntryResponse) => void;
  purpose: "viewing" | "editing";
}

export const DecryptionModal: React.FC<DecryptionModalProps> = ({
  isOpen,
  onClose,
  entryId,
  onDecryptionSuccess,
  purpose,
}) => {
  const [encryptionKey, setEncryptionKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleDecrypt = async () => {
    if (!encryptionKey.trim()) {
      setError("Please enter encryption key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const entryData = await journalService.getEntry(entryId, encryptionKey);
      onDecryptionSuccess(entryData);
    } catch (err: any) {
      setError("Invalid encryption key or unable to decrypt entry");
      console.error("Error decrypting entry:", err);
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.8 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {purpose === "editing"
                      ? "Decrypt to Edit"
                      : "Decrypt Entry"}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Enter encryption key to continue
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                {purpose === "editing" ? (
                  <Edit className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔒 Encrypted Entry
              </h3>
              <p className="text-gray-600 text-sm">
                {purpose === "editing"
                  ? "This entry is encrypted. Please enter your encryption key to edit it."
                  : "This entry is protected with encryption. Please enter your encryption key to view it."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showKey ? "text" : "password"}
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  placeholder="Enter your encryption key..."
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === "Enter" && handleDecrypt()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDecrypt}
                disabled={loading || !encryptionKey.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    {purpose === "editing"
                      ? "Decrypt and Edit"
                      : "Decrypt Entry"}
                  </>
                )}
              </motion.button>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-blue-700 text-xs">
                  Your encryption key is never stored on our servers
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DecryptionModal;
