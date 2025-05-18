export const footerLinks = {
    navigation: [
      { name: "Home", url: "/" },
      { name: "About Us", url: "/about" },
      { name: "Departments", url: "/departments" },
      { name: "Doctors", url: "/doctors" },
      { name: "Blog", url: "/blog" },
      { name: "Contact", url: "/contact" },
    ],
    quickLinks: [
      { name: "Get Appointment", url: "/appointment" },
      { name: "Our Doctor Team", url: "/doctors" },
      { name: "Departments Service", url: "/departments" },
      { name: "About Hospital", url: "/about" },
      { name: "Contact", url: "/contact" },
      { name: "Get Reports", url: "/reports" },
    ],
    departments: [
      { name: "Cardiology", url: "/departments/cardiology" },
      { name: "Pediatric", url: "/departments/pediatric" },
      { name: "Phychology", url: "/departments/phychology" },
      { name: "Dental", url: "/departments/dental" },
      { name: "Neurology", url: "/departments/neurology" },
      { name: "Orthopedics", url: "/departments/orthopedics" },
    ],
    emergency: [
      { name: "Appointment", url: "/appointment" },
      { name: "Doctors", url: "/doctors" },
      { name: "Cabins", url: "/cabins" },
      { name: "Treatments", url: "/treatments" },
      { name: "Surgery", url: "/surgery" },
      { name: "Consultancy", url: "/consultancy" },
    ],
  }

  export const contactInfo = {
    email: ["hello@clainc.com", "emergency@live.com"],
    phone: ["+1234 4567 7890", "+009 6612 3456 8"],
    address: ["1234 North Luke Lane,", "South Bend, IN 360001"],
  }

  export const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
          />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      url: "https://pinterest.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://youtube.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ]
