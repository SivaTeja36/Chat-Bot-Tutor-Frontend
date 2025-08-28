import { motion } from "framer-motion";
import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import RestrictionsTab from "./RestrictionsTab";
import KidRestrictionsTab from "./KidRestrictionsTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RestrictionsPage: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="restrictions tabs">
            <Tab label="Restrictions" />
            <Tab label="Kid Restrictions" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <RestrictionsTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <KidRestrictionsTab />
        </TabPanel>
      </Box>
    </motion.div>
  );
};

export default RestrictionsPage;
