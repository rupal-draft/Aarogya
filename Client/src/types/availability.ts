import type {
  AvailabilityStatus,
  DayOfWeek,
  OverrideType,
  RecurrenceType,
} from "../Data/enums/availability";

export interface AvailabilityResponse {
  id: string;
  doctorId: string;
  date: string;
  isAvailable: boolean;
  reasonForUnavailability: string | null;
  timeSlots: TimeSlotResponse[];
  slotDurationMinutes: number;
  maxPatientsPerSlot: number;
  status: AvailabilityStatus;
  totalAvailableSlots: number;
  totalBookedSlots: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlotResponse {
  startTime: string;
  endTime: string;
  bookedCount: number;
  availableSlots: number;
  isAvailable: boolean;
  reasonForUnavailability: string | null;
  status: AvailabilityStatus;
}

export interface AvailabilityRequest {
  date: string;
  isAvailable: boolean;
  reasonForUnavailability?: string;
  timeSlots: TimeSlotRequest[];
  slotDurationMinutes: number;
  maxPatientsPerSlot: number;
}

export interface TimeSlotRequest {
  startTime: string;
  endTime: string;
  bookedCount: number;
  availableSlots: number;
  isAvailable: boolean;
  reasonForUnavailability?: string;
}

export interface AvailabilityRangeRequest {
  startDate: string;
  endDate: string;
  includeSlots?: boolean;
}

export interface AvailabilityRangeResponse {
  doctorId: string;
  startDate: string; // ISO date string from backend
  endDate: string;
  availabilities: AvailabilityResponse[];
  availabilitySummary: Record<string, AvailabilityStatus>; // Map<date, status>
  totalAvailableDays: number;
  totalUnavailableDays: number;
}

export interface ScheduleResponse {
  id: string;
  doctorId: string;
  weeklySchedule: Record<string, DailyScheduleResponse>;
  defaultSlotDurationMinutes: number;
  defaultMaxPatientsPerSlot: number;
  bookingLeadTimeHours: number;
  maxBookingDaysInAdvance: number;
  minCancellationNoticeHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyScheduleResponse {
  isAvailable: boolean;
  reasonForUnavailability: string | null;
  availableSlots: TimeRangeResponse[];
  slotDurationMinutes: number;
  maxPatientsPerSlot: number;
}

export interface TimeRangeResponse {
  startTime: string;
  endTime: string;
}

export interface ScheduleRequest {
  weeklySchedule: Record<string, DailyScheduleRequest>;
  defaultSlotDurationMinutes: number;
  defaultMaxPatientsPerSlot: number;
  bookingLeadTimeHours: number;
  maxBookingDaysInAdvance: number;
  minCancellationNoticeHours: number;
}

export interface DailyScheduleRequest {
  isAvailable: boolean;
  reasonForUnavailability?: string;
  availableSlots: TimeRangeRequest[];
  slotDurationMinutes: number;
  maxPatientsPerSlot: number;
}

export interface RecurringUnavailabilityResponse {
  id: string;
  doctorId: string;
  title: string;
  description: string | null;
  recurrencePattern: RecurrencePattern;
  timeRange: TimeRange;
  isAllDay: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;
  daysOfWeek: DayOfWeek[];
  dayOfMonth: number | null;
  month: number | null;
  startDate: string;
  endDate: string | null;
  occurrenceCount: number | null;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface RecurringUnavailabilityRequest {
  title: string;
  description?: string;
  recurrencePattern: RecurrencePatternRequest;
  timeRange: TimeRangeRequest;
  isAllDay?: boolean;
}

export interface RecurrencePatternRequest {
  type: RecurrenceType;
  interval: number;
  daysOfWeek?: DayOfWeek[];
  dayOfMonth?: number;
  month?: number;
  startDate: string;
  endDate?: string;
  occurrenceCount?: number;
}

export interface TimeRangeRequest {
  startTime: string;
  endTime: string;
}

export interface SpecialAvailabilityResponse {
  id: string;
  doctorId: string;
  date: string;
  title: string;
  description: string | null;
  isAvailable: boolean;
  reason: string | null;
  customSlots: TimeRange[];
  customSlotDuration: number;
  customMaxPatients: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialAvailabilityRequest {
  date: string;
  title: string;
  description?: string;
  isAvailable: boolean;
  reason?: string;
  customSlots?: TimeRangeRequest[];
  customSlotDuration?: number;
  customMaxPatients?: number;
}

export interface AvailabilityOverrideResponse {
  id: string;
  doctorId: string;
  date: string;
  overrideType: OverrideType;
  reason: string | null;
  affectedTimeRanges: TimeRange[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityOverrideRequest {
  date: string;
  overrideType: string;
  reason?: string;
  affectedTimeRanges?: TimeRangeRequest[];
}

export interface SlotAvailabilityResponse {
  isAvailable: boolean;
  availableSlots: number;
  bookedSlots: number;
  reasonIfUnavailable: string | null;
  nextAvailableSlot: string | null;
}

export interface SlotAvailabilityRequest {
  date: string;
  startTime: string;
  endTime: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  availability?: AvailabilityResponse;
  hasSpecialAvailability?: boolean;
  hasOverride?: boolean;
}

export interface WeeklyScheduleDay {
  day: DayOfWeek;
  displayName: string;
  schedule?: DailyScheduleResponse;
}
