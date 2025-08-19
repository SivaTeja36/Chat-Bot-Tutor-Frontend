import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Paper,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Chat,
  Quiz,
  TrendingUp,
  Send,
} from "@mui/icons-material";
import { kidsAPI } from "../../services/api";
import { GetKidResponse, KidRequest } from "../../types/api";
import ChatPage from "./ChatPage";
import { PmsButton } from "../../components/ui/button";

const Kids = () => {
  const [kids, setKids] = useState<GetKidResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openChatDialog, setOpenChatDialog] = useState(false);
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

  const fetchKids = async () => {
    try {
      const response = await kidsAPI.getAllKids();
      setKids(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching kids:", error);
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
      console.error("Error saving kid:", error);
    }
  };

  const handleDeleteKid = async (kidId: number) => {
    try {
      await kidsAPI.deleteKid(kidId);
      setKids(kids.filter((kid) => kid.id !== kidId));
    } catch (error) {
      console.error("Error deleting kid:", error);
    }
  };

  // const handleOpenChatDialog = async (kid: GetKidResponse) => {
  //   setSelectedKid(kid);
  //   setQuestion("");
  //   setOpenChatDialog(true);
  //   setAskingQuestion(true);

  //   try {
  //     // Fetch question history when opening chat dialog
  //     const historyResponse = await kidsAPI.getQuestionsHistory(kid.id);

  //     if (
  //       historyResponse.data &&
  //       historyResponse.data.data &&
  //       historyResponse.data.data.length > 0
  //     ) {
  //       // Convert the history response to our chat history format
  //       const formattedHistory = historyResponse.data.data.map((item) => ({
  //         question: item.question,
  //         answer:
  //           item.answer ||
  //           "I processed your question. Let me think about that!",
  //       }));

  //       setChatHistory(formattedHistory);
  //     } else {
  //       // If no history, show empty chat
  //       setChatHistory([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching question history:", error);
  //     setChatHistory([]);
  //   } finally {
  //     setAskingQuestion(false);
  //   }
  // };

  const handleCloseChat = () => {
    setOpenChatDialog(false);
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !selectedKid) return;

    // Add user question to chat history
    const newQuestion = { question, answer: "" };
    setChatHistory((prevHistory) => [...prevHistory, newQuestion]);
    setAskingQuestion(true);

    try {
      // Send question to API
      await kidsAPI.createQuestion(selectedKid.id, { question });

      // Get questions history after creating the question
      const historyResponse = await kidsAPI.getQuestionsHistory(selectedKid.id);

      // Update chat history with the latest questions and answers
      if (
        historyResponse.data &&
        historyResponse.data.data &&
        historyResponse.data.data.length > 0
      ) {
        // Convert the history response to our chat history format
        const formattedHistory = historyResponse.data.data.map((item) => ({
          question: item.question,
          answer:
            item.answer ||
            "I processed your question. Let me think about that!",
        }));

        setChatHistory(formattedHistory);
      } else {
        // If no history is returned, update just the current question
        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          const lastQuestion = updatedHistory[updatedHistory.length - 1];
          lastQuestion.answer =
            "I processed your question. Let me think about that!";
          return updatedHistory;
        });
      }

      setQuestion("");
    } catch (error) {
      console.error("Error asking question:", error);
      // Add error message to chat history
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        const lastQuestion = updatedHistory[updatedHistory.length - 1];
        lastQuestion.answer =
          "Sorry, I had trouble processing your question. Please try again.";
        return updatedHistory;
      });
    } finally {
      setAskingQuestion(false);
    }
  };

  const KidCard = ({ kid }: { kid: GetKidResponse }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="card-interactive h-full relative overflow-hidden "
        sx={{
          boxShadow: "0.75",
          border: "1px solid #efefef",
          borderRadius: "8px",
        }}
      >
        {/* Action Buttons */}
        <Box className="absolute top-2 right-2 z-10 flex gap-1">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
          </motion.div>
        </Box>

        <CardContent sx={{ pb: 2 }}>
          {/* Kid Info */}
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

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={4}>
              <Box className="text-center">
                <Typography
                  variant="h6"
                  sx={{ color: "#002979" }}
                  className="font-bold text-primary"
                >
                  {0} {/* Placeholder */}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Quizzes
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box className="text-center">
                <Typography
                  variant="h6"
                  sx={{ color: "#002979" }}
                  className="font-bold text-success"
                >
                  {0}% {/* Placeholder */}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Avg Score
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box className="text-center">
                <Typography
                  variant="h6"
                  sx={{ color: "#002979" }}
                  className="font-bold text-warning"
                >
                  {0}h {/* Placeholder */}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  Study Time
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Progress Bar */}
          <Box className="mb-3">
            <Box className="flex justify-between items-center mb-1">
              <Typography variant="body2" className="font-medium">
                Learning Progress
              </Typography>
              <Typography variant="body2" className="text-primary font-bold">
                {0}% {/* Placeholder */}
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

          {/* Achievements */}
          <Box className="mb-4">
            <Typography variant="body2" className="font-medium mb-2">
              Recent Achievements
            </Typography>
            <Box className="flex flex-wrap gap-1">{/* Placeholder */}</Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction={"row"} gap={1}>
            <PmsButton
              buttonVarient="outlined"
              name={"Chat"}
              buttonClick={() => {
                setSelectedKid(kid);
                setKidPage("chatPage");
              }}
              startIcon={<Chat />}
            />
            <PmsButton
              buttonVarient="outlined"
              name={"Quiz"}
              buttonClick={() => {}}
              startIcon={<Quiz />}
            />
            <PmsButton
              buttonVarient="outlined"
              name={"Progress"}
              buttonClick={() => {}}
              startIcon={<TrendingUp />}
            />
          </Stack>
          {/* <Grid container spacing={1}>
            <Grid size={4}>
              <PmsButton
                buttonVarient="outlined"
                name={"Chat"}
                buttonClick={() => {
                  setSelectedKid(kid);
                  setKidPage("chatPage");
                }}
                startIcon={<Chat />}
              />
            </Grid>
            <Grid size={4}>
              <PmsButton
                buttonVarient="outlined"
                name={"Quiz"}
                buttonClick={() => {}}
                startIcon={<Quiz />}
              />
            </Grid>
            <Grid size={4}>
              <PmsButton
                buttonVarient="outlined"
                name={"Progress"}
                buttonClick={() => {}}
                startIcon={<TrendingUp />}
              />
            </Grid>
          </Grid> */}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
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
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={kid.id}>
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
        <>
          <ChatPage setKidPage={setKidPage} kidId={selectedKid?.id ?? 0} />
        </>
      )}

      {/* Add/Edit Kid Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedKid ? "Edit Kid" : "Add New Kid"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newKid.name}
                onChange={(e) => setNewKid({ ...newKid, name: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid size={6}>
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
            <Grid size={6}>
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
            <Grid size={12}>
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
            startIcon={<TrendingUp />}
            isDisable={
              !newKid.name || !newKid.age || !newKid.school || !newKid.standard
            }
          />
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog
        open={openChatDialog}
        onClose={handleCloseChat}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Chat fontSize="small" />
          Chat with Tutor {selectedKid && `- ${selectedKid.name}`}
        </DialogTitle>

        <DialogContent
          sx={{
            p: 2,
            height: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flexGrow: 1, overflow: "auto", mb: 2, p: 1 }}>
            {chatHistory.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  opacity: 0.7,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  Ask me anything about your studies!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  I'm here to help with your questions.
                </Typography>
              </Box>
            ) : (
              chatHistory.map((chat, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  {/* Question */}
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                        borderRadius: "12px 12px 0 12px",
                        maxWidth: "80%",
                      }}
                    >
                      <Typography variant="body2">{chat.question}</Typography>
                    </Paper>
                  </Box>

                  {/* Answer */}
                  {chat.answer ? (
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          bgcolor: "grey.100",
                          borderRadius: "12px 12px 12px 0",
                          maxWidth: "80%",
                        }}
                      >
                        <Typography variant="body2">{chat.answer}</Typography>
                      </Paper>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          bgcolor: "grey.100",
                          borderRadius: "12px 12px 12px 0",
                          maxWidth: "80%",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CircularProgress size={16} />
                        <Typography variant="body2">Thinking...</Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              ))
            )}
            {askingQuestion && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask a question..."
              variant="outlined"
              size="small"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
              disabled={askingQuestion}
            />
            <PmsButton
              buttonVarient="contained"
              startIcon={<Send />}
              name={"Ask"}
              buttonClick={handleAskQuestion}
              isDisable={!question.trim() || askingQuestion}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Kids;
