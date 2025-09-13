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
import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import DoctorAppointmentsDashboard from "./pages/Appointments/DoctorAppointments";
import PatientManagement from "./pages/Patient-Management";
import { ArticlesDashboard } from "./pages/Blog/ArticlesDashboard";
import PrescriptionDashboard from "./pages/Prescription/PrescriptionDashboard";
import { LabDashboard } from "./pages/Lab/LabDashboard";
import { ForumDashboard } from "./pages/Forum/ForumDashboard";
import JournalDashboard from "./pages/Journal/JournalDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/pharmacy/medicines" element={<MedicineListPage />} />
          <Route
            path="/pharmacy/medicines/:id"
            element={<MedicineDetailPage />}
          />
          <Route path="/pharmacy/cart" element={<CartPage />} />
          <Route path="/pharmacy/checkout" element={<CheckoutPage />} />
          <Route
            path="/pharmacy/order-confirmation/:orderId"
            element={<OrderConfirmationPage />}
          />
          <Route path="/appointments" element={<AppointmentBooking />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/lab" element={<LabManagement />} />
          <Route path="/profile" element={<PatientDashboard />} />
          <Route path="/dashboard" element={<DoctorDashboard />} />
          <Route
            path="/doctor/appointments"
            element={<DoctorAppointmentsDashboard />}
          />
          <Route
            path="/patient-management/:id"
            element={<PatientManagement />}
          />
          <Route path="/doctor/articles" element={<ArticlesDashboard />} />
          <Route
            path="/doctor/prescriptions/:patientId"
            element={<PrescriptionDashboard />}
          />
          <Route path="/lab-history/:patientId" element={<LabDashboard />} />
          <Route path="/doctor/forum" element={<ForumDashboard />} />
          <Route path="/doctor/journal" element={<JournalDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
