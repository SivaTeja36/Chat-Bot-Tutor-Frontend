import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // must return an object with logout

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background: "002979",
    color: "#fff",
    boxShadow: "4px 0 20px rgba(23,165,255,0.15)",
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "rgba(41,121,255,0.15)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(41,121,255,0.25)",
    "&:hover": {
      backgroundColor: "rgba(41,121,255,0.35)",
    },
  },
}));

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <StyledDrawer
      variant="permanent"
      sx={{
        borderRadius: "0px",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRadius: "0px",
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 64px)",
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <StyledListItemButton component={Link} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon sx={{ color: "#82B1FF" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton component={Link} to="/kids">
              <ListItemIcon>
                <ChildCareIcon sx={{ color: "#82B1FF" }} />
              </ListItemIcon>
              <ListItemText primary="Kids" />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton component={Link} to="/profile">
              <ListItemIcon>
                <PersonIcon sx={{ color: "#82B1FF" }} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </StyledListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <List>
          <ListItem disablePadding>
            <StyledListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: "#FF5252" }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </StyledListItemButton>
          </ListItem>
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
