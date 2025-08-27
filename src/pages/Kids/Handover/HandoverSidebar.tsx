
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Chat, Quiz } from "@mui/icons-material";
import Logo from "../../../assets/chatbot.png";

const HandoverSidebar: React.FC = () => {
  const { kidId } = useParams();

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
    </Box>
  );
};

export default HandoverSidebar;
