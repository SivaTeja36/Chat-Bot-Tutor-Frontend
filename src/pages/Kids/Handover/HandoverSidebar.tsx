
import React from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Chat, Quiz, Logout } from "@mui/icons-material";
import Logo from "../../../assets/chatbot.png";

const HandoverSidebar: React.FC = () => {
  const { kidId } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("handedOverKidId_2025");
    navigate("/verify-email");
  };

  const menuItems = [
    { text: "Chat", icon: <Chat />, path: `/handover/${kidId}/chat` },
    { text: "Quiz", icon: <Quiz />, path: `/handover/${kidId}/quiz` },
  ];

  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#002979",
        boxShadow: "4px 0 12px rgba(25, 118, 210, 0.1)",
        borderRight: "none",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-3">
            <img width={"80%"} src={Logo} alt="Logo" />
          </Box>
        </Box>
      </Box>
      <Box sx={{ flex: 1, p: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: "8px",
                  color: "#fff",
                  "&.active": {
                    backgroundColor: "#2A58AD",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(33, 150, 243, 0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "primary.contrastText", minWidth: "40px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: "400",
                    color: "#efefef",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: "12px",
              color: "error.main",
              "&:hover": {
                backgroundColor: "#2A58AD",
                color: "error.contrastText",
              },
            }}
          >
            <ListItemIcon
              sx={{ color: "primary.contrastText", minWidth: "40px" }}
            >
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontWeight: "400", color: "#fff" }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default HandoverSidebar;
