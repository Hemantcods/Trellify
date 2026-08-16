import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return <div>loading....</div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace/>
  }
  return <Outlet/>
}