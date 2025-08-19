/* eslint-disable react-hooks/exhaustive-deps */
import {
  IconButton,
  Stack,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useRef, useState } from "react";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { kidsAPI } from "../../../services/api";
import {
  GetQuestionsHistoryResponse,
  IGetChat,
  IGetChatResponse,
} from "../../../types/api";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { PmsButton } from "../../../components/ui/button";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

interface IChatPageProps {
  setKidPage: (value: React.SetStateAction<string>) => void;
  kidId: number;
}

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

  const handleSend = async () => {
    const userMessage = { text: input, from: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true); // show "thinking..." while waiting

    try {
      const payload = { question: input };
      await kidsAPI.createQuestion(selectedChatId, payload);

      // Refresh conversation from server
      const response = await kidsAPI.getChatHistory(selectedChatId);
      setMessages(response.data.data || []);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getAllChatConversation = async () => {
      if (!selectedChatId) return;

      try {
        const response = await kidsAPI.getChatHistory(selectedChatId);
        // assuming API returns something like { data: { data: [{ text, from }, ...] } }
        setMessages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setMessages([]);
      }
    };

    getAllChatConversation();
  }, [selectedChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleCreateChat = async () => {
    try {
      const payload = {
        title: chatName,
      };

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

  const handleGetChat = async () => {
    try {
      const response = await kidsAPI.getChat(kidId);
      const chats = response.data.data; // This is your array of chats

      // Log all titles
      chats?.forEach((chat) => console.log(chat.title));

      // Or if you want an array of titles
      const titles = chats?.map((chat: IGetChat) => chat.title);
      console.log(titles);

      // Set chatData as usual
      setChatData(chats);
    } catch (err) {
      console.error("Error fetching chat data:", err);
    }
  };

  useEffect(() => {
    handleGetChat();
  }, []);

  console.log(chatData, "cjaa");

  const handleDeleteChat = async (chatId: number) => {
    const confirmed = window.confirm("Do you want to delete this chat?");
    if (!confirmed) return;

    try {
      await kidsAPI.deleteKChat(kidId, chatId);
      handleGetChat(); // Refresh chat list
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const handleStoreId = (id: number) => {
    setSelectedChatId(id);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New chat name</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateChat}
            variant="contained"
            disabled={chatName.length === 0}
          >
            {isEditMode ? "Edit" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container sx={{ height: "86vh" }} spacing={2}>
        {/* Sidebar */}
        <Grid
          size={{ lg: 3, md: 5, sm: 5, xs: 12 }}
          sx={{
            // bgcolor: "grey.100",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <IconButton onClick={() => setKidPage("kidPage")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={600}>
              Chat History
            </Typography>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            {chatData &&
              chatData.length > 0 &&
              chatData.map((data) => {
                const isActive = selectedChatId === data.id;

                return (
                  <Stack
                    key={data.id}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={1}
                    px={2}
                    py={1}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      bgcolor: isActive ? "#2196f314" : "transparent",
                      "&:hover": {
                        bgcolor: isActive ? "transparent" : "#efefef",
                      },
                    }}
                    onClick={() => {
                      setMessages([]);
                      handleStoreId(data.id);
                    }}
                  >
                    {/* Left side with icon + title */}
                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                      <SmsOutlinedIcon fontSize="small" />
                      <Tooltip
                        title={data.title}
                        placement="right"
                        disableHoverListener={data.title.length <= 10}
                      >
                        <Typography noWrap>
                          {data.title.length > 10
                            ? `${data.title.substring(0, 10)}...`
                            : data.title}
                        </Typography>
                      </Tooltip>
                    </Stack>

                    {/* Right side with edit + delete */}
                    <Stack direction={"row"} alignItems={"center"}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatName(data.title);
                          setEditingChatId(data.id);
                          setIsEditMode(true);
                          setOpenDialog(true);
                        }}
                      >
                        <EditOutlinedIcon
                          fontSize="small"
                          sx={{ color: "#202124" }}
                        />
                      </IconButton>

                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(data.id);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon
                          fontSize="small"
                          sx={{ color: "#202124" }}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                );
              })}
          </Stack>
        </Grid>

        {/* Main Chat Area */}
        <Grid
          size={{ lg: 9, md: 7, sm: 7, xs: 12 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          {/* Header */}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6">Chat with Tutor</Typography>
            <PmsButton
              buttonVarient="contained"
              name={"Add New Chat"}
              buttonClick={() => {
                setOpenDialog(true);
                setChatName("");
                setMessages([]);
              }}
            />
          </Stack>

          {/* Chat messages area (fixed height + scrollable) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              height: "65vh",
              overflowY: "auto",
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                {/* User question (left) */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Paper
                    sx={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      maxWidth: "70%",
                      bgcolor: "#e0f7fa",
                      boxShadow: "none",
                    }}
                  >
                    <Typography fontSize={"14px"}>{msg.question}</Typography>
                  </Paper>
                </Box>

                {/* Bot answer (right) */}
                {msg.answer && (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Paper
                      sx={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        maxWidth: "40%",
                        bgcolor: "#f1f8e9",
                        boxShadow: "none",
                      }}
                    >
                      <Typography fontSize={"14px"}>{msg.answer}</Typography>
                    </Paper>
                  </Box>
                )}
              </Box>
            ))}

            {isLoading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}
              >
                <Paper
                  sx={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    bgcolor: "#f1f8e9",
                    boxShadow: "none",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontStyle="italic"
                    color="text.secondary"
                  >
                    Tutor is thinking...
                  </Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Grid container>
            <Grid
              size={{ md: 12 }}
              sx={{
                borderTop: "1px solid",
                borderColor: "divider",
                p: 2,
                bgcolor: "background.paper",
                position: "sticky",
                bottom: "1%",
              }}
            >
              <Stack direction="row" spacing={1} width={"100%"}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  style={{
                    flex: 1,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "12px",
                  }}
                />

                <PmsButton
                  buttonVarient="contained"
                  name={"Send"}
                  buttonClick={handleSend}
                  isDisable={input.length === 0}
                />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ChatPage;
