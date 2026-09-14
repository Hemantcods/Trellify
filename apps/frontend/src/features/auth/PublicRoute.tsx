import { Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const PublicRoute = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <Outlet />;
};