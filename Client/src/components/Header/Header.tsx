
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { navItems } from "../../Data/navigation"
import Logo from "./../../assets/images/Logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "shadow-lg py-2" : "shadow-md py-4"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <motion.a
              href="/"
              className="text-2xl font-bold text-blue-600"
              whileHover={{ scale: 1.50 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={Logo} alt="Logo" className="h-12 w-auto" />
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <ul className="flex space-x-4">
              {navItems.map((item, index) => (
                <motion.li key={index} className="relative group" whileHover={{ y: -2 }}>
                  <a
                    href={item.url}
                    className={`px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors ${index === 0 ? "text-blue-600 font-medium" : ""}`}
                    onClick={
                      item.submenu
                        ? (e) => {
                            e.preventDefault()
                            toggleSubmenu(index)
                          }
                        : undefined
                    }
                  >
                    {item.name}
                    {item.submenu && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline-block ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </a>

                  {item.submenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block"
                    >
                      <div className="py-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <div key={subIndex}>
                            <motion.a
                              whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                              href={subItem.url}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                              {subItem.name}
                            </motion.a>

                            {subItem.submenu && (
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-full top-0 mt-0 w-48 bg-white rounded-md shadow-lg hidden group-hover:block"
                              >
                                <div className="py-1">
                                  {subItem.submenu.map((nestedItem, nestedIndex) => (
                                    <motion.a
                                      key={nestedIndex}
                                      whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                      href={nestedItem.url}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                      {nestedItem.name}
                                    </motion.a>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.li>
              ))}
            </ul>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/auth"
              className="ml-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              Login
            </motion.a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <ul className="py-2">
                {navItems.map((item, index) => (
                  <li key={index} className="relative">
                    <motion.a
                      whileTap={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                      href={item.url}
                      className={`block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                        index === 0 ? "text-blue-600 font-medium" : ""
                      }`}
                      onClick={
                        item.submenu
                          ? (e) => {
                              e.preventDefault()
                              toggleSubmenu(index)
                            }
                          : undefined
                      }
                    >
                      {item.name}
                      {item.submenu && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 inline-block ml-1 transition-transform duration-300 ${
                            activeSubmenu === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </motion.a>

                    <AnimatePresence>
                      {item.submenu && activeSubmenu === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-4 py-1 bg-gray-50"
                        >
                          {item.submenu.map((subItem, subIndex) => (
                            <div key={subIndex}>
                              <motion.a
                                whileTap={{ x: 5 }}
                                href={subItem.url}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                              >
                                {subItem.name}
                              </motion.a>

                              <AnimatePresence>
                                {subItem.submenu && activeSubmenu === index && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="pl-4 py-1 bg-gray-100"
                                  >
                                    {subItem.submenu.map((nestedItem, nestedIndex) => (
                                      <motion.a
                                        key={nestedIndex}
                                        whileTap={{ x: 5 }}
                                        href={nestedItem.url}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                      >
                                        {nestedItem.name}
                                      </motion.a>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
                <li>
                  <motion.a
                    whileTap={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                    href="/auth"
                    className="block px-4 py-2 text-blue-600 hover:text-blue-800"
                  >
                    Login
                  </motion.a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header
