import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../components/Register";
import { register, RegisterData } from "../services/authService";

const BaseRegister: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegistration = async (data: {
    name: string;
    username: string;
    password: string;
    role: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const registerData: RegisterData = {
        name: data.name,
        email: data.username, // Using username as email
        password: data.password,
        rollNumber: data.username, // Using username as rollNumber
        class: "Default", // Default class
      };

      const response = await register(registerData);

      if (response.user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.error || "Failed to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Register
      handleRegistration={handleRegistration}
      error={error}
      loading={loading}
    />
  );
};

export default BaseRegister;
