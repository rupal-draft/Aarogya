// components/Unauthorized/Unauthorized.tsx
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/Redux/useAuth";

const Unauthorized: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const attemptedPath = location.pathname;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6"
        >
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>

        <p className="text-lg text-gray-600 mb-4">
          You don't have permission to access{" "}
          <span className="font-mono bg-gray-100 p-1 rounded">
            {attemptedPath}
          </span>
          .
        </p>

        <p className="text-gray-500 mb-8">
          {isAuthenticated
            ? "Please contact support if you believe this is an error."
            : "You need to be logged in to access this page."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </Link>

          {!isAuthenticated && (
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Unauthorized;
