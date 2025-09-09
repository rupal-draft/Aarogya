"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  User,
  Calendar,
  FileText,
  Pill,
  TrendingUp,
  DollarSign,
  Star,
  MessageSquare,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Zap,
  BarChart3,
  CreditCard,
  TestTube,
  PenTool,
  ThumbsUp,
  Eye,
  Shield,
  PieChart,
  Activity,
  Crown,
  CalendarDays,
  Sparkles,
  TrendingUp as TrendingUpIcon,
  Stethoscope,
  ClipboardList,
  Tag,
  ChevronRight,
  Phone,
  MapPin,
  Mail,
  Badge,
  GraduationCap,
} from "lucide-react";
import type {
  DoctorDashboardData,
  RatingDashboardResponse,
} from "../../types/doctorDashboard";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter";
import { StatCard } from "../../components/Dashboard/Doctor/stats-card";
import { CategoryBadge } from "../../components/Dashboard/Doctor/CategoryBadge";
import { TagCloud } from "../../components/Dashboard/Doctor/TagCloud";
import { EnhancedLineChart } from "../../components/Dashboard/Doctor/EnhancedLineChart";
import { EnhancedBarChart } from "../../components/Dashboard/Doctor/EnhancedBarChart";
import { EnhancedAvailabilityCalendar } from "../../components/Dashboard/Doctor/EnhancedAvailabilityCalendar";
import { RatingStars } from "../../components/Dashboard/Doctor/RatingStars";

const DoctorDashboard = () => {
  const [data, setData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/api/v1/doctors/dashboard",
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Stethoscope className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-semibold text-gray-800"
          >
            Loading Dashboard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 mt-2"
          >
            Preparing your medical insights...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  const {
    doctorResponseDTO,
    appointmentStats,
    articleStats,
    labStats,
    paymentStats,
    prescriptionStats,
    quickViewResponse,
    forumDashboardResponse,
    journalDashboardResponse,
    ratingDashboardResponse,
  } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            animate={{
              x: [0, 100 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, 100 * (i % 3 === 0 ? 1 : -1), 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: `linear-gradient(45deg, ${
                i % 2 === 0 ? "#3b82f6" : "#6366f1"
              }, ${i % 3 === 0 ? "#8b5cf6" : "#ec4899"})`,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
        >
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <motion.img
                src={doctorResponseDTO.imageUrl}
                alt={`${doctorResponseDTO.firstName} ${doctorResponseDTO.lastName}`}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-2xl"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring" }}
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg"
              >
                <div className="w-4 h-4 bg-green-400 rounded-full" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h1
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Dr. {doctorResponseDTO.firstName} {doctorResponseDTO.lastName}
              </motion.h1>
              <motion.p
                className="text-blue-600 font-medium text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {doctorResponseDTO.specialization}
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="flex items-center gap-1">
                  <Badge className="w-4 h-4" />
                  {doctorResponseDTO.licenseNumber}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {doctorResponseDTO.experienceYears} years experience
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {doctorResponseDTO.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {doctorResponseDTO.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {doctorResponseDTO.address}
                </span>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg"
            >
              <User className="w-5 h-5" />
              <span className="font-semibold">
                <AnimatedCounter
                  value={appointmentStats.patientStatsDto.totalPatients}
                />{" "}
                Patients
              </span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg"
            >
              <Star className="w-5 h-5" />
              <span className="font-semibold">
                {ratingDashboardResponse.averageRating.toFixed(1)} Rating
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Dashboard Grid - Reorganized for better spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Appointment Stats - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 lg:col-span-2 xl:col-span-3"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Appointment Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                title="Today"
                value={appointmentStats.appointmentStatsDto.todayAppointments}
                icon={Calendar}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Upcoming"
                value={
                  appointmentStats.appointmentStatsDto.upcomingAppointments
                }
                icon={Clock}
                color="bg-gradient-to-r from-purple-500 to-indigo-500"
                animateValue={true}
              />
              <StatCard
                title="Completed"
                value={
                  appointmentStats.appointmentStatsDto.completedAppointments
                }
                icon={CheckCircle}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                animateValue={true}
              />
              <StatCard
                title="In Progress"
                value={
                  appointmentStats.appointmentStatsDto.inProgressAppointments
                }
                icon={Activity}
                color="bg-gradient-to-r from-yellow-500 to-amber-500"
                animateValue={true}
              />
              <StatCard
                title="Rejected"
                value={
                  appointmentStats.appointmentStatsDto.rejectedAppointments
                }
                icon={AlertCircle}
                color="bg-gradient-to-r from-red-500 to-rose-500"
                animateValue={true}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <StatCard
                title="Follow-up"
                value={
                  appointmentStats.appointmentStatsDto.followupAppointments
                }
                icon={Users}
                color="bg-gradient-to-r from-indigo-500 to-purple-500"
                animateValue={true}
              />
              <StatCard
                title="Emergency"
                value={
                  appointmentStats.appointmentStatsDto.emergencyAppointments
                }
                icon={AlertCircle}
                color="bg-gradient-to-r from-red-500 to-pink-500"
                animateValue={true}
              />
              <StatCard
                title="Overdue Follow-up"
                value={
                  appointmentStats.appointmentStatsDto
                    .overdueFollowupAppointments
                }
                icon={Clock}
                color="bg-gradient-to-r from-orange-500 to-amber-500"
                animateValue={true}
              />
              <StatCard
                title="Pending Follow-up"
                value={
                  appointmentStats.appointmentStatsDto
                    .pendingFollowupAppointments
                }
                icon={Clock}
                color="bg-gradient-to-r from-gray-500 to-slate-500"
                animateValue={true}
              />
            </div>
          </motion.div>

          {/* Patient Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              Patient Statistics
            </h2>
            <div className="space-y-4">
              <StatCard
                title="Total Patients"
                value={appointmentStats.patientStatsDto.totalPatients}
                icon={Users}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                animateValue={true}
              />
              <StatCard
                title="New This Month"
                value={appointmentStats.patientStatsDto.newPatientsThisMonth}
                icon={Zap}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Returning"
                value={appointmentStats.patientStatsDto.returningPatients}
                icon={Heart}
                color="bg-gradient-to-r from-purple-500 to-indigo-500"
                animateValue={true}
              />
            </div>
          </motion.div>

          {/* Article Stats - Expanded view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Articles & Content
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Articles"
                value={articleStats.totalArticles}
                icon={FileText}
                color="bg-gradient-to-r from-purple-500 to-indigo-500"
                animateValue={true}
              />
              <StatCard
                title="This Month"
                value={articleStats.articlesThisMonth}
                icon={TrendingUp}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Total Views"
                value={articleStats.viewsTrend[0]?.views || 0}
                icon={Eye}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                subtitle="This month"
                animateValue={true}
              />
              <StatCard
                title="Total Engagement"
                value={
                  articleStats.engagementStats.totalLikes +
                  articleStats.engagementStats.totalComments
                }
                icon={ThumbsUp}
                color="bg-gradient-to-r from-pink-500 to-rose-500"
                subtitle="Likes & Comments"
                animateValue={true}
              />
            </div>

            {/* Article Categories and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Categories */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Article Categories
                </h3>
                <div className="space-y-3">
                  {articleStats.categoryStats.map((category, index) => (
                    <CategoryBadge
                      key={index}
                      name={category.category}
                      count={category.count}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  Popular Tags
                </h3>
                <TagCloud tags={articleStats.tagStats.slice(0, 10)} />
                <div className="mt-4 text-xs text-gray-600">
                  {articleStats.tagStats.length} total tags
                </div>
              </div>
            </div>

            {/* Top Articles and Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Top Articles */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  Top Articles
                </h3>
                <div className="space-y-4">
                  {articleStats.topArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 group hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views} views
                          </p>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-green-600" />
                  Engagement Analytics
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-800">
                        <AnimatedCounter
                          value={articleStats.engagementStats.totalLikes}
                        />
                      </div>
                      <div className="text-sm text-green-600">Total Likes</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-800">
                        <AnimatedCounter
                          value={articleStats.engagementStats.totalComments}
                        />
                      </div>
                      <div className="text-sm text-blue-600">
                        Total Comments
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                      Engagement Trend
                    </h4>
                    <EnhancedLineChart
                      data={articleStats.engagementTrend.map((trend) => ({
                        label: `${trend.month}/${trend.year}`,
                        value: trend.totalViews,
                      }))}
                      color="#4f46e5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Article */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-md border border-blue-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Latest Article
              </h3>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-blue-800">
                    {articleStats.latestArticle.title}
                  </h4>
                  <p className="text-sm text-blue-600 mt-1">
                    {articleStats.latestArticle.views} views
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-md"
                >
                  View
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Lab Stats - Expanded view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TestTube className="w-6 h-6 text-red-600" />
              Laboratory Results
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Tests Ordered"
                value={labStats.totalTestsOrdered}
                icon={TestTube}
                color="bg-gradient-to-r from-red-500 to-rose-500"
                animateValue={true}
              />
              <StatCard
                title="Completed"
                value={labStats.completedResults}
                icon={CheckCircle}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                subtitle={`${(
                  (labStats.completedResults / labStats.totalTestsOrdered) *
                  100
                ).toFixed(0)}% completion`}
                animateValue={true}
              />
              <StatCard
                title="Pending"
                value={labStats.pendingResults}
                icon={Clock}
                color="bg-gradient-to-r from-yellow-500 to-amber-500"
                animateValue={true}
              />
              <StatCard
                title="Critical"
                value={labStats.criticalResults}
                icon={AlertCircle}
                color="bg-gradient-to-r from-red-500 to-pink-500"
                animateValue={true}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <StatCard
                title="Verified"
                value={labStats.verifiedResults}
                icon={Shield}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Avg Turnaround"
                value={`${labStats.avgTurnaroundTimeHours.toFixed(1)}h`}
                icon={Clock}
                color="bg-gradient-to-r from-purple-500 to-indigo-500"
              />
              <StatCard
                title="Unique Patients"
                value={labStats.uniquePatientsTested}
                icon={User}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                animateValue={true}
              />
            </div>

            {/* Lab Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Top Tests */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Most Ordered Tests
                </h3>
                <EnhancedBarChart
                  data={labStats.topTests.map((test) => ({
                    label: test.testName,
                    value: test.count,
                  }))}
                  color="bg-blue-500"
                />
              </div>

              {/* Additional Lab Metrics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-green-600" />
                  Lab Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Abnormal Parameters:
                    </span>
                    <span className="font-medium text-red-600">
                      {labStats.abnormalParameters}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Notifications Sent:
                    </span>
                    <span className="font-medium text-blue-600">
                      {labStats.doctorNotificationsSent}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Monthly Trend:
                    </span>
                    <span className="font-medium text-purple-600">
                      {labStats.monthlyTestTrend[0]?.testCount || 0} tests
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Financial Overview
            </h2>
            <div className="space-y-4">
              <StatCard
                title="Monthly Earnings"
                value={`$${paymentStats.totalEarningsThisMonth.toLocaleString()}`}
                icon={DollarSign}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                animateValue={true}
              />
              <StatCard
                title="Avg Fee"
                value={`$${paymentStats.averageConsultationFee.toFixed(0)}`}
                icon={CreditCard}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
              />
              <StatCard
                title="Pending Payouts"
                value={`$${paymentStats.pendingPayouts.toLocaleString()}`}
                icon={Clock}
                color="bg-gradient-to-r from-amber-500 to-orange-500"
                animateValue={true}
              />

              {/* Earnings Trend */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Earnings Trend
                </h3>
                <EnhancedLineChart
                  data={paymentStats.earningsTrend.map((trend) => ({
                    label: `${trend.month}/${trend.year}`,
                    value: trend.totalAmount,
                  }))}
                  color="#10b981"
                />
                <div className="text-xs text-gray-600 text-center mt-2">
                  Monthly earnings progression
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prescription Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Pill className="w-6 h-6 text-blue-600" />
              Prescriptions
            </h2>
            <div className="space-y-4">
              <StatCard
                title="Total Issued"
                value={prescriptionStats.totalPrescriptionsIssued}
                icon={Pill}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Avg Meds/Rx"
                value={prescriptionStats.avgMedicinesPerPrescription.toFixed(1)}
                icon={BarChart3}
                color="bg-gradient-to-r from-purple-500 to-indigo-500"
              />
              <StatCard
                title="Template Mod Ratio"
                value={`${(
                  prescriptionStats.templateModificationRatio * 100
                ).toFixed(0)}%`}
                icon={FileText}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
              />

              {/* Top Medicines */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Top Medicines
                </h3>
                <div className="space-y-2">
                  {prescriptionStats.topMedicines.map((medicine) => (
                    <div
                      key={medicine.medicineId}
                      className="flex justify-between items-center text-sm p-2 bg-blue-50 rounded-lg"
                    >
                      <span className="text-gray-700 truncate">
                        {medicine.medicineName}
                      </span>
                      <span className="font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs">
                        {medicine.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Favorite Templates */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md mt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Favorite Templates
                </h3>
                {prescriptionStats.favoriteTemplatesUsed.map((template) => (
                  <div
                    key={template.templateId}
                    className="flex justify-between items-center text-sm p-2 bg-green-50 rounded-lg mb-2"
                  >
                    <span className="text-gray-700">
                      {template.templateName}
                    </span>
                    <span className="font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                      {template.usageCount} uses
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Calendar View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="col-span-1 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              Schedule Overview - {quickViewResponse.month}
            </h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
              <EnhancedAvailabilityCalendar days={quickViewResponse.days} />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">
                    {
                      quickViewResponse.days.filter(
                        (d) => d.status === "AVAILABLE"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-600">Available Days</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">
                    {quickViewResponse.days.reduce(
                      (total, day) => total + day.bookedSlots,
                      0
                    )}
                  </div>
                  <div className="text-sm text-blue-600">Booked Slots</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-800">
                    {
                      quickViewResponse.days.filter(
                        (d) => d.status === "OVERRIDDEN"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-600">Overridden Days</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800">
                    {
                      quickViewResponse.days.filter(
                        (d) => d.status === "SPECIAL"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-purple-600">Special Days</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-600" />
              Ratings & Reviews
            </h2>
            <div className="space-y-4">
              <StatCard
                title="Average Rating"
                value={ratingDashboardResponse.averageRating.toFixed(1)}
                icon={Star}
                color="bg-gradient-to-r from-yellow-500 to-amber-500"
              />
              <StatCard
                title="Total Reviews"
                value={ratingDashboardResponse.totalRatings}
                icon={MessageSquare}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Recommendation"
                value={`${ratingDashboardResponse.recommendationRate}%`}
                icon={ThumbsUp}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
              />

              {/* Rating Distribution */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Rating Distribution
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {rating}
                        </div>
                        <RatingStars rating={rating} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {
                          ratingDashboardResponse[
                            `rating${rating}Count` as keyof RatingDashboardResponse
                          ] as number
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Rating Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Wait Time Rating:
                    </span>
                    <span className="font-medium text-blue-600">
                      {ratingDashboardResponse.averageWaitTimeRating.toFixed(1)}
                      /5
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Staff Rating:</span>
                    <span className="font-medium text-blue-600">
                      {ratingDashboardResponse.averageStaffRating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Facility Rating:
                    </span>
                    <span className="font-medium text-blue-600">
                      {ratingDashboardResponse.averageFacilityRating.toFixed(1)}
                      /5
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Verified Reviews:
                    </span>
                    <span className="font-medium text-green-600">
                      {ratingDashboardResponse.verifiedReviewsCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Forum Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              Forum Activity
            </h2>
            <div className="space-y-4">
              <StatCard
                title="Threads Created"
                value={forumDashboardResponse.totalThreadsCreated}
                icon={FileText}
                color="bg-gradient-to-r from-indigo-500 to-purple-500"
                animateValue={true}
              />
              <StatCard
                title="Replies Given"
                value={forumDashboardResponse.totalRepliesGiven}
                icon={MessageSquare}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Upvotes Received"
                value={forumDashboardResponse.totalUpvotesReceived}
                icon={ThumbsUp}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                animateValue={true}
              />

              {/* Forum Metrics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Forum Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Bookmarked Threads:
                    </span>
                    <span className="font-medium text-purple-600">
                      {forumDashboardResponse.bookmarkedThreadsCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Solutions Accepted:
                    </span>
                    <span className="font-medium text-purple-600">
                      {forumDashboardResponse.totalSolutionsAccepted}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Total Thread Views:
                    </span>
                    <span className="font-medium text-purple-600">
                      {forumDashboardResponse.totalThreadViews}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Tags */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Active Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {forumDashboardResponse.mostActiveTags.map((tag) => (
                    <span
                      key={tag.tagId}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-medium rounded-full border border-indigo-200"
                    >
                      {tag.tagName} ({tag.threadCount})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Journal Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-gray-600" />
              Journal Entries
            </h2>
            <div className="space-y-4">
              <StatCard
                title="Total Entries"
                value={journalDashboardResponse.totalEntries}
                icon={BookOpen}
                color="bg-gradient-to-r from-gray-500 to-slate-500"
                animateValue={true}
              />
              <StatCard
                title="Words Written"
                value={journalDashboardResponse.totalWordsWritten}
                icon={PenTool}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                animateValue={true}
              />
              <StatCard
                title="Active Entries"
                value={journalDashboardResponse.activeEntries}
                icon={BookOpen}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                animateValue={true}
              />

              {/* Journal Metrics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Journal Metrics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Words/Entry:</span>
                    <span className="font-medium text-blue-600">
                      {journalDashboardResponse.avgWordsPerEntry.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bookmarks:</span>
                    <span className="font-medium text-blue-600">
                      {journalDashboardResponse.bookmarksCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Upcoming Reminders:</span>
                    <span className="font-medium text-blue-600">
                      {journalDashboardResponse.upcomingReminders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Patient Notes:</span>
                    <span className="font-medium text-blue-600">
                      {journalDashboardResponse.patientNotesCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Personal Notes:</span>
                    <span className="font-medium text-blue-600">
                      {journalDashboardResponse.personalNotesCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Templates */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Top Templates
                </h3>
                {journalDashboardResponse.topTemplates.map((template) => (
                  <div
                    key={template.templateId}
                    className="flex justify-between items-center text-sm p-2 bg-blue-50 rounded-lg mb-2"
                  >
                    <span className="text-gray-700">
                      {template.templateName}
                    </span>
                    <span className="font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs">
                      {template.usageCount} uses
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Star className="w-7 h-7 text-yellow-600" />
            Recent Patient Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ratingDashboardResponse.recentReviews
              .slice(0, 4)
              .map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl shadow-lg border border-gray-200/50 group hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                      >
                        {review.patientName.charAt(0)}
                      </motion.div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {review.isAnonymous
                            ? "Anonymous"
                            : review.patientName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 group-hover:text-gray-800 transition-colors">
                    {review.review}
                  </p>
                  <div className="flex items-center justify-between">
                    {review.isVerified && (
                      <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {review.isAnonymous && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <User className="w-3 h-3" />
                        Anonymous
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Review Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Review Tags Frequency
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ratingDashboardResponse.tagFrequency).map(
                ([tag, count], index) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
                  >
                    {tag} ({count})
                  </motion.span>
                )
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Rating Trend */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5 text-blue-600" />
              Rating Trend
            </h3>
            <EnhancedLineChart
              data={ratingDashboardResponse.monthlyRatingTrend.map((trend) => ({
                label: `${trend.month}/${trend.year}`,
                value: trend.avgRating,
              }))}
              color="#f59e0b"
              title="Average Rating Over Time"
            />
            <div className="text-xs text-gray-600 text-center mt-2">
              {ratingDashboardResponse.monthlyRatingTrend.length} months of data
            </div>
          </div>

          {/* Engagement Trend */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Forum Engagement
            </h3>
            <EnhancedBarChart
              data={forumDashboardResponse.engagementTrend.map((trend) => ({
                label: `${trend.month}/${trend.year}`,
                value: trend.threadCount + trend.replyCount,
              }))}
              color="bg-green-500"
              title="Threads + Replies"
            />
          </div>

          {/* Journal Writing Trend */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-purple-600" />
              Writing Progress
            </h3>
            <EnhancedLineChart
              data={journalDashboardResponse.monthlyTrends.map((trend) => ({
                label: `${trend.month}/${trend.year}`,
                value: trend.wordsWritten,
              }))}
              color="#8b5cf6"
              title="Words Written Monthly"
            />
          </div>
        </motion.div>
      </div>

      {/* Floating action button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default DoctorDashboard;
