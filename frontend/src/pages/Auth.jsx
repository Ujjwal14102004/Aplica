const Auth = () => {
  const handleGoogleLogin = () => {
    // 🔥 Redirect to backend Google OAuth
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Auth;
