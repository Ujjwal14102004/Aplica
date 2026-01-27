// Google OAuth ONLY — single source of truth

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

/**
 * 🚫 REMOVED:
 * - registerUser
 * - loginUser
 * - verifyOtp
 *
 * Reason:
 * These were creating frontend-side auth state
 * and conflicting with backend cookie auth.
 */

/**
 * ✅ Google OAuth login
 * Backend sets httpOnly cookie (aplica_token)
 */
export const googleLogin = () => {
  window.location.href = `${API_URL}/auth/google`;
};
