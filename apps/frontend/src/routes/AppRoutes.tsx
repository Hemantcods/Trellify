import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SigninPage } from "../features/auth/pages/SignInPage";
import { SignupPage } from "../features/auth/pages/SignUpPage";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { PublicRoute } from "@/features/auth/PublicRoute";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute/>} >
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>


        {/*protected route*/}
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};