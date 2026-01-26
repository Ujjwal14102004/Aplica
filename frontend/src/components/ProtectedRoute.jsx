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
        setUser(me);          // ✅ authenticated
      } catch (err) {
        setUser(null);        // ✅ explicitly unauthenticated
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

  // ❌ Definitely not authenticated
  if (user === null) {
    return <Navigate to="/auth" replace />;
  }

  /**
   * 🔒 Onboarding enforcement
   * onboardingStep === "done" is treated as completed
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
