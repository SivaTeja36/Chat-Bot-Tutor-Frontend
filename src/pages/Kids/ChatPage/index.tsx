import {
  IconButton,
  Stack,
  Typography,
  Grid,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Avatar,
  InputAdornment,
  useTheme
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { kidsAPI } from "../../../services/api";
import { PmsButton } from "../../../components/ui/button";
import {
  GetQuestionsHistoryResponse,
  IGetChatResponse,
} from "../../../types/api";

interface IChatPageProps {
  setKidPage: (value: React.SetStateAction<string>) => void;
  kidId: number;
}

const bubbleVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};

function ChatPage({ setKidPage, kidId }: IChatPageProps) {
  const [messages, setMessages] = useState<GetQuestionsHistoryResponse[]>([]);
  const [input, setInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatData, setChatData] = useState<IGetChatResponse>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Typing indicator state
  const [isTutorTyping, setIsTutorTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: input,
        answer: "",
        created_at: new Date().toISOString(),
      },
    ]);
    setInput("");
    setIsLoading(true);
    setIsTutorTyping(true);

    try {
      const payload = { question: input };
      await kidsAPI.createQuestion(selectedChatId, payload);

      // Simulate "typing" for 1s
      setTimeout(async () => {
        setIsTutorTyping(false);
        const response = await kidsAPI.getChatHistory(selectedChatId);
        setMessages(response.data.data || []);
        setIsLoading(false);
      }, 1200);
    } catch (err) {
      setIsTutorTyping(false);
      setIsLoading(false);
      console.error("Error sending message:", err);
    }
  };

  // Ensure always scroll to last message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isTutorTyping]);

  // Fetch chats
  const handleGetChat = async () => {
    try {
      const response = await kidsAPI.getChat(kidId);
      setChatData(response.data.data);
    } catch (err) {
      console.error("Error fetching chat data:", err);
    }
  };

  // Fetch chat histories on chat switch
  useEffect(() => {
    handleGetChat();
  }, []);

  useEffect(() => {
    const getAllChatConversation = async () => {
      if (!selectedChatId) return;
      try {
        const response = await kidsAPI.getChatHistory(selectedChatId);
        setMessages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setMessages([]);
      }
    };
    getAllChatConversation();
  }, [selectedChatId]);

  // Chat CRUD
  const handleCreateChat = async () => {
    try {
      const payload = { title: chatName };
      if (isEditMode && editingChatId !== null) {
        await kidsAPI.updateChat(kidId, editingChatId, payload);
      } else {
        await kidsAPI.createChat(kidId, payload);
      }
      setOpenDialog(false);
      setChatName("");
      setEditingChatId(null);
      setIsEditMode(false);
      handleGetChat();
    } catch (error) {
      console.error("Error creating/updating chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: number) => {
    const confirmed = window.confirm("Do you want to delete this chat?");
    if (!confirmed) return;
    try {
      await kidsAPI.deleteKChat(kidId, chatId);
      handleGetChat();
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const handleStoreId = (id: number) => {
    setSelectedChatId(id);
  };
  const theme = useTheme();
  // Helper: Colorful gradients
  const userBubbleGradient = "linear-gradient(90deg, #FFB300 0%, #FFA000 100%)"; // slightly golden-solid
  const tutorBubbleGradient = "linear-gradient(90deg, #42A5F5 0%, #1976D2 100%)"; // vibrant blue blend

  // Emoji picker (placeholder)
  const handleEmojiClick = (emoji: string) => {
    setInput((cur) => cur + emoji);
  };

  // --- LAYOUT FIXES START HERE ---

  // Make parent container (Grid) full height of viewport
  // Ensure chat area (right) is flex column and takes full height
  // Ensure message list box fills available height (with overflow scroll)
  // Ensure input always pinned at bottom (not pushed down by content)

  return (
    <>
      {/* Add/Edit Chat Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Edit Chat Name" : "Add New Chat"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ md: 12, sm: 12 }}>
              <TextField
                fullWidth
                label="Chat Name"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <PmsButton
            buttonVarient="outlined"
            name={" Cancel"}
            buttonClick={() => setOpenDialog(false)}
          />
          <PmsButton
            buttonVarient="contained"
            name={isEditMode ? "Edit" : "Create"}
            buttonClick={handleCreateChat}
            isDisable={chatName.length === 0}
          />
        </DialogActions>
      </Dialog>

      {/* Make root grid full viewport height minus any header (adjust as needed) */}
      <Grid
        container
        sx={{
          height: "85vh",
          overflow: "hidden",
        }}
        spacing={0}
      >
        {/* Chat List Sidebar */}
        <Grid
          size={{ xs: 12, sm: 5, md: 4, lg: 3 }}
          sx={{
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "#f5f9fd",
            display: "flex",
            flexDirection: "column",
            p: 2,
            minWidth: 220,
            maxWidth: 330,
          }}
        >
          {/* Sidebar Header */}
          <Stack direction="row" alignItems="center" spacing={1} mb={2} mt={3}>
            <IconButton onClick={() => setKidPage("kidPage")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={600}>
              Chat History
            </Typography>
          </Stack>
          {/* Chat Titles */}
          <Stack spacing={2} flexGrow={1} sx={{ overflowY: "auto" }}>
            {chatData &&
              chatData.length > 0 &&
              chatData.map((data, idx) => {
                const isActive = selectedChatId === data.id;
                return (
                  <motion.div
                    key={data.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      px={2}
                      py={1.3}
                      sx={{
                        borderRadius: "16px",
                        bgcolor: isActive ? "#e3fcef" : "white",
                        boxShadow: isActive ? "0 0 8px #b2dfdb40" : "none",
                        border: isActive
                          ? "2px solid #1976d2"
                          : "1px solid #f0f0f0",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "#c5e1fbc0",
                        },
                      }}
                      onClick={() => {
                        setMessages([]);
                        handleStoreId(data.id);
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={1}>
                        <SmsOutlinedIcon color="primary" />
                        <Typography noWrap fontSize={15}>
                          {data.title.length > 16
                            ? `${data.title.substring(0, 16)}...`
                            : data.title}
                        </Typography>
                      </Stack>
                      <Stack direction="row">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            sx={{ mr: 0.5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatName(data.title);
                              setEditingChatId(data.id);
                              setIsEditMode(true);
                              setOpenDialog(true);
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(data.id);
                            }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </motion.div>
                );
              })}
          </Stack>
          {/* Add New Chat Button */}
        </Grid>

        {/* Chat Area */}
        <Grid
          size={{ xs: 12, sm: 7, md: 8, lg: 9 }}
          // FULL HEIGHT + column flex
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "50vh", // allow flex children to shrink
            height: "80vh", // full viewport height
            bgcolor: "linear-gradient(140deg, #e1f5fe 0%, #ffe082 100%)",
            // background: "linear-gradient(140deg, #e3fcef 0%, #fff8e1 100%)",
          }}
        >
          {/* Chat Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              px: 4,
              pt: 2,
              bgcolor: "#f7f8fa",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              mt: 4,
            }}
          >
            <Stack direction={"row"} alignItems={"center"} gap={1} sx={{ mb: 1 }}  >
              <Avatar alt="AI Tutor" sx={{ bgcolor: "#002979" }}>
                🤖
              </Avatar>
              <Typography variant="h6" color="#002979">
                Chat with Tutor
              </Typography>
            </Stack>
            <Stack>
              <PmsButton
                buttonVarient="contained"
                name={" Add New Chat"}
                buttonClick={() => {
                  setOpenDialog(true);
                  setChatName("");
                  setMessages([]);
                }}
                startIcon={<ForumOutlinedIcon />}
              />
            </Stack>
          </Stack>

          {/* Chat messages - THIS FLEX CHILD GROWS AND SCROLLS */}
          <Stack
            sx={{
              minHeight: "78vh",
            }}
          >
            <Box
              sx={{
                flex: 1, // GROW!
                // minHeight: "300px", // ALLOW FLEX SHRINK
                overflowY: "auto", // Allow scrolling
                px: { xs: 1, sm: 3 },
                py: 3,
                // background:
                //   "repeating-linear-gradient(90deg, #fafafc, #fbf9ed 32px)",
                position: "relative",
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => {
                  // User message with nice bubble & avatar
                  return (
                    <motion.div
                      key={`q_${msg.id}_${i}`}
                      variants={bubbleVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0 }}
                    >
                      {/* User message (right) */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row-reverse",
                          alignItems: "flex-end",
                          gap: 1,
                          mb: 1.4,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#ffb200",
                            color: "#1565c0",
                            ml: 1,
                            width: 38,
                            height: 38,
                            fontWeight: 700,
                            fontSize: 20,
                          }}
                        >
                          👦
                        </Avatar>
                        <Paper
                          elevation={3}
                          sx={{
                            background: userBubbleGradient,
                            px: 2.2,
                            py: 1.5,
                            borderRadius: "16px 18px 4px 20px",
                            mb: 0.2,
                            maxWidth: "68%",
                            fontSize: 16,
                          }}
                        >
                          <Typography fontSize={15}>{msg.question}</Typography>
                        </Paper>
                      </Box>
                      {/* Bot answer (left) */}
                      {msg.answer && (
                        <motion.div
                          variants={bubbleVariants}
                          initial="initial"
                          animate="animate"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-end",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "#00A7E1",
                                color: "#33691e",
                                mr: 1,
                                width: 38,
                                height: 38,
                                fontWeight: 900,
                                fontSize: 20,
                                border: "2px solid #81d4fa",
                              }}
                            >
                              🤖
                            </Avatar>
                            <Paper
                              elevation={3}
                              sx={{
                                background: tutorBubbleGradient,
                                px: 2.4,
                                py: 1.6,
                                borderRadius: "18px 16px 20px 4px",
                                boxShadow: "0 1px 16px #1e90ff07",
                                maxWidth: "72%",
                                fontSize: 16,
                              }}
                            >
                              <Typography fontSize={15}>
                                {msg.answer}
                              </Typography>
                            </Paper>
                          </Box>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Typing indicator bubble */}
                {isTutorTyping && (
                  <motion.div
                    key="tutor-thinking"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#00A7E1",
                          color: "#1565c0",
                          width: 38,
                          height: 38,
                        }}
                      >
                        🤖
                      </Avatar>
                      <Paper
                        elevation={3}
                        sx={{
                          background: tutorBubbleGradient,
                          px: 2.2,
                          py: 1.5,
                          borderRadius: "18px 18px 20px 4px",
                          maxWidth: "62%",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{
                              display: "block",
                              width: 13,
                              height: 13,
                              borderRadius: "50%",
                              background: "#03a9f4",
                              marginRight: 3,
                              animation: "blink 1s infinite alternate",
                            }}
                          />
                          <span
                            style={{
                              display: "block",
                              width: 13,
                              height: 13,
                              borderRadius: "50%",
                              background: "#81d4fa",
                              marginRight: 3,
                              animation: "blink 1s infinite alternate 0.3s",
                            }}
                          />
                          <span
                            style={{
                              display: "block",
                              width: 13,
                              height: 13,
                              borderRadius: "50%",
                              background: "#b3e5fc",
                              animation: "blink 1s infinite alternate 0.6s",
                            }}
                          />
                          <style>{`
                          @keyframes blink {
                            0% { opacity: 0.4;}
                            100% { opacity: 1;}
                          }
                        `}</style>
                        </div>
                        <Typography
                          fontSize={12}
                          fontStyle="italic"
                          color="text.secondary"
                          mt={0.5}
                        >
                          Tutor is typing…
                        </Typography>
                      </Paper>
                    </Box>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </Box>

            {/* Input bar - PINNED TO BOTTOM */}
            <Box
              sx={{
                borderTop: "1px solid #f0f0f0",
                p: 2,
                bgcolor: "#f7f8fa",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                position: "sticky",
                bottom: 0,
                zIndex: 5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                {/* Emoji button */}
                <IconButton onClick={() => handleEmojiClick("😊")}>
                  <EmojiEmotionsIcon color="primary" />
                </IconButton>
                {/* Text input */}
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Type your message…"
                  value={input}
                  autoFocus
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  sx={{
                    background: "#fff",
                    borderRadius: "20px",
                    fontSize: "14px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <MicIcon sx={{ color: "#81d4fa" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Send button */}
                <PmsButton
                  buttonVarient="contained"
                  name={" Send"}
                  buttonClick={handleSend}
                  isDisable={input.length === 0 || isLoading}
                />
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default ChatPage;
