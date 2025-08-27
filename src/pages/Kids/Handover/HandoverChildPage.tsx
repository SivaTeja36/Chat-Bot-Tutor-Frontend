import { Box } from "@mui/material";
import { ReactNode } from "react";
import HandoverSidebar from "./HandoverSidebar";

const HandoverChildPage = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#f9fbfd",
      }}
    >
      <HandoverSidebar />
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HandoverChildPage;
