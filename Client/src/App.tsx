import './assets/styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import AuthPage from './pages/Auth/Auth';
import MainLayout from './layout';
import BlogPage from './pages/Blog/BlogsPage';
import BlogDetailPage from './pages/Blog/BlogDetailPage';
import MedicineListPage from './pages/Pharmacy/Medicines/MedicineList';
import MedicineDetailPage from './pages/Pharmacy/Medicines/MedicineDetailPage';
import CartPage from './pages/Pharmacy/Cart/CartPage';
import CheckoutPage from './pages/Pharmacy/Order/CheckoutPage';
import OrderConfirmationPage from './pages/Pharmacy/Order/OrderConfirmationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<AuthPage />} /></Route>
        <Route path='/blogs' element={<BlogPage />} />
        <Route path='/blogs/:id' element={<BlogDetailPage />} />
        <Route path='/pharmacy/medicines' element={<MedicineListPage/>} />
        <Route path='/pharmacy/medicines/:id' element={<MedicineDetailPage/>} />
        <Route path="/pharmacy/cart" element={<CartPage />} />
          <Route path="/pharmacy/checkout" element={<CheckoutPage />} />
          <Route path="/pharmacy/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
