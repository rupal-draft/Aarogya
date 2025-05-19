"use client"

import React from "react"
import Banner from "../../components/Home/Banner"
import AppointmentForm from "../../components/Home/AppointmentForm"
import AboutSection from "../../components/Home/AboutSection"
import ServiceSection from "../../components/Home/ServiceSection"
import FeatureSection from "../../components/Home/FeatureSection"
import WhyChooseUs from "../../components/Home/WhyChooseUs"
import TestimonialsSection from "../../components/Home/TestimonialsSection"
import BlogSection from "../../components/Home/BlogSection"

const Home = () => {
  return (
    <React.Fragment>
      <Banner />
      <AppointmentForm />
      <AboutSection />
      <ServiceSection />
      <FeatureSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <BlogSection />
    </React.Fragment>
  )
}

export default Home
