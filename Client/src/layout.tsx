import { motion } from "framer-motion"
import TopBar from "./components/TopBar/TopBar"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import ScrollToTop from "./components/Scroll/ScrollToTop"
import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import Preloader from "./components/Preloader/Preloader"




const MainLayout : React.FC = () => {


  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="page-wrapper overflow-hidden">
      {loading && <Preloader />}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <TopBar />
        <Header />
        <Outlet />
        <Footer />
        <ScrollToTop />
      </motion.div>
    </div>
  )
}

export default MainLayout
