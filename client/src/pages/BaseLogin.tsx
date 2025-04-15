import { useState } from "react";
import LoginPage from "../components/Login";
import { useNavigate } from "react-router-dom";
import { login, LoginCredentials } from "../services/authService";

const BaseLogin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const credentials: LoginCredentials = {
        rollNumber: username,
        password: password,
      };

      const response = await login(credentials);

      if (response.user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPage handleLogin={handleLogin} error={error} loading={loading} />
  );
};

export default BaseLogin;
