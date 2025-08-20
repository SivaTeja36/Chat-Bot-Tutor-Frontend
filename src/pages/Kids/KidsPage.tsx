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
  Chat,
  Quiz,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { kidsAPI } from "../../services/api";
import { GetKidResponse, KidRequest } from "../../types/api";
import ChatPage from "./ChatPage";
import { PmsButton } from "../../components/ui/button";

const HANDOVER_KEY = "handedOverKidId_2025";

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
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [kidPage, setKidPage] = useState("kidPage");
  const [handedOverKidId, setHandedOverKidId] = useState<number | null>(() => {
    const id = localStorage.getItem(HANDOVER_KEY);
    return id ? parseInt(id) : null;
  });

  // On handoverKidId change, keep in localStorage
  useEffect(() => {
    if (handedOverKidId !== null) {
      localStorage.setItem(HANDOVER_KEY, handedOverKidId.toString());
    } else {
      localStorage.removeItem(HANDOVER_KEY);
    }
  }, [handedOverKidId]);

  const isParentMode = handedOverKidId === null;

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
    if (!isParentMode) return;
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
    } catch (error) {}
  };

  const handleDeleteKid = async (kidId: number) => {
    if (!isParentMode) return;
    try {
      await kidsAPI.deleteKid(kidId);
      setKids(kids.filter((kid) => kid.id !== kidId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleHandover = (kidId: number) => {
    if (handedOverKidId !== null) return;
    setHandedOverKidId(kidId);
  };

  const isKidProtected = (kidId: number) =>
    handedOverKidId !== null && handedOverKidId !== kidId;

  // Card styles helper
  const getCardSX = (protectedCard: any, activeCard: any) => ({
    boxShadow: "0.75",
    border: activeCard ? "2px solid #50b750" : "1px solid #efefef",
    borderRadius: "14px",
    background: protectedCard
      ? "#fcfcfc"
      : activeCard
      ? "#eafeec"
      : "background.paper",
    opacity: protectedCard ? 1 : 1,
    position: "relative",
    transition: "all 0.3s",
    minHeight: 370,
    pointerEvents: protectedCard ? "auto" : "auto",
    filter: "none",
  });

  // === Kid Card ===
  const KidCard = ({ kid }) => {
    const protectedCard = isKidProtected(kid.id);
    const activeCard = handedOverKidId === kid.id;
    // All three buttons always shown; disabled on protected cards except in parent mode/active card

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={protectedCard ? {} : { y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card sx={getCardSX(protectedCard, activeCard)}>
          {/* Protected label/icon at top right when locked */}
          {protectedCard && (
            <Box
              sx={{
                position: "absolute",
                top: 14,
                right: 22,
                display: "flex",
                alignItems: "center",
                zIndex: 5,
              }}
            >
              <SecurityIcon sx={{ color: "#b71c1c", fontSize: 22, mr: 0.7 }} />
              <Typography
                variant="body2"
                sx={{ color: "#c62828", fontWeight: 500 }}
              >
                Protected
              </Typography>
            </Box>
          )}
          {/* Action Buttons (parent mode only, not protected) */}
          {!protectedCard && isParentMode && (
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
          )}
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
                  border: activeCard ? "2.5px solid #50b750" : undefined,
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
            {/* ---- Always show all three buttons. Disable if protected, else parent/handed can activate ---- */}
            <Stack direction={"row"} gap={1}>
              <PmsButton
                buttonVarient="contained"
                name={"Handover"}
                buttonClick={() => handleHandover(kid.id)}
                startIcon={<SecurityIcon />}
                isDisable={handedOverKidId !== null}
              />
              <PmsButton
                buttonVarient="outlined"
                name={"Chat"}
                buttonClick={() => {
                  if (!protectedCard) {
                    setSelectedKid(kid);
                    setKidPage("chatPage");
                  }
                }}
                startIcon={<Chat />}
                isDisable={protectedCard}
              />
              <PmsButton
                buttonVarient="outlined"
                name={"Quiz"}
                buttonClick={() => {
                  if (!protectedCard) {
                    navigate("/kids/quiz");
                  }
                }}
                startIcon={<Quiz />}
                isDisable={protectedCard}
              />
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {kidPage === "kidPage" ? (
        <>
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
              {isParentMode && (
                <PmsButton
                  buttonVarient="contained"
                  name={"Add New Kid"}
                  buttonClick={handleAddKid}
                  startIcon={<Add />}
                />
              )}
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
                <Grid item xs={12} sm={6} lg={4} key={kid.id}>
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
        </>
      ) : (
        <ChatPage setKidPage={setKidPage} kidId={selectedKid?.id ?? 0} />
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedKid ? "Edit Kid" : "Add New Kid"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newKid.name}
                onChange={(e) => setNewKid({ ...newKid, name: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={12}>
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
