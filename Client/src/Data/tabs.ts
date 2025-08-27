import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  FileText,
  Home,
  Pill,
  Stethoscope,
  Target,
  Users,
} from "lucide-react";

export const tabs = [
  {
    id: "mission",
    title: "Mission",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid- idunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    additionalContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLink: "#",
  },
  {
    id: "vision",
    title: "Vision",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid- idunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    additionalContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLink: "#",
  },
  {
    id: "success",
    title: "Success",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid- idunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    additionalContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLink: "#",
  },
  {
    id: "history",
    title: "History",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid- idunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
    additionalContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLink: "#",
  },
];

export const DashboardTabs = [
  { id: "overview", label: "Overview", icon: Home, count: undefined },
  {
    id: "diseases",
    label: "Disease History",
    icon: FileText,
    count: undefined,
  },
  { id: "history", label: "Medical History", icon: FileText, count: undefined }, // Added medical history tab
  {
    id: "allergies",
    label: "Allergies",
    icon: AlertTriangle,
    count: undefined,
  },
  { id: "medications", label: "Medications", icon: Pill, count: undefined },
  { id: "vitals", label: "Vitals", icon: Activity, count: undefined },
  { id: "symptoms", label: "Symptoms", icon: Brain, count: undefined },
  { id: "goals", label: "Health Goals", icon: Target, count: undefined },
  {
    id: "contacts",
    label: "Emergency Contacts",
    icon: Users,
    count: undefined,
  },
  { id: "notes", label: "Doctor Notes", icon: Stethoscope, count: undefined },
  { id: "analytics", label: "Analytics", icon: BarChart3, count: undefined },
];
