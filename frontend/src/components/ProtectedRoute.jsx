import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { useUser } from "../context/UserContext";

const ProtectedRoute = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  // ⏳ Still checking auth
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // ❌ Not authenticated
  if (user === undefined) {
    return <Navigate to="/auth" replace />;
  }

  /**
   * 🔒 Onboarding enforcement
   *
   * IMPORTANT RULE:
   * - onboardingStep === "done" → NEVER redirect to profile setup
   * - treat it as completed onboarding
   */
  const isOnboardingIncomplete =
    user.profileComplete === false &&
    user.onboardingStep &&
    user.onboardingStep !== "done";

  if (isOnboardingIncomplete) {
    const correctPath = `/dashboard/profile/${user.onboardingStep}`;

    if (location.pathname !== correctPath) {
      return <Navigate to={correctPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
