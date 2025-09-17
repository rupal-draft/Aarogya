// Data/navigation.ts
// Doctor navigation items
export const doctorNavItems = [
  { name: "Dashboard", url: "/dashboard", icon: "dashboard" },
  { name: "Appointments", url: "/doctor/appointments", icon: "calendar" },
  { name: "Patients", url: "/patient-management", icon: "medical-services" },
  { name: "Articles", url: "/doctor/articles", icon: "edit" },
  { name: "Forum", url: "/doctor/forum", icon: "info" },
  { name: "Journal", url: "/doctor/journal", icon: "edit" },
  { name: "Availability", url: "/doctor/availability", icon: "calendar" },
];

// Patient navigation items
export const patientNavItems = [
  { name: "Home", url: "/", icon: "home" },
  { name: "Appointments", url: "/appointment", icon: "calendar" },
  { name: "Pharmacy", url: "/pharmacy/medicines", icon: "shopping-bag" },
  { name: "Lab", url: "/lab", icon: "virus" },
  { name: "Blogs", url: "/blogs", icon: "edit" },
  { name: "Assistant", url: "/assistant", icon: "shield" },
  { name: "Profile", url: "/profile", icon: "user" },
];

// Public navigation items (when not logged in)
export const publicNavItems = [
  { name: "Home", url: "/", icon: "home" },
  { name: "Services", url: "/#services", icon: "medical-services" },
  { name: "Health Blog", url: "/blogs", icon: "edit" },
  { name: "Contact", url: "/#contact", icon: "phone" },
];
