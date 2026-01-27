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
        setUser(me); // ✅ authenticated
      } catch {
        setUser(null); // ❌ not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  // ⏳ IMPORTANT: while checking, do NOTHING
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // ❌ Only redirect AFTER loading is false
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🔒 Onboarding enforcement
  if (
    user.profileComplete === false &&
    user.onboardingStep &&
    user.onboardingStep !== "done"
  ) {
    const correctPath = `/dashboard/profile/${user.onboardingStep}`;
    if (location.pathname !== correctPath) {
      return <Navigate to={correctPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
