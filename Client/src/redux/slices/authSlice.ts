import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

export interface Doctor {
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


  export interface Patient {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    phone: string;
    address: string;
    imageUrl: string;
    emergencyContact: string;
    emergencyPhone: string;
    createdAt: string;
  }


export type UserType = "doctor" | "patient" | null

export interface AuthState {
  isAuthenticated: boolean
  userType: UserType
  doctor: Doctor | null
  patient: Patient | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  userType: null,
  doctor: null,
  patient: null,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ formData, userType }: { formData: any; userType: UserType }, { rejectWithValue }) => {
    try {
      const endpoint =
        userType === "patient"
          ? "http://localhost:8080/api/v1/auth/core/patient/login"
          : "http://localhost:8080/api/v1/auth/core/doctor/login"

          const response = await axios.post(endpoint, formData, {
            withCredentials: true,
          })
      return {
        data: response.data.data,
        userType,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.userType = null
      state.doctor = null
      state.patient = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    updateUserProfile: (state, action: PayloadAction<{ doctor?: Doctor; patient?: Patient }>) => {
      if (action.payload.doctor && state.userType === "doctor") {
        state.doctor = { ...state.doctor, ...action.payload.doctor }
      } else if (action.payload.patient && state.userType === "patient") {
        state.patient = { ...state.patient, ...action.payload.patient }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ data: any; userType: UserType }>) => {
        state.loading = false
        state.isAuthenticated = true
        state.userType = action.payload.userType


        if (action.payload.userType === "doctor") {
          state.doctor = action.payload.data.doctor
          state.patient = null
        } else {
          state.patient = action.payload.data.patient
          state.doctor = null
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, updateUserProfile } = authSlice.actions

export default authSlice.reducer
