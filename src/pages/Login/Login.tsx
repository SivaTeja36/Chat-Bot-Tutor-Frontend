import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useNoScroll from "../../hooks/useNoScroll";
import {
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

import AnimatedButton from "../../components/AnimatedButton/AnimatedButton";
import {
  FullScreenRoot,
  LeftSide,
  RightSide,
  FormPaper,
  textFieldSx,
  buttonSx,
} from "../../components/AuthStyles/AuthStyles";

// Styled BackLink defined here to ensure correct usage
const BackLink = styled(Link)({
  textDecoration: "underline",
  color: "#1976d2",
  cursor: "pointer",
  "&:hover": {
    color: "#115293", // slightly darker on hover
  },
});

const Login: React.FC = () => {
  useNoScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const prefilledEmail = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullScreenRoot>
      <LeftSide />
      <RightSide>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            margin: 0,
          }}
        >
          <FormPaper elevation={6}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 2, fontSize: "2rem" }}
            >
              Welcome Back! 👋
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Sign in to continue your learning journey!
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                margin="normal"
                required
                variant="outlined"
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                margin="normal"
                required
                variant="outlined"
                sx={textFieldSx}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 1, borderRadius: "8px" }}>
                  {error}
                </Alert>
              )}
              <Box mt={3}>
                <AnimatedButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  animationType="bounce"
                  sx={buttonSx}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </AnimatedButton>
              </Box>
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Forgot your password?{" "}
                  <BackLink to="/forgot-password">Reset it here</BackLink>
                </Typography>
              </Box>
            </form>
          </FormPaper>
        </motion.div>
      </RightSide>
    </FullScreenRoot>
  );
};

export default Login;
