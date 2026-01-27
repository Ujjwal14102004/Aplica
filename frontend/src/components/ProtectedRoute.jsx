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
    let attempts = 0;

    const checkAuth = async () => {
      try {
        const me = await getMe();
        if (!cancelled) {
          setUser(me);
          setLoading(false);
        }
      } catch (err) {
        attempts += 1;

        // 🔁 Retry once to allow OAuth cookie propagation
        if (attempts < 2) {
          setTimeout(checkAuth, 300);
        } else {
          if (!cancelled) {
            setUser(null); // definitively unauthenticated
            setLoading(false);
          }
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  // ⏳ Still resolving auth
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // ❌ Auth resolved and user missing
  if (user === null) {
    return <Navigate to="/auth" replace />;
  }

  // 🔒 Onboarding enforcement (safe + final)
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

  // ✅ Authenticated & allowed
  return <Outlet />;
};

export default ProtectedRoute;
