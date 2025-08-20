/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useNoScroll from "../../hooks/useNoScroll";
import {
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
  MenuItem,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

import { authAPI } from "../../services/api";
import {
  FullScreenRoot,
  LeftSide,
  RightSide,
  FormPaper,
  textFieldSx,
} from "../../components/AuthStyles/AuthStyles";
import { PmsButton } from "../../components/ui/button";

// Using AuthStyles components instead of local styled components

interface FormData {
  name: string;
  email: string;
  gender: string;
  role: string;
  phone_number: string;
}

const Registration: React.FC = () => {
  useNoScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledEmail = location.state?.email || "";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: prefilledEmail,
    gender: "",
    role: "parent",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fix: add types for both parameters
  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // Fix: add type for parameter
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authAPI.sendVerification(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { state: { email: formData.email } });
      }, 3000);
    } catch (error: unknown) {
      // Fix: Type assertion for error
      const errMsg =
        (error as any)?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
                sx={{ mb: 2, mt: 2, fontSize: "2rem" }}
              >
                Registration Successful! 🎉
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                We've sent a verification email to {formData.email}. Please
                check your inbox and follow the instructions to complete your
                registration.
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Redirecting to login page...
              </Typography>
            </FormPaper>
          </motion.div>
        </RightSide>
      </FullScreenRoot>
    );
  }

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
              color="#002979"
              fontWeight="bold"
              sx={{ mb: 0.5, mt: 2, fontSize: "2rem" }}
            >
              Create Your Account 🚀
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Fill in your details to join the ChatTutor family!
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%" }}
              autoComplete="off"
            >
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={handleChange("name")}
                margin="normal"
                required
                variant="outlined"
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                margin="normal"
                required
                variant="outlined"
                disabled={!!prefilledEmail}
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                select
                label="Gender"
                value={formData.gender}
                onChange={handleChange("gender")}
                margin="normal"
                required
                variant="outlined"
                SelectProps={{
                  MenuProps: { disablePortal: true },
                }}
                sx={textFieldSx}
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleChange("phone_number")}
                margin="normal"
                required
                variant="outlined"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 15,
                }}
                sx={textFieldSx}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>
                  {error}
                </Alert>
              )}
              <Box mt={3}>
                <Stack>
                  <PmsButton
                    buttonVarient="contained"
                    type="submit"
                    name={
                      loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Create Account"
                      )
                    }
                    buttonClick={() => {}}
                  />
                </Stack>
              </Box>
            </form>
          </FormPaper>
        </motion.div>
      </RightSide>
    </FullScreenRoot>
  );
};

export default Registration;
