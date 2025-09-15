// components/ProtectedRoute/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "./hooks/Redux/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("doctor" | "patient")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { isAuthenticated, userType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-500" />
        </motion.div>
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (
    allowedRoles.length > 0 &&
    (!userType || !allowedRoles.includes(userType))
  ) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = userType === "doctor" ? "/dashboard" : "/profile";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
