"use client"

import type React from "react"
import { useState } from "react"
import InputField from "../../common/Fields/InputField"

interface SignInProps {
  userType: "patient" | "doctor"
  setUserType: React.Dispatch<React.SetStateAction<"patient" | "doctor">>
}

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC<SignInProps> = ({ userType, setUserType }) => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Partial<SignInFormData>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof SignInFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<SignInFormData> = {}
    let isValid = true

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        console.log("Sign In Form Data:", { ...formData, userType, rememberMe })
        setIsLoading(false)
        // Here you would typically redirect to dashboard or show success message
        alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} signed in successfully!`)
      }, 1500)
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {userType === "patient" ? "Patient Sign In" : "Doctor Sign In"}
        <div className="h-1 w-20 bg-blue-500 mx-auto mt-2 rounded-full"></div>
      </h2>

      <div className="flex justify-center mb-8 animate-fadeIn">
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

      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn animation-delay-200">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M22.0367422,12 C22.0367422,11.3607602 21.9811382,10.7404063 21.8781318,10.1409114 L12,10.1409114 L12,14.1409114 L17.6436589,14.1409114 C17.3770773,15.4 16.5913705,16.4613439 15.4303928,17.1409114 L15.4303928,19.6409114 L18.642042,19.6409114 C20.5452532,17.8409114 22.0367422,15.2 22.0367422,12 Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M12,22.5 C14.9666667,22.5 17.4570978,21.5192661 19.2291667,19.6409114 L16.0175175,17.1409114 C15.0533073,17.8067663 13.7192439,18.2 12,18.2 C9.39561202,18.2 7.19368745,16.5192661 6.28394461,14.2 L3,14.2 L3,16.7590886 C4.75,20.1 8.11666667,22.5 12,22.5 Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.28394461,14.2 C6.10329369,13.6 6,12.9613439 6,12.3 C6,11.6386561 6.10329369,11 6.28394461,10.4 L6.28394461,7.84091136 L3,7.84091136 C2.35,9.17045455 2,10.6386561 2,12.3 C2,13.9613439 2.35,15.4295455 3,16.7590886 L6.28394461,14.2 Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M12,6.40909091 C13.4659369,6.40909091 14.7323855,6.9386561 15.7419053,7.89772727 L18.5984984,5.04090909 C17.1488485,3.69318182 14.9666667,2.5 12,2.5 C8.11666667,2.5 4.75,4.9 3,8.24090909 L6.28394461,10.8 C7.19368745,8.48073394 9.39561202,6.40909091 12,6.40909091 Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.1367422,2 C14.5367422,2 16.4367422,3.1 17.7367422,4.4 L15.5367422,6.6 C14.7367422,5.8 13.5367422,5.2 12.1367422,5.2 C9.23674219,5.2 6.93674219,7.6 6.93674219,10.4 C6.93674219,13.2 9.33674219,15.6 12.1367422,15.6 C14.0367422,15.6 15.5367422,14.7 16.3367422,13.3 L16.3367422,13.3 C16.5367422,13 16.6367422,12.6 16.6367422,12.2 L12.1367422,12.2 L12.1367422,9 L19.9367422,9 C20.0367422,9.4 20.1367422,9.8 20.1367422,10.4 C20.1367422,15.1 16.8367422,18.2 12.1367422,18.2 C7.93674219,18.2 4.33674219,14.6 4.33674219,10.4 C4.33674219,6.2 7.93674219,2 12.1367422,2 Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12,2 C6.4771525,2 2,6.4771525 2,12 C2,16.4183433 4.93545941,20.1598156 9,21.4098837 L9,15 L7,15 L7,12 L9,12 L9,9.79686111 C9,7.38583409 10.3123248,6 12.4862918,6 C13.5233333,6 14.0108299,6.08355044 14.3128904,6.15098561 L14.3128904,9 L12.9112748,9 C11.861392,9 11.7,9.41394778 11.7,10.2956135 L11.7,12 L14.3,12 L14.0428571,15 L11.7,15 L11.7,21.4536377 C16.4777827,20.9599419 20,16.9326756 20,12 C20,6.4771525 15.5228475,2 12,2 Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div> */}
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignIn
