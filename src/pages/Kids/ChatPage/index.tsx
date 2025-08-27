import {
  IconButton, Stack, Typography, Grid, Box, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Tooltip,
  Avatar, InputAdornment, useTheme
} from "@mui/material";
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
import { GetQuestionsHistoryResponse, IGetChatResponse } from "../../../types/api";
import useSpeechToText from "../../../hooks/useSpeechToText";
import { useParams } from "react-router-dom";

// Bubble animation config
const bubbleVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};

function ChatPage() {
  const { kidId } = useParams();
  const [messages, setMessages] = useState<GetQuestionsHistoryResponse[]>([]);
  const [input, setInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatData, setChatData] = useState<IGetChatResponse>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { isListening, transcript, startListening, stopListening } = useSpeechToText({ onTranscriptChanged: setInput });

  useEffect(() => { setInput(transcript); }, [transcript]);
  useEffect(() => () => { stopListening(); }, [stopListening]);
  const handleMicClick = () => {
    if (isListening) stopListening();
    else { setInput(""); startListening(); }
    setIsRecording(!isRecording);
  };

  const [isTutorTyping, setIsTutorTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), question: input, answer: "", created_at: new Date().toISOString() }]);
    setInput(""); setIsLoading(true); setIsTutorTyping(true);
    try {
      await kidsAPI.createQuestion(selectedChatId, { question: input });
      setTimeout(async () => {
        setIsTutorTyping(false);
        const response = await kidsAPI.getChatHistory(selectedChatId);
        setMessages(response.data.data || []);
        setIsLoading(false);
      }, 1200);
    } catch (err) {
      setIsTutorTyping(false); setIsLoading(false); console.error("Error:", err);
    }
  };

  useEffect(() => { if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading, isTutorTyping]);
  const handleGetChat = async () => {
    try { const response = await kidsAPI.getChat(Number(kidId)); setChatData(response.data.data); }
    catch (err) { console.error("Error:", err); }
  };

  useEffect(() => { handleGetChat(); }, []);
  useEffect(() => {
    const getAllChatConversation = async () => {
      if (!selectedChatId) return;
      try {
        const response = await kidsAPI.getChatHistory(selectedChatId);
        setMessages(response.data.data || []);
      } catch (error) { console.error("Error:", error); setMessages([]); }
    };
    getAllChatConversation();
  }, [selectedChatId]);

  const handleCreateChat = async () => {
    try {
      const payload = { title: chatName };
      if (isEditMode && editingChatId !== null)
        await kidsAPI.updateChat(Number(kidId), editingChatId, payload);
      else await kidsAPI.createChat(Number(kidId), payload);
      setOpenDialog(false); setChatName(""); setEditingChatId(null); setIsEditMode(false); handleGetChat();
    } catch (error) { console.error("Error:", error); }
  };

  const handleDeleteChat = async (chatId: number) => {
    if (!window.confirm("Do you want to delete this chat?")) return;
    try { await kidsAPI.deleteKChat(Number(kidId), chatId); handleGetChat(); }
    catch (err) { console.error("Error:", err); }
  };

  const handleStoreId = (id: number) => { setSelectedChatId(id); };
  const userBubbleGradient = "linear-gradient(90deg, #FFE0B2 0%, #FFCC80 100%)";
  const tutorBubbleGradient = "linear-gradient(90deg, #BBDEFB 0%, #90CAF9 100%)";
  const handleEmojiClick = (emoji: string) => setInput(cur => cur + emoji);

  return (
    <>
      {/* Add/Edit Chat Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? "Edit Chat Name" : "Add New Chat"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ md: 12, sm: 12 }}>
              <TextField
                fullWidth label="Chat Name" value={chatName}
                onChange={e => setChatName(e.target.value)} variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <PmsButton buttonVarient="outlined" name={" Cancel"} buttonClick={() => setOpenDialog(false)} />
          <PmsButton buttonVarient="contained" name={isEditMode ? "Edit" : "Create"} buttonClick={handleCreateChat} isDisable={chatName.length === 0} />
        </DialogActions>
      </Dialog>

      {/* Main Chat UI Layout */}
      <Grid container sx={{ height: "calc(100vh - 100px)", overflow: "hidden" }} spacing={0}>
        {/* Chat History Sidebar */}
        <Grid size={{ xs: 12, sm: 5, md: 4, lg: 3 }} sx={{
          borderRight: "1px solid", borderColor: "divider", bgcolor: "#f5f9fd",
          display: "flex", flexDirection: "column", p: 2, minWidth: 220, maxWidth: 330,
        }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2} mt={3}>
            <Typography variant="subtitle1" fontWeight={600}>Chat History</Typography>
          </Stack>
          <Stack spacing={2} flexGrow={1} sx={{ overflowY: "auto" }}>
            {chatData && chatData.length > 0 && chatData.map((data, idx) => {
              const isActive = selectedChatId === data.id;
              return (
                <motion.div key={data.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} py={1.3}
                    sx={{
                      borderRadius: "16px", bgcolor: isActive ? "#f0f4ff" : "white",
                      boxShadow: isActive ? "0 0 8px #c5cae940" : "none",
                      border: isActive ? "2px solid #90caf9" : "1px solid #f0f0f0",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#e3f2fd" },
                    }}
                    onClick={() => { setMessages([]); handleStoreId(data.id); }}
                  >
                    <Stack direction="row" alignItems="center" gap={1}>
                      <SmsOutlinedIcon color="primary" />
                      <Typography noWrap fontSize={15}>
                        {data.title.length > 16 ? `${data.title.substring(0, 16)}...` : data.title}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <Tooltip title="Edit"><IconButton size="small" sx={{ mr: 0.5 }} onClick={e => { e.stopPropagation(); setChatName(data.title); setEditingChatId(data.id); setIsEditMode(true); setOpenDialog(true); }}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={e => { e.stopPropagation(); handleDeleteChat(data.id); }}><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </Stack>
                </motion.div>
              );
            })}
          </Stack>
        </Grid>

        {/* Chat Main Area */}
        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9 }} sx={{
          display: "flex", flexDirection: "column", height: "100%", bgcolor: "#fafafa",
        }}>
          {/* Chat Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{
              borderBottom: "1px solid", borderColor: "divider", px: 4, py: 1, bgcolor: "#f7f8fa",
            }}>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <Avatar alt="AI Tutor" sx={{ bgcolor: "#64b5f6" }}>🤖</Avatar>
              <Typography variant="h6" color="#1976d2">Chat with Tutor</Typography>
            </Stack>
            <PmsButton buttonVarient="contained" name={" Add New Chat"} buttonClick={() => { setOpenDialog(true); setChatName(""); setMessages([]); }} startIcon={<ForumOutlinedIcon />} />
          </Stack>

          {/* Chat Messages List */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div key={`q_${msg.id}_${i}`} variants={bubbleVariants} initial="initial" animate="animate" exit={{ opacity: 0 }}>
                  {/* User message */}
                  <Box sx={{ display: "flex", flexDirection: "row-reverse", alignItems: "flex-end", gap: 1, mb: 1.4 }}>
                    <Avatar sx={{ bgcolor: "#ffcc80", color: "#5d4037", ml: 1, width: 38, height: 38, fontWeight: 700, fontSize: 20 }}>👦</Avatar>
                    <Paper elevation={2} sx={{
                      background: userBubbleGradient, px: 2.2, py: 1.5, borderRadius: "16px 18px 4px 20px", maxWidth: "68%", fontSize: 16,
                    }}><Typography fontSize={15}>{msg.question}</Typography></Paper>
                  </Box>
                  {/* Bot answer */}
                  {msg.answer && (
                    <motion.div variants={bubbleVariants} initial="initial" animate="animate">
                      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 1 }}>
                        <Avatar sx={{
                          bgcolor: "#90caf9", color: "#0d47a1", width: 38, height: 38, fontWeight: 900, fontSize: 20, border: "2px solid #e3f2fd",
                        }}>🤖</Avatar>
                        <Paper elevation={2} sx={{
                          background: tutorBubbleGradient, px: 2.4, py: 1.6, borderRadius: "18px 16px 20px 4px", maxWidth: "72%", fontSize: 16,
                        }}><Typography fontSize={15}>{msg.answer}</Typography></Paper>
                      </Box>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              {/* Typing indicator */}
              {isTutorTyping && (
                <motion.div key="tutor-thinking" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "#90caf9", color: "#0d47a1", width: 38, height: 38 }}>🤖</Avatar>
                    <Paper elevation={2} sx={{
                      background: tutorBubbleGradient, px: 2.2, py: 1.5, borderRadius: "18px 18px 20px 4px", maxWidth: "62%",
                    }}><Typography fontSize={12} fontStyle="italic" color="text.secondary">Tutor is typing…</Typography></Paper>
                  </Box>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </Box>

          {/* Input bar */}
          <Box sx={{
            borderTop: "1px solid #f0f0f0", p: 2, bgcolor: "#f7f8fa",
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton aria-label="Insert emoji" onClick={() => handleEmojiClick("😊")}>
                <EmojiEmotionsIcon color="primary" />
              </IconButton>
              <TextField
                fullWidth variant="outlined" size="small"
                placeholder={isListening ? "Listening… speak now" : "Type your message…"}
                value={input} autoFocus onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                sx={{ background: "#fff", borderRadius: "20px", fontSize: "14px", "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={isListening ? "Stop voice input" : "Speak your message"}>
                        <span>
                          <IconButton
                            aria-label={isListening ? "Stop recording" : "Start recording"}
                            onClick={handleMicClick}
                            color={isListening ? "primary" : "default"}
                            disabled={typeof window === "undefined" || !("webkitSpeechRecognition" in window)}
                          >
                            <MicIcon sx={{ color: isListening ? "red" : "#81d4fa" }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <PmsButton buttonVarient="contained" name={" Send"} buttonClick={handleSend} isDisable={input.length === 0 || isLoading} />
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ChatPage;
