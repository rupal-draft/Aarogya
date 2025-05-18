"use client"

import { useState } from "react"

const TopBar = () => {
  const [language, setLanguage] = useState("En")

  return (
    <section className="bg-blue-600 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <ul className="flex flex-wrap gap-6">
            <li className="flex items-center">
              <a href="mailto:help@example.com" className="flex items-center hover:text-blue-200 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                help@example.com
              </a>
            </li>
            <li className="flex items-center">
              <a href="tel:123456789101" className="flex items-center hover:text-blue-200 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                1234 5678 9101
              </a>
            </li>
          </ul>

          <div className="flex items-center mt-2 md:mt-0">
            <select
              className="bg-blue-700 text-white border border-blue-500 rounded mr-4 px-2 py-1"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="En">En</option>
              <option value="Bn">Bn</option>
              <option value="Du">Du</option>
            </select>
            <a
              href="/appointment"
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition-colors"
            >
              Get Appointment
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopBar
