import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  User,
  Users,
  Heart,
  Star,
  Sparkles,
  Shield,
  MessageCircle,
  Car,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  PhoneCall,
} from "lucide-react";

// Type definitions
interface EmergencyContact {
  id: string;
  patientId: string;
  contactName: string;
  relationship: string;
  phoneNumber: string;
  secondaryPhone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  relationshipBadgeColor: string;
  contactInfo: string;
  hasCompleteInfo: boolean;
  active: boolean;
  fullName: string;
  primary: boolean;
  primaryPhone: string;
}

interface EmergencyContactsTabProps {
  contactsData: EmergencyContact[];
}

// Helper function to get relationship icon
const getRelationshipIcon = (relationship: string) => {
  switch (relationship) {
    case "Mother":
    case "Father":
      return <User className="h-5 w-5" />;
    case "Sister":
    case "Brother":
      return <Users className="h-5 w-5" />;
    case "Spouse":
      return <Heart className="h-5 w-5" />;
    default:
      return <User className="h-5 w-5" />;
  }
};

// Helper function to get relationship color
const getRelationshipColor = (relationship: string) => {
  switch (relationship) {
    case "Mother":
    case "Father":
      return "bg-gradient-to-r from-blue-500 to-cyan-500";
    case "Sister":
    case "Brother":
      return "bg-gradient-to-r from-purple-500 to-indigo-500";
    case "Spouse":
      return "bg-gradient-to-r from-pink-500 to-rose-500";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-500";
  }
};

// Helper function to get priority color
const getPriorityColor = (primary: boolean) => {
  return primary
    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
    : "bg-gradient-to-r from-gray-400 to-slate-400 text-white";
};

const EmergencyContactsTab: React.FC<EmergencyContactsTabProps> = ({
  contactsData,
}) => {
  const [filter, setFilter] = useState<"all" | "primary" | "family">("all");
  const [sortBy, setSortBy] = useState<"relationship" | "name">("relationship");
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<{
    id: string;
    field: string;
  } | null>(null);

  // Calculate stats
  const stats = {
    totalContacts: contactsData.length,
    primaryContacts: contactsData.filter((c) => c.primary).length,
    familyContacts: contactsData.filter((c) =>
      ["Mother", "Father", "Sister", "Brother", "Spouse"].includes(
        c.relationship
      )
    ).length,
    completeInfoContacts: contactsData.filter((c) => c.hasCompleteInfo).length,
  };

  // Filter contacts based on selected filter
  const filteredContacts = contactsData.filter((contact) => {
    if (filter === "all") return true;
    if (filter === "primary") return contact.primary;
    if (filter === "family")
      return ["Mother", "Father", "Sister", "Brother", "Spouse"].includes(
        contact.relationship
      );
    return true;
  });

  // Sort contacts based on selected sort option
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy === "relationship") {
      return a.relationship.localeCompare(b.relationship);
    } else if (sortBy === "name") {
      return a.contactName.localeCompare(b.contactName);
    }
    return 0;
  });

  // Copy to clipboard function
  const copyToClipboard = (text: string, id: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField({ id, field });
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const statVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: i * 0.1,
      },
    }),
  };

  const toggleExpand = (id: string) => {
    setExpandedContact(expandedContact === id ? null : id);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 min-h-screen">
      {/* Animated background elements */}
      <div className="fixed top-0 right-0 -z-10">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity },
          }}
          className="bg-gradient-to-r from-green-200 to-teal-200 opacity-20 rounded-full w-96 h-96 blur-xl"
        />
      </div>

      <div className="fixed bottom-0 left-0 -z-10">
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 7, repeat: Infinity },
          }}
          className="bg-gradient-to-r from-emerald-200 to-cyan-200 opacity-20 rounded-full w-80 h-80 blur-xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
          <Sparkles className="h-5 w-5" />
          <h1 className="text-3xl font-bold">Emergency Contacts</h1>
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="text-green-700 font-medium">
          Your trusted network for emergency situations
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Contacts",
            value: stats.totalContacts,
            icon: <Users className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-green-500 to-teal-500",
            custom: 0,
          },
          {
            title: "Primary Contacts",
            value: stats.primaryContacts,
            icon: <Star className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-amber-500 to-orange-500",
            custom: 1,
          },
          {
            title: "Family Members",
            value: stats.familyContacts,
            icon: <Heart className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-pink-500 to-rose-500",
            custom: 2,
          },
          {
            title: "Complete Profiles",
            value: stats.completeInfoContacts,
            icon: <Shield className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
            custom: 3,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            className={`rounded-2xl p-5 text-white shadow-lg ${stat.bg} overflow-hidden relative`}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            custom={stat.custom}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Animated sparkles */}
            <motion.div
              className="absolute top-2 right-2"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <Star className="h-4 w-4 text-yellow-200" fill="currentColor" />
            </motion.div>

            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-xl mr-4 backdrop-blur-sm">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Sorting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md"
      >
        <div className="flex flex-wrap gap-2">
          {[
            {
              key: "all",
              label: "All Contacts",
              color: "bg-gradient-to-r from-green-500 to-teal-500",
            },
            {
              key: "primary",
              label: "Primary",
              color: "bg-gradient-to-r from-amber-500 to-orange-500",
            },
            {
              key: "family",
              label: "Family",
              color: "bg-gradient-to-r from-pink-500 to-rose-500",
            },
          ].map((btn) => (
            <motion.button
              key={btn.key}
              onClick={() => setFilter(btn.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium text-white shadow-md ${
                filter === btn.key
                  ? btn.color
                  : "bg-gradient-to-r from-gray-400 to-slate-400"
              }`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-sm">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="bg-transparent py-1 text-sm focus:outline-none focus:ring-0"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "relationship" | "name")
            }
          >
            <option value="relationship">Relationship</option>
            <option value="name">Name</option>
          </select>
        </div>
      </motion.div>

      {/* Contacts Grid Layout */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {sortedContacts.map((contact) => (
            <motion.div
              key={contact.id}
              variants={itemVariants}
              layout
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 relative"
            >
              {/* Primary contact crown */}
              {contact.primary && (
                <motion.div
                  className="absolute -top-2 -right-2 z-10"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute top-2 right-3 bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg shadow-md">
                    Primary
                  </div>
                </motion.div>
              )}

              <div className="p-6">
                {/* Contact Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-full ${getRelationshipColor(
                        contact.relationship
                      )} text-white shadow-md`}
                    >
                      {getRelationshipIcon(contact.relationship)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {contact.contactName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          contact.primary
                        )} shadow-sm mt-1`}
                      >
                        {contact.relationship}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mb-4">
                  <motion.a
                    href={`tel:${contact.phoneNumber}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Call
                  </motion.a>
                  <motion.a
                    href={`sms:${contact.phoneNumber}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    SMS
                  </motion.a>
                </div>

                {/* Basic Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{contact.phoneNumber}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        copyToClipboard(
                          contact.phoneNumber,
                          contact.id,
                          "phone"
                        )
                      }
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <Copy className="h-3 w-3" />
                    </motion.button>
                    {copiedField?.id === contact.id &&
                      copiedField?.field === "phone" && (
                        <span className="ml-2 text-xs text-green-600">
                          Copied!
                        </span>
                      )}
                  </div>

                  {contact.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{contact.email}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          copyToClipboard(contact.email, contact.id, "email")
                        }
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <Copy className="h-3 w-3" />
                      </motion.button>
                      {copiedField?.id === contact.id &&
                        copiedField?.field === "email" && (
                          <span className="ml-2 text-xs text-green-600">
                            Copied!
                          </span>
                        )}
                    </div>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleExpand(contact.id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 py-2"
                >
                  {expandedContact === contact.id ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      View Details
                    </>
                  )}
                </motion.button>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedContact === contact.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-100 space-y-3"
                    >
                      {/* Secondary Phone */}
                      {contact.secondaryPhone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            Alt: {contact.secondaryPhone}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              copyToClipboard(
                                contact.secondaryPhone,
                                contact.id,
                                "secondaryPhone"
                              )
                            }
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <Copy className="h-3 w-3" />
                          </motion.button>
                        </div>
                      )}

                      {/* Address */}
                      {contact.address && (
                        <div className="flex items-start text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{contact.address}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              copyToClipboard(
                                contact.address,
                                contact.id,
                                "address"
                              )
                            }
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <Copy className="h-3 w-3" />
                          </motion.button>
                        </div>
                      )}

                      {/* Notes */}
                      {contact.notes && (
                        <div className="bg-amber-50 rounded-lg p-3">
                          <h4 className="font-semibold text-amber-800 text-sm mb-1">
                            Notes:
                          </h4>
                          <p className="text-amber-700 text-sm">
                            {contact.notes}
                          </p>
                        </div>
                      )}

                      {/* Special Indicators */}
                      {contact.notes?.toLowerCase().includes("car") && (
                        <div className="flex items-center text-blue-600 text-sm">
                          <Car className="h-4 w-4 mr-2" />
                          Has transportation available
                        </div>
                      )}

                      {contact.notes?.toLowerCase().includes("urgent") && (
                        <div className="flex items-center text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Prefers urgent calls only
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {sortedContacts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border-0 mt-6 col-span-full"
        >
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No contacts found
          </h3>
          <p className="text-gray-500">
            Try changing your filters or add new contacts
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EmergencyContactsTab;
