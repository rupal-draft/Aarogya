import './assets/styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import AuthPage from './pages/Auth/Auth';
import MainLayout from './layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<AuthPage />} /></Route>
      </Routes>
    </Router>
  );
}

export default App;
