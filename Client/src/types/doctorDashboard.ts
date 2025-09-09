export interface DoctorResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  phone: string;
  address: string;
  imageUrl: string;
  createdAt: string;
}

export interface AppointmentStatsDto {
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  inProgressAppointments: number;
  rejectedAppointments: number;
  followupAppointments: number;
  emergencyAppointments: number;
  overdueFollowupAppointments: number;
  pendingFollowupAppointments: number;
}

export interface PatientStatsDto {
  totalPatients: number;
  newPatientsThisMonth: number;
  returningPatients: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface TagStat {
  tag: string;
  count: number;
}

export interface TopArticle {
  id: string;
  title: string;
  views: number;
}

export interface ViewsTrend {
  period: string;
  views: number;
}

export interface LatestArticle {
  id: string;
  title: string;
  views: number;
}

export interface TopLikedArticle {
  id: string;
  title: string;
  views: number;
}

export interface EngagementStats {
  totalLikes: number;
  totalComments: number;
  topLikedArticles: TopLikedArticle[];
  topCommentedArticles: TopLikedArticle[];
}

export interface EngagementTrend {
  year: number;
  month: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface ArticleStats {
  doctorId: string;
  totalArticles: number;
  articlesThisMonth: number;
  categoryStats: CategoryStat[];
  tagStats: TagStat[];
  topArticles: TopArticle[];
  viewsTrend: ViewsTrend[];
  latestArticle: LatestArticle;
  engagementStats: EngagementStats;
  engagementTrend: EngagementTrend[];
}

export interface TopTest {
  testId: string;
  testName: string;
  count: number;
}

export interface MonthlyTestTrend {
  year: number;
  month: number;
  testCount: number;
}

export interface LabStats {
  totalTestsOrdered: number;
  completedResults: number;
  pendingResults: number;
  verifiedResults: number;
  criticalResults: number;
  avgTurnaroundTimeHours: number;
  topTests: TopTest[];
  abnormalParameters: number;
  doctorNotificationsSent: number;
  uniquePatientsTested: number;
  monthlyTestTrend: MonthlyTestTrend[];
}

export interface EarningsTrend {
  year: number;
  month: number;
  totalAmount: number;
}

export interface PaymentStats {
  totalEarningsThisMonth: number;
  pendingPayouts: number;
  averageConsultationFee: number;
  earningsTrend: EarningsTrend[];
}

export interface TopMedicine {
  medicineId: string;
  medicineName: string;
  count: number;
}

export interface FavoriteTemplate {
  templateId: string;
  templateName: string;
  usageCount: number;
}

export interface PrescriptionGrowthTrend {
  year: number;
  month: number;
  totalPrescriptions: number;
}

export interface PrescriptionStats {
  totalPrescriptionsIssued: number;
  topMedicines: TopMedicine[];
  favoriteTemplatesUsed: FavoriteTemplate[];
  avgMedicinesPerPrescription: number;
  templateModificationRatio: number;
  prescriptionGrowthTrend: PrescriptionGrowthTrend[];
}

export interface DayAvailability {
  date: string;
  isAvailable: boolean;
  totalSlots: number;
  bookedSlots: number;
  freeSlots: number;
  status: string;
  note: string;
}

export interface QuickViewResponse {
  doctorId: string;
  month: string;
  days: DayAvailability[];
}

export interface MostActiveTag {
  tagId: string;
  tagName: string;
  threadCount: number;
  replyCount: number;
}

export interface ForumEngagementTrend {
  year: number;
  month: number;
  threadCount: number;
  replyCount: number;
}

export interface ForumDashboardResponse {
  totalThreadsCreated: number;
  totalRepliesGiven: number;
  totalUpvotesReceived: number;
  bookmarkedThreadsCount: number;
  totalSolutionsAccepted: number;
  totalThreadViews: number;
  mostActiveTags: MostActiveTag[];
  engagementTrend: ForumEngagementTrend[];
}

export interface TopTemplate {
  templateId: string;
  templateName: string;
  usageCount: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  entriesCreated: number;
  wordsWritten: number;
}

export interface JournalDashboardResponse {
  totalEntries: number;
  activeEntries: number;
  archivedEntries: number;
  avgWordsPerEntry: number;
  totalWordsWritten: number;
  patientNotesCount: number;
  personalNotesCount: number;
  bookmarksCount: number;
  modificationRatio: number;
  avgVersionsPerEntry: number;
  upcomingReminders: number;
  recurringReminders: number;
  totalTemplates: number;
  topTemplates: TopTemplate[];
  topTags: TagCount[];
  monthlyTrends: MonthlyTrend[];
}

export interface RecentReview {
  patientName: string;
  rating: number;
  review: string;
  isVerified: boolean;
  isAnonymous: boolean;
  createdAt: string;
}

export interface MonthlyRatingTrend {
  year: number;
  month: number;
  avgRating: number;
  ratingCount: number;
}

export interface RatingDashboardResponse {
  averageRating: number;
  totalRatings: number;
  rating1Count: number;
  rating2Count: number;
  rating3Count: number;
  rating4Count: number;
  rating5Count: number;
  averageWaitTimeRating: number;
  averageStaffRating: number;
  averageFacilityRating: number;
  recommendationRate: number;
  verifiedReviewsCount: number;
  anonymousReviewsCount: number;
  totalReviews: number;
  totalHelpfulVotes: number;
  reportedReviewsCount: number;
  tagFrequency: Record<string, number>;
  monthlyRatingTrend: MonthlyRatingTrend[];
  recentReviews: RecentReview[];
}

export interface DoctorDashboardData {
  doctorResponseDTO: DoctorResponseDTO;
  appointmentStats: {
    appointmentStatsDto: AppointmentStatsDto;
    patientStatsDto: PatientStatsDto;
  };
  articleStats: ArticleStats;
  labStats: LabStats;
  paymentStats: PaymentStats;
  prescriptionStats: PrescriptionStats;
  quickViewResponse: QuickViewResponse;
  forumDashboardResponse: ForumDashboardResponse;
  journalDashboardResponse: JournalDashboardResponse;
  ratingDashboardResponse: RatingDashboardResponse;
}
