import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
} from "@mui/icons-material";
import { authAPI, usersAPI } from "../../services/api";
import { GetUserDetailsResponse, UpdateUserRequest } from "../../types/api";
import { PmsButton } from "../../components/ui/button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState<GetUserDetailsResponse | null>(null);
  const [editedProfile, setEditedProfile] = useState<UpdateUserRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getUserInfo();
        const userDetailsResponse = await usersAPI.getUserById(
          response.data.data.id
        );
        setProfile(userDetailsResponse.data.data);
        setEditedProfile(userDetailsResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!profile || !editedProfile) return;
    try {
      await usersAPI.updateUserById(profile.id, editedProfile);
      setProfile({ ...profile, ...editedProfile });
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value,
    });
  };

  const stats = [
    { label: "Total Kids", value: "0", color: "#1976d2" }, // Placeholder
    { label: "Active Sessions", value: "0", color: "#42a5f5" }, // Placeholder
    { label: "Completed Quizzes", value: "0", color: "#90caf9" }, // Placeholder
    { label: "Achievements Earned", value: "0", color: "#ffd54f" }, // Placeholder
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="flex items-center justify-between mb-8">
          <Box>
            <Typography fontSize={"20px"} fontWeight={600}>
              Profile Settings ⚙️
            </Typography>
            <Typography color="textDisabled">
              Manage your account information and preferences
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Success Alert */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Alert severity="success">Profile updated successfully!</Alert>
        </motion.div>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid size={{ lg: 8, xs: 12 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="card-elevated" sx={{ p: 2 }}>
              <CardContent>
                <Box className="flex items-center justify-between mb-6">
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <AccountCircleIcon
                      sx={{ color: "#002979" }}
                      fontSize="medium"
                    />
                    <Typography fontSize={"18px"} fontWeight={500}>
                      Personal Information
                    </Typography>
                  </Stack>
                  {!isEditing ? (
                    <PmsButton
                      buttonVarient="outlined"
                      name="Edit Profile"
                      buttonClick={handleEdit}
                      startIcon={<Edit />}
                    />
                  ) : (
                    <Box className="flex gap-2">
                      <PmsButton
                        buttonVarient="outlined"
                        name="Cancel"
                        buttonClick={handleCancel}
                        startIcon={<Cancel />}
                        size="small"
                      />
                      <PmsButton
                        buttonVarient="contained"
                        name="Save Changes"
                        buttonClick={handleSave}
                        startIcon={<Save />}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>

                {/* Profile Picture and Info */}
                <Box className="flex items-center gap-4 mb-6">
                  {profile && (
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "#002979",
                        fontSize: "2rem",
                        fontWeight: "500",
                      }}
                    >
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                  )}
                  <Box>
                    <Typography fontSize={"18px"} fontWeight={500}>
                      {profile?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-muted-foreground"
                    >
                      Parent Account
                    </Typography>
                    <Chip
                      label="👑 Premium Member"
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1, color: "#002979" }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Form Fields */}
                {profile && editedProfile && (
                  <Grid container spacing={3}>
                    <Grid size={{ sm: 6, xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={isEditing ? editedProfile.name : profile.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ sm: 6, xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={
                          isEditing
                            ? editedProfile.phone_number
                            : profile.phone_number
                        }
                        onChange={(e) =>
                          handleInputChange("phone_number", e.target.value)
                        }
                        disabled={!isEditing}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ sm: 12, xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={true}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4"
          >
            <Card className="card-elevated">
              <CardContent>
                <Box className="flex items-center gap-2 mb-4">
                  <Notifications sx={{ color: "#002979" }} />
                  <Typography fontSize={"18px"} fontWeight={500}>
                    Notification Preferences
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <FormControlLabel
                      control={<Switch checked={false} disabled={true} />}
                      label="Email Notifications"
                    />
                  </Grid>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <FormControlLabel
                      control={<Switch checked={false} disabled={true} />}
                      label="Push Notifications"
                    />
                  </Grid>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <FormControlLabel
                      control={<Switch checked={false} disabled={true} />}
                      label="Kid Progress Updates"
                    />
                  </Grid>
                  <Grid size={{ sm: 6, xs: 12 }}>
                    <FormControlLabel
                      control={<Switch checked={false} disabled={true} />}
                      label="Quiz Reminders"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Statistics and Quick Actions */}
        <Grid size={{ sm: 6, xs: 12, lg: 4 }}>
          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="card-elevated mb-4" sx={{ p: 2 }}>
              <CardContent>
                <Stack direction={"row"} alignItems={"center"} gap={1} mb={2}>
                  <PermContactCalendarIcon sx={{ color: "#002979" }} />
                  <Typography fontSize={"18px"} fontWeight={500}>
                    Account Statistics
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid size={{ sm: 12, xs: 6 }} key={stat.label}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      >
                        <Box className="text-center p-3 rounded-lg bg-accent/50">
                          <Typography
                            variant="h5"
                            className="font-bold mb-1"
                            sx={{ color: stat.color }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-muted-foreground"
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="card-elevated" sx={{ p: 1 }}>
              <CardContent>
                <Stack direction={"row"} alignItems={"center"} gap={1} mb={3}>
                  <TrackChangesIcon sx={{ color: "#002979" }} />
                  <Typography fontSize={"18px"} fontWeight={500}>
                    Quick Actions
                  </Typography>
                </Stack>
                <Box className="space-y-3">
                  <Stack gap={1}>
                    <PmsButton
                      buttonVarient="contained"
                      name={" Change Password"}
                      buttonClick={() => {}}
                      startIcon={<Security />}
                    />
                    <PmsButton
                      buttonVarient="contained"
                      name={" Delete Account"}
                      buttonClick={() => {}}
                      startIcon={<DeleteOutlineIcon />}
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
