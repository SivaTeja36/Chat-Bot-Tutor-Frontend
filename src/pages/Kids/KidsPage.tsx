/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { kidsAPI } from "../../services/api";
import { GetKidResponse, KidRequest } from "../../types/api";
import { PmsButton } from "../../components/ui/button";

const Kids = () => {
  const navigate = useNavigate();
  const [kids, setKids] = useState<GetKidResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedKid, setSelectedKid] = useState<GetKidResponse | null>(null);
  const [newKid, setNewKid] = useState<KidRequest>({
    name: "",
    age: 0,
    gender: "",
    school: "",
    standard: "",
  });

  const fetchKids = async () => {
    try {
      const response = await kidsAPI.getAllKids();
      setKids(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKids();
  }, []);

  const handleAddKid = () => {
    setSelectedKid(null);
    setNewKid({ name: "", age: 0, gender: "", school: "", standard: "" });
    setOpenDialog(true);
  };

  const handleEditKid = (kid: GetKidResponse) => {
    setSelectedKid(kid);
    setNewKid({
      name: kid.name,
      age: kid.age,
      gender: kid.gender,
      school: kid.school,
      standard: kid.standard,
    });
    setOpenDialog(true);
  };

  const handleSaveKid = async () => {
    try {
      if (selectedKid) {
        await kidsAPI.updateKid(selectedKid.id, newKid);
        setKids(
          kids.map((kid) =>
            kid.id === selectedKid.id ? { ...selectedKid, ...newKid } : kid
          )
        );
      } else {
        const response = await kidsAPI.createKid(newKid);
        const createdKid = response.data.data;
        fetchKids();
        setKids([...kids, createdKid]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteKid = async (kidId: number) => {
    try {
      await kidsAPI.deleteKid(kidId);
      setKids(kids.filter((kid) => kid.id !== kidId));
    } catch (error) {
      console.log(error);
    }
  };

  // Only this changed: open in new tab, card size untouched!
  const handleHandover = (kidId: number) => {
    window.open(`/handover/${kidId}/chat`, "_blank", "noopener");
  };

  // Card styles helper - unchanged!!
  const getCardSX = () => ({
    boxShadow: "0.75",
    border: "1px solid #efefef",
    borderRadius: "14px",
    background: "background.paper",
    position: "relative",
    transition: "all 0.3s",
    minHeight: 370,
  });

  // === Kid Card ===
  const KidCard = ({ kid }: any) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card sx={getCardSX()}>
          <Box className="absolute top-2 right-2 z-10 flex gap-1">
            <IconButton
              size="small"
              onClick={() => handleEditKid(kid)}
              sx={{
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDeleteKid(kid.id)}
              sx={{
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "error.main", color: "white" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
          <CardContent sx={{ pb: 2 }}>
            <Box className="flex items-center gap-3 mb-4">
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: "#d6ecff",
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#002979 ",
                }}
              >
                {kid?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  className="font-bold"
                  sx={{ color: "#002979" }}
                >
                  {kid?.name}
                </Typography>
                <Typography variant="body2" className="text-muted-foreground">
                  Age {kid?.age} • {kid?.standard}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {kid?.school}
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ md: 4, sm: 4 }}>
                <Box className="text-center">
                  <Typography
                    variant="h6"
                    sx={{ color: "#002979" }}
                    className="font-bold text-primary"
                  >
                    {0}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    Quizzes
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ md: 4, sm: 4 }}>
                <Box className="text-center">
                  <Typography
                    variant="h6"
                    sx={{ color: "#002979" }}
                    className="font-bold text-success"
                  >
                    {0}%
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    Avg Score
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ md: 4, sm: 4 }}>
                <Box className="text-center">
                  <Typography
                    variant="h6"
                    sx={{ color: "#002979" }}
                    className="font-bold text-warning"
                  >
                    {0}h
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    Study Time
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box className="mb-3">
              <Box className="flex justify-between items-center mb-1">
                <Typography variant="body2" className="font-medium">
                  Learning Progress
                </Typography>
                <Typography variant="body2" className="text-primary font-bold">
                  {0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "action.hover",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  },
                }}
              />
            </Box>
            <Box className="mb-4">
              <Typography variant="body2" className="font-medium mb-2">
                Recent Achievements
              </Typography>
              <Box className="flex flex-wrap gap-1">{/* Placeholder */}</Box>
            </Box>
            <Stack direction="row" justifyContent="center" gap={1}>
              <PmsButton
                buttonVarient="contained"
                name={"Handover"}
                buttonClick={() => handleHandover(kid.id)}
                startIcon={<SecurityIcon />}
              />
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="flex items-center justify-between mb-8">
          <Box>
            <Typography fontSize={"24px"} fontWeight={600}>
              Your Kids 👨‍👩‍👧‍👦
            </Typography>
            <Typography
              fontSize={"14px"}
              fontWeight={400}
              color="textDisabled"
            >
              Manage and track your children's learning progress
            </Typography>
          </Box>
          <PmsButton
            buttonVarient="contained"
            name={"Add New Kid"}
            buttonClick={handleAddKid}
            startIcon={<Add />}
          />
        </Box>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Box className="mb-6"></Box>
      </motion.div>
      <Grid container spacing={3}>
        <AnimatePresence>
          {kids.map((kid, index) => (
            <Grid size={{ lg: 4, xs: 12, sm: 6 }} key={kid.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <KidCard kid={kid} />
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedKid ? "Edit Kid" : "Add New Kid"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ md: 12, sm: 12 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={newKid.name}
                onChange={(e) => setNewKid({ ...newKid, name: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ md: 6, sm: 6 }}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={newKid.age}
                onChange={(e) =>
                  setNewKid({ ...newKid, age: parseInt(e.target.value) })
                }
                variant="outlined"
              />
            </Grid>
            <Grid size={{ md: 6, sm: 6 }}>
              <TextField
                fullWidth
                label="Grade/Standard"
                value={newKid.standard}
                onChange={(e) =>
                  setNewKid({ ...newKid, standard: e.target.value })
                }
                variant="outlined"
              />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <TextField
                fullWidth
                label="School Name"
                value={newKid.school}
                onChange={(e) =>
                  setNewKid({ ...newKid, school: e.target.value })
                }
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <PmsButton
            buttonVarient="outlined"
            name={"Cancel"}
            buttonClick={() => setOpenDialog(false)}
          />
          <PmsButton
            buttonVarient="contained"
            name={selectedKid ? "Update" : "Add Kid"}
            buttonClick={handleSaveKid}
            startIcon={<SecurityIcon />}
            isDisable={
              !newKid.name || !newKid.age || !newKid.school || !newKid.standard
            }
          />
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default Kids;
