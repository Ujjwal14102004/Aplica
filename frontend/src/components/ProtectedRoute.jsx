import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { useUser } from "../context/UserContext";

const ONBOARDING_ROUTES = {
  "public-profile": "/setup/public-profile",
  "professional-info": "/setup/professional-info",
  "portfolio-socials": "/setup/portfolio-socials",
  attachments: "/setup/attachments",
};

const ProtectedRoute = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMe();
        setUser(data); // backend returns user directly
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🔒 Onboarding NOT complete → force setup flow
  if (!user.profileComplete) {
    const correctPath =
      ONBOARDING_ROUTES[user.onboardingStep] ||
      "/setup/public-profile";

    if (location.pathname !== correctPath) {
      return <Navigate to={correctPath} replace />;
    }
  }

  // 🚫 Onboarding complete → block setup routes
  if (
    user.profileComplete &&
    location.pathname.startsWith("/setup")
  ) {
    return <Navigate to="/dashboard/home" replace />;
  }

  // ✅ All good
  return <Outlet />;
};

export default ProtectedRoute;
