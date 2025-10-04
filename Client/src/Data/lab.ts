import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Package,
  XCircle,
} from "lucide-react";
import { OrderStatus } from "./enums/lab";

export const locations = [
  {
    value: "Home Collection",
    icon: "🏠",
    description: "Our technician will visit your location",
  },
  {
    value: "Main Lab - Downtown",
    icon: "🏢",
    description: "123 Main Street, Downtown",
  },
  {
    value: "Branch Lab - Uptown",
    icon: "🏥",
    description: "456 Uptown Avenue",
  },
  {
    value: "Hospital Lab - Central",
    icon: "🏨",
    description: "Central Hospital Campus",
  },
  {
    value: "Clinic Lab - Westside",
    icon: "⚕️",
    description: "Westside Medical Clinic",
  },
];

// Enhanced status color and icon functions for orders
export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return {
        gradient: "from-amber-400 to-orange-500",
        bg: "bg-amber-400",
        text: "text-amber-600",
        light: "bg-amber-50",
        border: "border-amber-200",
        glow: "from-amber-400/30 to-orange-500/30",
      };
    case OrderStatus.CONFIRMED:
      return {
        gradient: "from-sky-400 to-blue-500",
        bg: "bg-sky-400",
        text: "text-sky-600",
        light: "bg-sky-50",
        border: "border-sky-200",
        glow: "from-sky-400/30 to-blue-500/30",
      };
    case OrderStatus.SAMPLE_COLLECTED:
      return {
        gradient: "from-violet-400 to-purple-500",
        bg: "bg-violet-400",
        text: "text-violet-600",
        light: "bg-violet-50",
        border: "border-violet-200",
        glow: "from-violet-400/30 to-purple-500/30",
      };
    case OrderStatus.IN_PROGRESS:
      return {
        gradient: "from-indigo-400 to-blue-600",
        bg: "bg-indigo-400",
        text: "text-indigo-600",
        light: "bg-indigo-50",
        border: "border-indigo-200",
        glow: "from-indigo-400/30 to-blue-600/30",
      };
    case OrderStatus.COMPLETED:
      return {
        gradient: "from-emerald-400 to-green-500",
        bg: "bg-emerald-400",
        text: "text-emerald-600",
        light: "bg-emerald-50",
        border: "border-emerald-200",
        glow: "from-emerald-400/30 to-green-500/30",
      };
    case OrderStatus.CANCELLED:
      return {
        gradient: "from-rose-400 to-red-500",
        bg: "bg-rose-400",
        text: "text-rose-600",
        light: "bg-rose-50",
        border: "border-rose-200",
        glow: "from-rose-400/30 to-red-500/30",
      };
    default:
      return {
        gradient: "from-slate-400 to-gray-500",
        bg: "bg-slate-400",
        text: "text-slate-600",
        light: "bg-slate-50",
        border: "border-slate-200",
        glow: "from-slate-400/30 to-gray-500/30",
      };
  }
};

export const getOrderStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
      return { icon: Clock, color: "text-amber-500" };
    case OrderStatus.CONFIRMED:
      return { icon: CheckCircle, color: "text-sky-500" };
    case OrderStatus.SAMPLE_COLLECTED:
      return { icon: Package, color: "text-violet-500" };
    case OrderStatus.IN_PROGRESS:
      return { icon: Activity, color: "text-indigo-500" };
    case OrderStatus.COMPLETED:
      return { icon: CheckCircle, color: "text-emerald-500" };
    case OrderStatus.CANCELLED:
      return { icon: XCircle, color: "text-rose-500" };
    default:
      return { icon: Clock, color: "text-slate-500" };
  }
};

// Enhanced status color and icon functions for results
export const getResultStatusColor = (status: string) => {
  const colors = {
    NORMAL: {
      gradient: "from-emerald-400 to-green-500",
      bg: "bg-emerald-400",
      text: "text-emerald-600",
      light: "bg-emerald-50",
      border: "border-emerald-200",
      glow: "from-emerald-400/30 to-green-500/30",
    },
    ABNORMAL: {
      gradient: "from-amber-400 to-orange-500",
      bg: "bg-amber-400",
      text: "text-amber-600",
      light: "bg-amber-50",
      border: "border-amber-200",
      glow: "from-amber-400/30 to-orange-500/30",
    },
    CRITICAL: {
      gradient: "from-rose-400 to-red-500",
      bg: "bg-rose-400",
      text: "text-rose-600",
      light: "bg-rose-50",
      border: "border-rose-200",
      glow: "from-rose-400/30 to-red-500/30",
    },
    PENDING: {
      gradient: "from-amber-400 to-orange-500",
      bg: "bg-amber-400",
      text: "text-amber-600",
      light: "bg-amber-50",
      border: "border-amber-200",
      glow: "from-amber-400/30 to-orange-500/30",
    },
    COMPLETED: {
      gradient: "from-emerald-400 to-green-500",
      bg: "bg-emerald-400",
      text: "text-emerald-600",
      light: "bg-emerald-50",
      border: "border-emerald-200",
      glow: "from-emerald-400/30 to-green-500/30",
    },
  };
  return (
    colors[status as keyof typeof colors] || {
      gradient: "from-slate-400 to-gray-500",
      bg: "bg-slate-400",
      text: "text-slate-600",
      light: "bg-slate-50",
      border: "border-slate-200",
      glow: "from-slate-400/30 to-gray-500/30",
    }
  );
};

export const getResultStatusIcon = (status: string) => {
  const icons = {
    NORMAL: { icon: CheckCircle, color: "text-emerald-500" },
    ABNORMAL: { icon: AlertTriangle, color: "text-amber-500" },
    CRITICAL: { icon: AlertTriangle, color: "text-rose-500" },
    PENDING: { icon: Clock, color: "text-amber-500" },
    COMPLETED: { icon: CheckCircle, color: "text-emerald-500" },
  };
  return (
    icons[status as keyof typeof icons] || {
      icon: FileText,
      color: "text-slate-500",
    }
  );
};
