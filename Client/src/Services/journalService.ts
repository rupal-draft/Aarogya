import axios from "axios";
import type {
  JournalEntryResponse,
  CreateJournalEntryRequest,
  JournalFilterRequest,
  UpdateJournalEntryRequest,
  BookmarkEntryRequest,
  PinEntryRequest,
  EntryVersionResponse,
  CreateReminderRequest,
  ReminderResponse,
  CreateTemplateRequest,
  TemplateResponse,
  JournalStatsResponse,
  JournalEntrySummaryResponse,
  SearchSuggestionResponse,
  PaginatedResponse,
} from "../types/journal";

const API_BASE_URL = "http://localhost:8080/api/v1/doctors/journal";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const journalService = {
  // Entry management
  createEntry: async (
    request: CreateJournalEntryRequest
  ): Promise<JournalEntryResponse> => {
    const response = await api.post("/entries", request);
    return response.data;
  },

  getEntry: async (
    entryId: string,
    encryptionKey: string
  ): Promise<JournalEntryResponse> => {
    const response = await api.get(`/entries/${entryId}/${encryptionKey}`);
    return response.data;
  },

  getNonEncryptedEntry: async (
    entryId: string
  ): Promise<JournalEntryResponse> => {
    const response = await api.get(`/entries/${entryId}`);
    return response.data;
  },

  getEntries: async (
    filter: JournalFilterRequest,
    page: number = 0,
    size: number = 20,
    sortBy: string = "updatedAt",
    sortOrder: string = "DESC"
  ): Promise<PaginatedResponse<JournalEntrySummaryResponse>> => {
    const params = new URLSearchParams();

    // Add filter parameters
    if (filter.searchQuery) params.append("searchQuery", filter.searchQuery);
    if (filter.patientId) params.append("patientId", filter.patientId);
    if (filter.tags?.length)
      filter.tags.forEach((tag) => params.append("tags", tag));
    if (filter.types?.length)
      filter.types.forEach((type) => params.append("types", type));
    if (filter.priorities?.length)
      filter.priorities.forEach((priority) =>
        params.append("priorities", priority)
      );
    if (filter.bookmarked !== undefined)
      params.append("bookmarked", filter.bookmarked.toString());
    if (filter.pinned !== undefined)
      params.append("pinned", filter.pinned.toString());
    if (filter.hasReminder !== undefined)
      params.append("hasReminder", filter.hasReminder.toString());
    if (filter.startDate) params.append("startDate", filter.startDate);
    if (filter.endDate) params.append("endDate", filter.endDate);
    if (filter.includeInactive !== undefined)
      params.append("includeInactive", filter.includeInactive.toString());

    // Add pagination parameters
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    const response = await api.get(`/entries?${params.toString()}`);
    return response.data;
  },

  updateEntry: async (
    entryId: string,
    request: UpdateJournalEntryRequest
  ): Promise<JournalEntryResponse> => {
    const response = await api.put(`/entries/${entryId}`, request);
    return response.data;
  },

  deleteEntry: async (entryId: string): Promise<void> => {
    await api.delete(`/entries/${entryId}`);
  },

  restoreEntry: async (entryId: string): Promise<void> => {
    await api.post(`/entries/${entryId}/restore`);
  },

  bookmarkEntry: async (
    request: BookmarkEntryRequest
  ): Promise<JournalEntryResponse> => {
    const response = await api.post("/entries/bookmark", request);
    return response.data;
  },

  pinEntry: async (request: PinEntryRequest): Promise<JournalEntryResponse> => {
    const response = await api.post("/entries/pin", request);
    return response.data;
  },

  // Version management
  getEntryVersions: async (
    entryId: string
  ): Promise<EntryVersionResponse[]> => {
    const response = await api.get(`/entries/${entryId}/versions`);
    return response.data;
  },

  revertToVersion: async (
    entryId: string,
    version: number
  ): Promise<JournalEntryResponse> => {
    const response = await api.post(`/entries/${entryId}/revert/${version}`);
    return response.data;
  },

  // Reminders
  createReminder: async (
    request: CreateReminderRequest
  ): Promise<ReminderResponse> => {
    const response = await api.post("/reminders", request);
    return response.data;
  },

  getUpcomingReminders: async (): Promise<ReminderResponse[]> => {
    const response = await api.get("/reminders/upcoming");
    return response.data;
  },

  deleteReminder: async (reminderId: string): Promise<void> => {
    await api.delete(`/reminders/${reminderId}`);
  },

  // Templates
  createTemplate: async (
    request: CreateTemplateRequest
  ): Promise<TemplateResponse> => {
    const response = await api.post("/templates", request);
    return response.data;
  },

  getTemplates: async (): Promise<TemplateResponse[]> => {
    const response = await api.get("/templates");
    return response.data;
  },

  createFromTemplate: async (
    templateId: string,
    variables: Record<string, string>
  ): Promise<JournalEntryResponse> => {
    const response = await api.post(
      `/templates/${templateId}/create-entry`,
      variables
    );
    return response.data;
  },

  // Stats and utilities
  getJournalStats: async (): Promise<JournalStatsResponse> => {
    const response = await api.get("/stats");
    return response.data;
  },

  getRecentEntries: async (
    limit: number = 10
  ): Promise<JournalEntrySummaryResponse[]> => {
    const response = await api.get(`/recent?limit=${limit}`);
    return response.data;
  },

  getSearchSuggestions: async (): Promise<SearchSuggestionResponse> => {
    const response = await api.get("/search-suggestions");
    return response.data;
  },
};
