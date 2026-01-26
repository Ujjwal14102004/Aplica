import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { useUser } from "../context/UserContext";

const ProtectedRoute = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const checkAuthWithRetry = async () => {
      try {
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        // ⏳ retry once after short delay (cookie propagation)
        setTimeout(async () => {
          try {
            const me = await getMe();
            if (!cancelled) setUser(me);
          } catch {
            if (!cancelled) setUser(null);
          } finally {
            if (!cancelled) setLoading(false);
          }
        }, 300); // 300ms is enough
        return;
      }

      if (!cancelled) setLoading(false);
    };

    checkAuthWithRetry();

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (user === null) {
    return <Navigate to="/auth" replace />;
  }

  // 🔒 Onboarding enforcement (safe)
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
