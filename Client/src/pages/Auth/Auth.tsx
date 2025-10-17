import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PatientSignup from "../../components/Signup/PatientSignup";
import DoctorSignup from "../../components/Signup/DoctorSignup";
import SignIn from "../../components/Signin/Signin";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ForgotPassword from "../../components/Forgot-Password/ForgotPassword";
import ResetPassword from "../../components/Reset-Password/ResetPassword";
import { useAuth } from "../../hooks/Redux/useAuth";

interface AuthPagesProps {
  initialPage?: "signup" | "signin" | "forgot" | "reset";
}

const Auth: React.FC<AuthPagesProps> = ({ initialPage = "signin" }) => {
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [page, setPage] = useState<"signup" | "signin" | "forgot" | "reset">(
    initialPage
  );
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userType: authUserType } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from =
        location.state?.from?.pathname ||
        (authUserType === "doctor" ? "/dashboard" : "/profile");

      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authUserType, navigate, location]);

  useEffect(() => {
    if (location.pathname === "/forgot-password") {
      setPage("forgot");
    } else if (location.pathname === "/reset-password") {
      setPage("reset");
    }
  }, [location]);

  const navigateToPage = (
    newPage: "signup" | "signin" | "forgot" | "reset",
    params?: Record<string, string>
  ) => {
    setPage(newPage);

    let path = "/auth";
    if (newPage === "forgot") {
      path = "/auth/forgot-password";
    } else if (newPage === "reset") {
      path = "/auth/reset-password";
    }

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      path += `?${searchParams.toString()}`;
    }

    navigate(path);
  };

  // Floating medical icons data
  const floatingIcons = [
    { icon: "🩺", delay: 0, size: 32 },
    { icon: "💊", delay: 1, size: 28 },
    { icon: "🧬", delay: 2, size: 36 },
    { icon: "🫀", delay: 3, size: 34 },
    { icon: "🧠", delay: 4, size: 30 },
    { icon: "🦴", delay: 5, size: 26 },
    { icon: "👁️", delay: 6, size: 24 },
    { icon: "🦷", delay: 7, size: 22 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-400/20 to-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-cyan-400/20 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Floating Medical Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-blue-300/20 pointer-events-none"
            style={{
              fontSize: item.size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50"
      >
        {/* Left side - Enhanced Animated background and branding */}
        <div className="lg:w-1/2 relative overflow-hidden">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700">
            {/* Pulse Circles */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/20 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-white/15 rounded-full"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            {/* Floating Elements */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/10 rounded-full"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white/10 rounded-full"
              animate={{
                y: [0, 15, 0],
                x: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />

            {/* Enhanced EKG Line */}
            <div className="absolute bottom-10 left-0 right-0">
              <svg
                viewBox="0 0 600 100"
                preserveAspectRatio="none"
                className="w-full h-20"
              >
                <motion.path
                  className="ekg-path"
                  d="M0,50 L100,50 L120,30 L140,70 L160,50 L180,50 L200,10 L220,90 L240,30 L260,50 L280,50 L300,50 L320,30 L340,70 L360,50 L380,50 L400,10 L420,90 L440,30 L460,50 L480,50 L500,50 L520,30 L540,70 L560,50 L580,50 L600,50"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 1,
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Content overlay */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                  Aarogya
                </h1>
                <motion.p
                  className="text-blue-100 text-xl mb-8 font-light"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Care. Cure. Comfort
                </motion.p>
              </motion.div>

              <motion.div
                className="grid grid-cols-3 gap-4 mb-8"
                variants={itemVariants}
              >
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
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
                    ),
                    text: "Secure",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    text: "Fast",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    ),
                    text: "Organized",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30 text-center"
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      backgroundColor: "rgba(255,255,255,0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                    <p className="text-white mt-2 text-sm font-medium">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-px bg-blue-200/50 flex-grow mr-4"></div>
                <span className="text-blue-100 text-sm font-medium">
                  Trusted by thousands
                </span>
                <div className="h-px bg-blue-200/50 flex-grow ml-4"></div>
              </div>

              <div className="flex -space-x-3">
                {[
                  "https://images.pexels.com/photos/8942502/pexels-photo-8942502.jpeg",
                  "https://images.pexels.com/photos/8430302/pexels-photo-8430302.jpeg",
                  "https://images.pexels.com/photos/8430307/pexels-photo-8430307.jpeg",
                  "https://images.pexels.com/photos/7176126/pexels-photo-7176126.jpeg",
                ].map((src, index) => (
                  <motion.img
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                    src={src}
                    alt="User"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                  />
                ))}
                <motion.div
                  className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4 }}
                  whileHover={{ scale: 1.1 }}
                >
                  +2k
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Enhanced Form Section */}
        <div className="lg:w-1/2 p-8 relative">
          {/* Background decoration */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-200/20 rounded-full blur-xl"></div>

          {/* Navigation Tabs */}
          {page !== "reset" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mb-8"
            >
              <div
                className="inline-flex rounded-xl shadow-lg bg-white/50 backdrop-blur-sm border border-white/50 p-1"
                role="group"
              >
                {[
                  { key: "signup", label: "Sign Up" },
                  { key: "signin", label: "Sign In" },
                  ...(page === "forgot"
                    ? [{ key: "forgot", label: "Forgot Password" }]
                    : []),
                ].map((tab, index) => (
                  <motion.button
                    key={tab.key}
                    type="button"
                    onClick={() => navigateToPage(tab.key as any)}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative ${
                      page === tab.key
                        ? "text-white"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page === tab.key && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* User Type Selection */}
          {(page === "signup" || page === "signin" || page === "forgot") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div
                className="inline-flex rounded-xl shadow-lg bg-white/50 backdrop-blur-sm border border-white/50 p-1"
                role="group"
              >
                {[
                  { key: "patient", label: "Patient", icon: "👤" },
                  { key: "doctor", label: "Doctor", icon: "🩺" },
                ].map((type) => (
                  <motion.button
                    key={type.key}
                    type="button"
                    onClick={() => setUserType(type.key as any)}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative flex items-center gap-2 ${
                      userType === type.key
                        ? "text-white"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setIsHovered(type.key)}
                    onHoverEnd={() => setIsHovered(null)}
                  >
                    {userType === type.key && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg"
                        layoutId="activeUserType"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 text-lg">{type.icon}</span>
                    <span className="relative z-10">{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Form Content */}
          <motion.div
            key={page + userType}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <AnimatePresence mode="wait">
              {page === "signup" &&
                (userType === "patient" ? <PatientSignup /> : <DoctorSignup />)}
              {page === "signin" && (
                <SignIn
                  userType={userType}
                  setUserType={setUserType}
                  onForgotPassword={() => navigateToPage("forgot")}
                />
              )}
              {page === "forgot" && (
                <ForgotPassword
                  userType={userType}
                  onSendOTP={(email) => navigateToPage("reset", { email })}
                />
              )}
              {page === "reset" && (
                <ResetPassword onSuccess={() => navigateToPage("signin")} />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default function AuthPage() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/forgot-password" element={<Auth initialPage="forgot" />} />
      <Route path="/reset-password" element={<Auth initialPage="reset" />} />
    </Routes>
  );
}
