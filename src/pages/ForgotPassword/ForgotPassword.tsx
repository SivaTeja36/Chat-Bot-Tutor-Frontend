/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link } from "react-router-dom";
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

// FIX: Styled BackLink definition here
const BackLink = styled(Link)({
  textDecoration: "underline",
  color: "#1976d2",
  cursor: "pointer",
  fontWeight: 500,
  "&:hover": {
    color: "#115293",
  },
});

const ForgotPassword: React.FC = () => {
  useNoScroll();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authAPI.forgotPassword({ email });
      setSuccess(true);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to send reset email. Please try again."
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
                  color="#002979"
                  fontWeight="bold"
                  sx={{ mb: 0.5, fontSize: "2rem" }}
                >
                  Email Sent! 📧
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  We've sent a password reset link to {email}.<br />
                  Please check your inbox and follow the instructions.
                </Typography>
                <Box textAlign="center">
                  <BackLink to="/login">Back to Login</BackLink>
                </Box>
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
                  Reset Password 🔐
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Enter your email address and we'll send you a link to reset
                  your password.
                </Typography>
                <form
                  onSubmit={handleSubmit}
                  style={{ width: "100%", margin: 0 }}
                >
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
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
                            "Send Reset Link"
                          )
                        }
                        buttonClick={() => {}}
                      />
                    </Stack>
                  </Box>
                  <Box mt={2} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Remember your password?{" "}
                      <BackLink to="/login" sx={{ color: "#002979" }}>
                        Back to Login
                      </BackLink>
                    </Typography>
                  </Box>
                </form>
              </>
            )}
          </FormPaper>
        </motion.div>
      </RightSide>
    </FullScreenRoot>
  );
};

export default ForgotPassword;
