"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import {
  doctorNavItems,
  patientNavItems,
  publicNavItems,
} from "../../Data/navigation";
import { useAuth } from "../../hooks/Redux/useAuth";
import { useCart } from "../../context/Cart/CartContext";
import {
  Bell,
  Heart,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Star,
  User,
  X,
} from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, userType, profileImage, userName, handleLogout } =
    useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { cart } = useCart();

  const itemCount = cart?.totalItems || 0;
  const navItems = isAuthenticated
    ? userType === "doctor"
      ? doctorNavItems
      : patientNavItems
    : publicNavItems;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Icon mapping function
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dashboard":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "star":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        );
      case "edit":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );
      case "virus":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        );
      case "shopping-bag":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        );
      case "pill":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "shield":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "utensils":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "home":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "medical-services":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
        );
      case "phone":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Enhanced Cart Icon Component
  const CartIconComponent = () => (
    <Link to="/pharmacy/cart" className="relative group">
      <motion.div
        className="relative p-3 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 hover:from-teal-100 hover:to-emerald-100 hover:border-teal-200 transition-all duration-300 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={itemCount > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{
            duration: 0.5,
            repeat: itemCount > 0 ? Number.POSITIVE_INFINITY : 0,
            repeatDelay: 3,
          }}
        >
          <ShoppingCart className="h-6 w-6 text-teal-600" />
        </motion.div>

        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              key="badge"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg border-2 border-white"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse effect when items are added */}
        {itemCount > 0 && (
          <motion.div
            className="absolute inset-0 bg-teal-400 rounded-2xl opacity-20"
            animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          />
        )}

        {/* Floating hearts animation */}
        <motion.div
          className="absolute -top-1 -right-1 text-pink-400"
          animate={{
            y: [-5, -15, -5],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 4,
          }}
        >
          <Heart className="h-3 w-3 fill-current" />
        </motion.div>
      </motion.div>
    </Link>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      className={`bg-white/95 backdrop-blur-lg sticky top-0 z-40 transition-all duration-300 border-b border-gray-100 ${
        scrolled ? "shadow-2xl py-2" : "shadow-lg py-4"
      }`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-teal-50/30"
          style={{
            backgroundSize: "400% 400%",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <motion.img
                    src={Logo}
                    alt="Logo"
                    className="h-14 w-auto relative z-10"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Glowing effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-lg opacity-20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>
                <div className="ml-3">
                  <motion.span
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-transparent bg-clip-text"
                    whileHover={{ scale: 1.05 }}
                  >
                    Aarogya
                  </motion.span>
                  <motion.div
                    className="text-xs text-gray-500 font-medium tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Healthcare Excellence
                  </motion.div>
                </div>
              </Link>

              {/* Floating notification dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Bell className="h-2 w-2 text-white" />
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <ul className="flex space-x-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={item.url}>
                    <motion.div
                      className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 relative group border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md"
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ y: 0 }}
                    >
                      <motion.span
                        className="mr-2 p-1 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {getIcon(item.icon)}
                      </motion.span>
                      <span className="font-medium">{item.name}</span>

                      {/* Animated underline */}
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 origin-left rounded-full"
                        transition={{ duration: 0.3 }}
                        whileHover={{ scaleX: 1 }}
                      />

                      {/* Floating sparkles */}
                      <motion.div
                        className="absolute -top-1 -right-1 text-yellow-400"
                        animate={{
                          rotate: [0, 360],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 5,
                        }}
                      >
                        <Star className="h-3 w-3 fill-current" />
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
            {/* Enhanced Cart Icon for Desktop */}
            {isAuthenticated && userType === "patient" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                className="ml-6"
              >
                <CartIconComponent />
              </motion.div>
            )}
            {/* Auth buttons or profile */}
            {isAuthenticated ? (
              <div className="relative ml-6">
                <motion.div
                  className="flex items-center cursor-pointer group"
                  onClick={toggleProfileMenu}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="relative w-12 h-12 rounded-2xl overflow-hidden border-3 border-gradient-to-r from-blue-400 to-purple-400 shadow-lg"
                    whileHover={{ borderColor: "#38bdf8" }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.4)",
                        "0 0 0 10px rgba(59, 130, 246, 0)",
                        "0 0 0 0 rgba(59, 130, 246, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <img
                      src={
                        profileImage || "/placeholder.svg?height=48&width=48"
                      }
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-transparent"
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />

                    {/* Online status indicator */}
                    <motion.div
                      className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  </motion.div>

                  <div className="ml-3">
                    <motion.span className="block font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {userName}
                    </motion.span>
                    <motion.span className="block text-sm text-gray-500 capitalize">
                      {userType}
                    </motion.span>
                  </div>

                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 text-gray-400 group-hover:text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: showProfileMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </motion.div>

                {/* Enhanced Profile dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-2 z-50 border border-gray-100"
                    >
                      {/* Profile header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              profileImage ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={userName}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {userName}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {userType}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link to="/profile">
                        <motion.div
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200"
                          whileHover={{ x: 5 }}
                        >
                          <div className="p-2 rounded-lg bg-blue-100 mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">Profile Settings</span>
                        </motion.div>
                      </Link>

                      <Link to="/settings">
                        <motion.div
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200"
                          whileHover={{ x: 5 }}
                        >
                          <div className="p-2 rounded-lg bg-purple-100 mr-3">
                            <Settings className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-medium">Account Settings</span>
                        </motion.div>
                      </Link>

                      <motion.div
                        className="border-t border-gray-100 my-2"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      <motion.button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                        whileHover={{ x: 5 }}
                      >
                        <div className="p-2 rounded-lg bg-red-100 mr-3">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center ml-6 space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth"
                    className="px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth/register"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Cart Icon for Mobile */}
            {isAuthenticated && userType === "patient" && <CartIconComponent />}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-700 focus:outline-none p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-6 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            >
              {isAuthenticated && (
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={
                          profileImage || "/placeholder.svg?height=48&width=48"
                        }
                        alt={userName}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {userName}
                      </p>
                      <p className="text-sm text-gray-600 capitalize bg-white/50 px-2 py-1 rounded-full">
                        {userType}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ul className="py-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link to={item.url}>
                      <motion.div
                        className="flex items-center px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
                        whileTap={{
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                        }}
                      >
                        <div className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mr-4">
                          {getIcon(item.icon)}
                        </div>
                        <span className="font-medium text-lg">{item.name}</span>
                      </motion.div>
                    </Link>
                  </motion.li>
                ))}

                {isAuthenticated ? (
                  <>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: navItems.length * 0.05,
                      }}
                    >
                      <Link to="/profile">
                        <motion.div
                          className="flex items-center px-6 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
                          whileTap={{
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                          }}
                        >
                          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 mr-4">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-lg">Profile</span>
                        </motion.div>
                      </Link>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: (navItems.length + 1) * 0.05,
                      }}
                    >
                      <motion.button
                        onClick={handleLogout}
                        className="flex w-full items-center px-6 py-4 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 border-l-4 border-transparent hover:border-red-400"
                        whileTap={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                      >
                        <div className="p-2 rounded-xl bg-gradient-to-br from-red-100 to-red-200 mr-4">
                          <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="font-medium text-lg">Sign Out</span>
                      </motion.button>
                    </motion.li>
                  </>
                ) : (
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: navItems.length * 0.05,
                    }}
                    className="px-6 py-4"
                  >
                    <div className="flex flex-col space-y-3">
                      <Link
                        to="/auth"
                        className="w-full py-3 text-center text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/register"
                        className="w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
                      >
                        Get Started
                      </Link>
                    </div>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
