export interface JournalEntryResponse {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  title: string;
  content: string;
  tags: string[];
  type: string;
  priority: string;
  isBookmarked: boolean;
  isPinned: boolean;
  isActive: boolean;
  isEncrypted: boolean;
  wordCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  reminderDate: string | null;
  hasReminder: boolean;
  versionHistory: EntryVersionResponse[];
}

export interface EntryVersionResponse {
  id: string;
  version: number;
  title: string;
  contentPreview: string;
  tags: string[];
  changeSummary: string;
  createdAt: string;
}

export interface CreateJournalEntryRequest {
  title: string;
  content: string;
  patientId?: string;
  tags?: string[];
  type?: string;
  priority?: string;
  isEncrypted?: boolean;
  encryptionKey?: string;
  reminderDate?: string;
  parentEntryId?: string;
}

export interface JournalFilterRequest {
  searchQuery?: string;
  patientId?: string;
  tags?: string[];
  types?: string[];
  priorities?: string[];
  bookmarked?: boolean;
  pinned?: boolean;
  hasReminder?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
  includeInactive?: boolean;
  page?: number;
  size?: number;
}

export interface UpdateJournalEntryRequest {
  title?: string;
  content?: string;
  patientId?: string;
  tags?: string[];
  type?: string;
  priority?: string;
  isBookmarked?: boolean;
  isPinned?: boolean;
  reminderDate?: string;
  changeSummary?: string;
}

export interface BookmarkEntryRequest {
  entryId: string;
  isBookmarked: boolean;
}

export interface PinEntryRequest {
  entryId: string;
  isPinned: boolean;
}

export interface CreateReminderRequest {
  entryId: string;
  title: string;
  reminderDate: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

export interface ReminderResponse {
  id: string;
  entryId: string;
  title: string;
  reminderDate: string;
  notes: string;
  isActive: boolean;
  isRecurring: boolean;
  recurrencePattern: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  titleTemplate: string;
  contentTemplate: string;
  defaultTags?: string[];
  defaultType?: string;
  category?: string;
}

export interface TemplateResponse {
  id: string;
  name: string;
  description: string;
  titleTemplate: string;
  contentTemplate: string;
  defaultTags: string[];
  defaultType: string;
  category: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalStatsResponse {
  totalEntries: number;
  activeEntries: number;
  bookmarkedEntries: number;
  pinnedEntries: number;
  totalWords: number;
  patientNotes: number;
  personalNotes: number;
  tagStatistics: Record<string, number>;
  typeStatistics: Record<string, number>;
  lastEntryDate: string;
  entriesThisWeek: number;
  entriesThisMonth: number;
}

export interface JournalEntrySummaryResponse {
  id: string;
  title: string;
  contentPreview: string;
  patientId: string;
  patientName: string;
  tags: string[];
  type: string;
  priority: string;
  isBookmarked: boolean;
  isEncrypted: boolean;
  isPinned: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  hasReminder: boolean;
}

export interface SearchSuggestionResponse {
  tagSuggestions: string[];
  patientSuggestions: string[];
  titleSuggestions: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export type EntryType =
  | "NOTE"
  | "CLINICAL_OBSERVATION"
  | "TREATMENT_PLAN"
  | "RESEARCH_IDEA"
  | "PATIENT_FOLLOWUP"
  | "MEETING_NOTES"
  | "EDUCATIONAL"
  | "PERSONAL_REFLECTION";

export type EntryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type SortOrder = "ASC" | "DESC";
