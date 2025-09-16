import "./assets/styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AuthPage from "./pages/Auth/Auth";
import MainLayout from "./layout";
import BlogPage from "./pages/Blog/BlogsPage";
import BlogDetailPage from "./pages/Blog/BlogDetailPage";
import MedicineListPage from "./pages/Pharmacy/Medicines/MedicineList";
import MedicineDetailPage from "./pages/Pharmacy/Medicines/MedicineDetailPage";
import CartPage from "./pages/Pharmacy/Cart/CartPage";
import CheckoutPage from "./pages/Pharmacy/Order/CheckoutPage";
import OrderConfirmationPage from "./pages/Pharmacy/Order/OrderConfirmationPage";
import AppointmentBooking from "./pages/Appointments/AppointmentBooking";
import Assistant from "./pages/AiAssistant";
import LabManagement from "./pages/Lab/LabManagement";
// import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import DoctorAppointmentsDashboard from "./pages/Appointments/DoctorAppointments";
import PatientManagement from "./pages/Patient-Management";
import { ArticlesDashboard } from "./pages/Blog/ArticlesDashboard";
import PrescriptionDashboard from "./pages/Prescription/PrescriptionDashboard";
import { LabDashboard } from "./pages/Lab/LabDashboard";
import { ForumDashboard } from "./pages/Forum/ForumDashboard";
import JournalDashboard from "./pages/Journal/JournalDashboard";
import AvailabilityDashboard from "./pages/Availability/AvailabilityDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import { PatientDashboard } from "./pages/Dashboard/PatientDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="*" element={<Unauthorized />} />

          {/* Global routes - accessible to everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />

          {/* Patient protected routes */}
          <Route
            path="/pharmacy/medicines"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MedicineListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/medicines/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MedicineDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/cart"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/checkout"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/order-confirmation/:orderId"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppointmentBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Assistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <LabManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorAppointmentsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-management/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <PatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/articles"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <ArticlesDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions/:patientId"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <PrescriptionDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab-history/:patientId"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <LabDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/forum"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <ForumDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/journal"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <JournalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/availability"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <AvailabilityDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
