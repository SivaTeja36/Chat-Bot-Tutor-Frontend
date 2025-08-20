/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

import { authAPI } from "../../services/api";
import {
  FullScreenRoot,
  LeftSide,
  RightSide,
  FormPaper,
  textFieldSx,
  
} from "../../components/AuthStyles/AuthStyles";
import useNoScroll from "../../hooks/useNoScroll";
import { PmsButton } from "../../components/ui/button";

// Styled BackLink using react-router-dom's Link
const BackLink = styled(Link)({
  textDecoration: "underline",
  color: "#1976d2",
  cursor: "pointer",
  fontWeight: 500,
  "&:hover": {
    color: "#115293",
  },
});

const SetPassword: React.FC = () => {
  useNoScroll();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract values from URL query
  const emailParam = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authAPI.setPassword({
        invitation_token: token,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { state: { email: emailParam } });
      }, 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to set password. Please try again."
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
            {success ? (
              <>
                <Typography
                  variant="h4"
                  component="h1"
                  align="center"
                  color="primary"
                  fontWeight="bold"
                  sx={{ mb: 2, fontSize: "2rem" }}
                >
                  All Set! 🎉
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Your password has been set successfully. You can now log in
                  with your new password.
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Redirecting to login page...
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  variant="h4"
                  component="h1"
                  align="center"
                  color="#002979"
                  fontWeight="bold"
                  sx={{ mb: 0.5, fontSize: "2rem" }}
                >
                  Set New Password 🔑
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Choose a strong password for your account.
                </Typography>
                <form
                  onSubmit={handleSubmit}
                  style={{ width: "100%", margin: 0 }}
                >
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={emailParam}
                    disabled
                    margin="normal"
                    variant="outlined"
                    sx={textFieldSx}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    margin="normal"
                    required
                    variant="outlined"
                    sx={textFieldSx}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
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
                  <Box mt={1}>
                    <Stack>
                      <PmsButton
                        type="submit"
                        buttonVarient="contained"
                        name={
                          loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Set Password"
                          )
                        }
                        isDisable={
                          loading ||
                          !formData.password ||
                          !formData.confirmPassword
                        }
                        buttonClick={() => {}}
                      />
                    </Stack>
                  </Box>
                </form>
                <Box mt={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    <BackLink to="/login" sx={{ color: "#002979" }}>
                      Back to Login
                    </BackLink>
                  </Typography>
                </Box>
              </>
            )}
          </FormPaper>
        </motion.div>
      </RightSide>
    </FullScreenRoot>
  );
};

export default SetPassword;
