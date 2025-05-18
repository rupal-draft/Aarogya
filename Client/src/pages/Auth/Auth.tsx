import React, { useState } from 'react';
import PatientSignup from '../../components/Signup/PatientSignup';
import DoctorSignup from '../../components/Signup/DoctorSignup';
import { motion } from "framer-motion"
import TopBar from '../../components/TopBar/TopBar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SignIn from '../../components/Signin/Signin';


const Auth: React.FC = () => {
    const [userType, setUserType] = useState<"patient" | "doctor">("patient")
    const [page, setPage] = useState<"signup" | "signin">("signup")

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Left side - Animated background and branding */}
          <div className="lg:w-1/2 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600">
              <div className="medical-animation">
                <div className="pulse-circle"></div>
                <div className="pulse-circle delay-1"></div>
                <div className="pulse-circle delay-2"></div>
                <div className="pulse-circle delay-3"></div>
                <div className="floating-pill pill-1"></div>
                <div className="floating-pill pill-2"></div>
                <div className="floating-cross"></div>
                <div className="floating-heart"></div>
                <div className="ekg-line">
                  <svg viewBox="0 0 600 100" preserveAspectRatio="none">
                    <path
                      className="ekg-path"
                      d="M0,50 L100,50 L120,30 L140,70 L160,50 L180,50 L200,10 L220,90 L240,30 L260,50 L280,50 L300,50 L320,30 L340,70 L360,50 L380,50 L400,10 L420,90 L440,30 L460,50 L480,50 L500,50 L520,30 L540,70 L560,50 L580,50 L600,50"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Content overlay */}
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 animate-slideInLeft">Aarogya</h1>
                <p className="text-blue-100 text-lg mb-8 animate-slideInLeft animation-delay-200">Care. Cure. Comfort</p>

                <div className="flex space-x-4 mb-8 animate-slideInLeft animation-delay-400">
                  <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-white mt-2">Secure</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-white mt-2">Fast</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-white mt-2">Organized</p>
                  </div>
                </div>
              </div>

              <div className="animate-pulse animation-delay-600">
                <div className="flex items-center mb-4">
                  <div className="h-px bg-blue-200 flex-grow mr-4"></div>
                  <span className="text-blue-100">Join thousands of users</span>
                  <div className="h-px bg-blue-200 flex-grow ml-4"></div>
                </div>

                <div className="flex -space-x-2">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.pexels.com/photos/4473796/pexels-photo-4473796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.pexels.com/photos/27086491/pexels-photo-27086491/free-photo-of-elderly-man-using-tablet-with-stylus-in-hand.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.pexels.com/photos/31485508/pexels-photo-31485508/free-photo-of-confident-woman-in-wheelchair-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="https://images.pexels.com/photos/7959603/pexels-photo-7959603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="User"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-400 flex items-center justify-center text-white text-xs">
                    +2k
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-1/2 p-8">
            <div className="flex justify-center mb-8 animate-fadeIn animation-delay-200">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setPage("signup")}
                  className={`px-6 py-3 text-sm font-medium ${
                    page === "signup" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  } border border-gray-200 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setPage("signin")}
                  className={`px-6 py-3 text-sm font-medium ${
                    page === "signin" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  } border border-gray-200 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                >
                  Sign In
                </button>
              </div>
            </div>

            {page === "signup" ? (
              <>
                <div className="flex justify-center mb-8 animate-fadeIn animation-delay-200">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setUserType("patient")}
                      className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                        userType === "patient" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                      } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("doctor")}
                      className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                        userType === "doctor" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                      } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Doctor
                    </button>
                  </div>
                </div>

                <div className="animate-fadeIn animation-delay-400">
                  {userType === "patient" ? <PatientSignup /> : <DoctorSignup />}
                </div>
              </>
            ) : (
              <div className="animate-fadeIn animation-delay-400">
                <SignIn userType={userType} setUserType={setUserType} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

export default function AuthPage() {
  return (
    <div className="page-wrapper overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <TopBar />
        <Header />
      <Auth /><Footer /></motion.div>
    </div>
  );
}
