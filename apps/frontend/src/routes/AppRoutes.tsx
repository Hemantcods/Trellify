import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SigninPage } from "../features/auth/pages/SignInPage";
import { SignupPage } from "../features/auth/pages/SignUpPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
};