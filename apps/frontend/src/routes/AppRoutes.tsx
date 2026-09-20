import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRoute } from "@/features/auth/PublicRoute";
import { ProtectedLayout } from "@/features/misc/components/protected-layout";
import { NotFoundPage } from "@/features/misc/pages/not-found";
import { ScrollToTop } from "@/features/misc/components/scroll-to-top";

const LandingPage = lazy(() => import("../features/misc/pages/landing"));
const SigninPage = lazy(() =>
  import("../features/auth/pages/SignInPage").then((m) => ({ default: m.SigninPage }))
);
const SignupPage = lazy(() =>
  import("../features/auth/pages/SignUpPage").then((m) => ({ default: m.SignupPage }))
);
const OrganisationsPage = lazy(() =>
  import("../features/organisation/pages/organisations").then((m) => ({ default: m.OrganisationsPage }))
);
const BoardsPage = lazy(() =>
  import("../features/board/pages/boards").then((m) => ({ default: m.BoardsPage }))
);
const BoardDetailPage = lazy(() =>
  import("../features/board/pages/board-detail").then((m) => ({ default: m.BoardDetailPage }))
);
const IssueDetailPage = lazy(() =>
  import("../features/board/pages/issue-detail").then((m) => ({ default: m.IssueDetailPage }))
);
const AcceptInvitePage = lazy(() => import("../features/invitations/pages/acceptInvite"));
const OAuthSuccessPage = lazy(() => import("../features/auth/pages/OauthSuccess"));
const OnboardingPage = lazy(() => import("../features/auth/pages/onboarding"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<OrganisationsPage />} />
            <Route path="/organisations/:orgId/boards" element={<BoardsPage />} />
            <Route
              path="/organisations/:orgId/boards/:boardId"
              element={<BoardDetailPage />}
            />
            <Route
              path="/organisations/:orgId/boards/:boardId/issues/:issueId"
              element={<IssueDetailPage />}
            />
          </Route>

          <Route path="/oauth/success" element={<OAuthSuccessPage />} />
          <Route path="/invitations/:token" element={<AcceptInvitePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
