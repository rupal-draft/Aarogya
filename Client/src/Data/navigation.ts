interface NavItem {
    name: string
    url: string
    submenu?: NavItem[]
  }

  export const navItems: NavItem[] = [
    {
      name: "Home",
      url: "/",
      submenu: [
        { name: "Home One", url: "/" },
        { name: "Home Two", url: "/index-2" },
        { name: "Home Three", url: "/index-3" },
        { name: "Home Four", url: "/index-4" },
        { name: "Dental One", url: "/dental-1" },
        { name: "Dental Two", url: "/dental-2" },
        { name: "Blood Donation", url: "/blood-donation" },
        {
          name: "Header Versions",
          url: "#",
          submenu: [
            { name: "Header One", url: "/" },
            { name: "Header Two", url: "/index-2" },
            { name: "Header Three", url: "/index-3" },
            { name: "Header Four", url: "/dental-1" },
          ],
        },
      ],
    },
    {
      name: "Departments",
      url: "/services",
    },
    {
      name: "About",
      url: "/about-1",
      submenu: [
        { name: "About One", url: "/about-1" },
        { name: "About Two", url: "/about-2" },
        { name: "About Three", url: "/about-3" },
      ],
    },
    {
      name: "Pages",
      url: "#",
      submenu: [
        { name: "Team", url: "/doctors" },
        { name: "History", url: "/history-slide" },
        { name: "FAQ", url: "/faq" },
        { name: "Appointment", url: "/appointment" },
      ],
    },
    {
      name: "Shop",
      url: "/pharmacy",
      submenu: [
        { name: "Shop Page", url: "/pharmacy" },
        { name: "Medicine Details", url: "/medicine-details" },
        { name: "Cart Page", url: "/cart" },
        { name: "Checkout Page", url: "/checkout" },
      ],
    },
    {
      name: "Notice",
      url: "/notice",
    },
    {
      name: "Blog",
      url: "/blog",
      submenu: [
        { name: "Blog Style 01", url: "/blog-1" },
        { name: "Blog Style 02", url: "/blog-2" },
        { name: "Blog Details", url: "/blog-details" },
      ],
    },
    {
      name: "Contact",
      url: "/contact",
    },
  ]
