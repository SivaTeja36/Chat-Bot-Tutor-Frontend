/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useNoScroll from "../../hooks/useNoScroll";
import {
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

import { PmsButton } from "../../components/ui/button";
import { authAPI } from "../../services/api";
import {
  FullScreenRoot,
  LeftSide,
  RightSide,
  FormPaper,
  textFieldSx,
} from "../../components/AuthStyles/AuthStyles";

const EmailVerification: React.FC = () => {
  useNoScroll();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await authAPI.verifyEmail(email);
      navigate("/login", { state: { email } });
    } catch (error: any) {
      if (error.response?.status === 404) {
        navigate("/registration", { state: { email } });
      } else {
        setError("Something went wrong. Please try again.");
      }
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
              color="#002979"
              fontWeight="bold"
              sx={{ mb: 0.5, fontSize: "2rem" }}
            >
              Verify Email
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Enter your email to get started on your learning adventure!
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <Box mt={3} sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <PmsButton
                  type="submit"
                  buttonVarient="contained"
                  name={
                    loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Continue"
                    )
                  }
                  buttonClick={() => {}}
                />
              </Box>
            </form>
          </FormPaper>
        </motion.div>
      </RightSide>
    </FullScreenRoot>
  );
};

export default EmailVerification;
