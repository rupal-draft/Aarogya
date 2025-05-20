import './assets/styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import AuthPage from './pages/Auth/Auth';
import MainLayout from './layout';
import BlogPage from './pages/Blog/BlogsPage';
import BlogDetailPage from './pages/Blog/BlogDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<AuthPage />} /></Route>
        <Route path='/blogs' element={<BlogPage />} />
        <Route path='/blogs/:id' element={<BlogDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
