import { contactInfo, footerLinks, socialLinks } from "../../Data/footer"
import Logo from "./../../assets/images/Logo.png"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Section */}
      <div className="py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Navigation</h3>
              <ul className="space-y-2">
                {footerLinks.navigation.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
              <ul className="space-y-2">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Departments</h3>
              <ul className="space-y-2">
                {footerLinks.departments.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Emergency</h3>
              <ul className="space-y-2">
                {footerLinks.emergency.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Follow Us</h3>
              <div className="flex space-x-3 mb-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="bg-gray-800 hover:bg-blue-600 transition-colors w-10 h-10 rounded-full flex items-center justify-center"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              <form className="mt-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Subscribe Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Logo and About */}
            <div className="lg:w-1/3 mb-6 lg:mb-0 text-center lg:text-left">
              <a href="/" className="inline-block mb-4">
                <img src={Logo} alt="Logo" className="h-12 w-auto" />
              </a>
              <p className="text-gray-400 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
              <a href="https://maps.google.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                View on google map
              </a>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:w-2/3">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Email</h3>
                <ul className="space-y-1">
                  {contactInfo.email.map((item, index) => (
                    <li key={index} className="text-gray-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Phone</h3>
                <ul className="space-y-1">
                  {contactInfo.phone.map((item, index) => (
                    <li key={index} className="text-gray-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Address</h3>
                <ul className="space-y-1">
                  {contactInfo.address.map((item, index) => (
                    <li key={index} className="text-gray-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Clainc | All Right Reserved</p>
            <ul className="flex space-x-6">
              <li>
                <a href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                  Privacy and Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-500 hover:text-white transition-colors">
                  Terms and Services
                </a>
              </li>
              <li>
                <a href="/developers" className="text-gray-500 hover:text-white transition-colors">
                  Developers
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
