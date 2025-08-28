import { Edit } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { PmsButton } from "../../components/ui/button";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keywordRestrictionsAPI } from "../../services/api";
import { GetKeywordRestrictionResponse, KeywordRestrictionRequest } from "../../types/api";
import {
  Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from "@mui/material";

const RestrictionsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedRestriction, setSelectedRestriction] = useState<GetKeywordRestrictionResponse | null>(null);

  const { data: restrictions, isLoading } = useQuery({
    queryKey: ["restrictions"],
    queryFn: () => keywordRestrictionsAPI.getAllRestrictions(),
  });

  const createMutation = useMutation({
    mutationFn: keywordRestrictionsAPI.createRestriction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restrictions"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { restrictionId: number; newData: KeywordRestrictionRequest }) =>
      keywordRestrictionsAPI.updateRestriction(data.restrictionId, data.newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restrictions"] });
      setOpen(false);
    },
  });

  const handleOpen = (restriction: GetKeywordRestrictionResponse | null = null) => {
    setSelectedRestriction(restriction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRestriction(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Collect values
    const title = formData.get("title") as string;
    // Split comma-separated keywords and trim whitespace
    const keywords = (formData.get("keywords") as string).split(",").map(k => k.trim()).filter(Boolean);

    const data: KeywordRestrictionRequest = {
      title,
      keywords,
    };

    if (selectedRestriction) {
      updateMutation.mutate({ restrictionId: selectedRestriction.id, newData: data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <PmsButton buttonVarient="contained" name={"Create Restriction"} buttonClick={() => handleOpen()} />
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            Keyword Restrictions
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Keywords</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {restrictions?.data.data.map((restriction: GetKeywordRestrictionResponse) => (
                  <TableRow key={restriction.id}>
                    <TableCell>{restriction.title}</TableCell>
                    <TableCell>{restriction.keywords.join(", ")}</TableCell>
                    <TableCell>
                      <PmsButton buttonVarient="outlined" name={"Update"} buttonClick={() => handleOpen(restriction)} startIcon={<Edit />} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRestriction ? "Update" : "Create"} Restriction</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              defaultValue={selectedRestriction?.title || ""}
            />
            <TextField
              margin="dense"
              name="keywords"
              label="Keywords (comma-separated)"
              type="text"
              fullWidth
              defaultValue={selectedRestriction?.keywords?.join(", ") || ""}
            />
          </DialogContent>
          <DialogActions>
            <PmsButton buttonVarient="outlined" name={"Cancel"} buttonClick={handleClose} />
            <PmsButton buttonVarient="contained" name={selectedRestriction ? "Update" : "Create"} type="submit" />
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};

export default RestrictionsTab;
