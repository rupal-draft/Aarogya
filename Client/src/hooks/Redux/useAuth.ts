import { logout } from "../../redux/slices/authSlice"
import { useAppDispatch, useAppSelector } from "../../redux/store"


export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, userType, doctor, patient, loading, error } = useAppSelector((state) => state.auth)

  const userData = userType === "doctor" ? doctor : patient

  const userName = userData?.firstName + " " + userData?.lastName || ""

  const profileImage = userData?.imageUrl || "/default-avatar.png"

  const handleLogout = () => {
    dispatch(logout())
  }

  return {
    isAuthenticated,
    userType,
    doctor,
    patient,
    loading,
    error,
    userData,
    userName,
    profileImage,
    handleLogout,
  }
}
