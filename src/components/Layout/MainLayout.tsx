/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  ChildCare,
  Person,
  Logout,
} from "@mui/icons-material";
import { authAPI } from "../../services/api";
import Logo from "../../assets/chatbot.png";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const drawerWidth = 280;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // FIX: Check status_message
        const response = await authAPI.getUserInfo();
        if (response.data.status_message === "SUCCESS") {
          setUserInfo(response.data.data);
        } else {
          setError(response.data.data.name || "Failed to fetch user info");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching user info");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleLogout = () => {
    navigate("/verify-email");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Kids", icon: <ChildCare />, path: "/kids" },
    { text: "Profile", icon: <Person />, path: "/profile" },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#002979",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Box className="flex items-center justify-between">
          <Box className="flex items-center space-x-3">
            <img width={"80%"} src={Logo} alt="" />
          </Box>
          {!isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
              <KeyboardDoubleArrowLeftIcon style={{ color: "#fff" }} />
            </IconButton>
          )}
        </Box>
      </Box>
      {/* Navigation */}
      <Box sx={{ flex: 1, p: 1 }}>
        <List>
          {menuItems.map((item) => (
            <motion.div
              key={item.text}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor:
                      location.pathname === item.path
                        ? "#2A58AD"
                        : "transparent",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor:
                        location.pathname === item.path
                          ? "primary.dark"
                          : "rgba(33, 150, 243, 0.08)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        location.pathname === item.path
                          ? "primary.contrastText"
                          : "primary.main",
                      minWidth: "40px",
                    }}
                  >
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
            </motion.div>
          ))}
        </List>
      </Box>
      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
        </motion.div>
      </Box>
    </Box>
  );

  const displayName = userInfo?.name || userInfo?.email || "Guest";
  const displayEmail = userInfo?.email || "xyz@gmail.com";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
          color: "text.primary",
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.1)",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: desktopOpen ? "none" : "block" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "primary.main" }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              "BrightSpark Tutor"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {loading ? (
              <CircularProgress size={20} color="primary" />
            ) : error ? (
              <Typography
                variant="body2"
                color="error"
                sx={{ fontWeight: 500 }}
              >
                {error}
              </Typography>
            ) : (
              <>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "#002979",
                    fontWeight: 600,
                  }}
                >
                  {avatarInitial}
                </Avatar>
                <Stack>
                  <Typography
                    fontSize={"16px"}
                    sx={{
                      display: { xs: "none", sm: "block" },
                      fontWeight: 500,
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    fontSize={"12px"}
                    color="textDisabled"
                    sx={{
                      display: { xs: "none", sm: "block" },
                      fontWeight: 500,
                    }}
                  >
                    {displayEmail}
                  </Typography>
                </Stack>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: desktopOpen ? drawerWidth : 0 },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "4px 0 12px rgba(25, 118, 210, 0.1)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
};

export default MainLayout;
