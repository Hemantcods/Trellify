import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SigninPage } from "../features/auth/pages/SignInPage";
import { SignupPage } from "../features/auth/pages/SignUpPage";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { PublicRoute } from "@/features/auth/PublicRoute";
import { OrganisationsPage } from "@/features/organisation/pages/organisations";
import { BoardsPage } from "@/features/board/pages/boards";
import { BoardDetailPage } from "@/features/board/pages/board-detail";
import AcceptInvitePage from "@/features/invitations/pages/acceptInvite";
import OAuthSuccessPage from "@/features/auth/pages/OauthSuccess";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/*protected route*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<OrganisationsPage />} />
          <Route path="/organisations/:orgId/boards" element={<BoardsPage />} />
          <Route
            path="/organisations/:orgId/boards/:boardId"
            element={<BoardDetailPage />}
          />
        </Route>
        <Route path="/oauth/success" element={<OAuthSuccessPage />} />
        <Route path="/invitations/:token" element={<AcceptInvitePage />} />
      </Routes>
    </BrowserRouter>
  );
};
