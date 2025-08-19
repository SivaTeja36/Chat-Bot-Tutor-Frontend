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
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
  Language,
  ChildCare,
} from "@mui/icons-material";
import { authAPI, usersAPI } from "../../services/api";
import { GetUserDetailsResponse, UpdateUserRequest } from "../../types/api";

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

  const handleNotificationChange = (field: string, value: boolean) => {
    // API not available
  };

  const handlePreferenceChange = (field: string, value: any) => {
    // API not available
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
            <Typography variant="h3" className="font-bold text-foreground mb-2">
              Profile Settings ⚙️
            </Typography>
            <Typography variant="h6" className="text-muted-foreground">
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
            <Card className="card-elevated">
              <CardContent>
                <Box className="flex items-center justify-between mb-6">
                  <Typography variant="h5" className="font-bold">
                    Personal Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box className="flex gap-2">
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        className="btn-hero"
                      >
                        Save Changes
                      </Button>
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
                        bgcolor: "primary.main",
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="h6" className="font-bold">
                      {profile?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-muted-foreground"
                    >
                      Parent Account
                    </Typography>
                    <Chip
                      label="Premium Member"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 1 }}
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
                        label="Email Address"
                        value={isEditing ? editedProfile.email : profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
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
                    <Grid size={{ sm: 6, xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={
                          isEditing ? editedProfile.address : profile.address
                        }
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!isEditing}
                        variant="outlined"
                        multiline
                        rows={2}
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
                  <Notifications color="primary" />
                  <Typography variant="h5" className="font-bold">
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
            <Card className="card-elevated mb-4">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">
                  Account Statistics
                </Typography>
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
            <Card className="card-elevated">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4">
                  Quick Actions
                </Typography>
                <Box className="space-y-3">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Security />}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Change Password
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ChildCare />}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Hand Over to Child
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Language />}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Download Data
                  </Button>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Security />}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Delete Account
                  </Button>
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
