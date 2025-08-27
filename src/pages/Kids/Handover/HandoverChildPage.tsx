import { Box, Paper } from "@mui/material";
import { ReactNode } from "react";
import { NavLink, useParams } from "react-router-dom";

const HandoverChildPage = ({ children }: { children: ReactNode }) => {
  const { kidId } = useParams();

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 32px)", // Adjust to fit your appbar if any
        bgcolor: "#f9fbfd",
        minHeight: 400,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          minWidth: 200,
          maxWidth: 300,
          bgcolor: "white",
          borderRight: "1px solid #ececec",
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          py: 3,
          px: 2,
          height: "100%",
        }}
      >
        <Box
          component={NavLink}
          to={`/handover/${kidId}/chat`}
          sx={{
            mb: 2,
            py: 1.5,
            px: 2,
            borderRadius: "8px",
            fontWeight: 500,
            textDecoration: "none",
            color: "text.primary",
            transition: "all 0.2s",
            "&.active": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: "bold",
            },
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          Chat
        </Box>
        <Box
          component={NavLink}
          to={`/handover/${kidId}/quiz`}
          sx={{
            mb: 2,
            py: 1.5,
            px: 2,
            borderRadius: "8px",
            fontWeight: 500,
            textDecoration: "none",
            color: "text.primary",
            transition: "all 0.2s",
            "&.active": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: "bold",
            },
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          Quiz
        </Box>
      </Box>
      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          px: 4,
          py: 3,
          minWidth: 0,
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HandoverChildPage;
