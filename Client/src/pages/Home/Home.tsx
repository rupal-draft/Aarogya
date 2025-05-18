"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Preloader from "../../components/Preloader/Preloader"
import TopBar from "../../components/TopBar/TopBar"
import Header from "../../components/Header/Header"
import Banner from "../../components/Home/Banner"
import AppointmentForm from "../../components/Home/AppointmentForm"
import AboutSection from "../../components/Home/AboutSection"
import ServiceSection from "../../components/Home/ServiceSection"
import FeatureSection from "../../components/Home/FeatureSection"
import WhyChooseUs from "../../components/Home/WhyChooseUs"
import TestimonialsSection from "../../components/Home/TestimonialsSection"
import BlogSection from "../../components/Home/BlogSection"
import Footer from "../../components/Footer/Footer"
import ScrollToTop from "../../components/Scroll/ScrollToTop"

const Home = () => {
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
        <Banner />
        <AppointmentForm />
        <AboutSection />
        <ServiceSection />
        <FeatureSection />
        <WhyChooseUs />
        <TestimonialsSection />
        <BlogSection />
        <Footer />
        <ScrollToTop />
      </motion.div>
    </div>
  )
}

export default Home
