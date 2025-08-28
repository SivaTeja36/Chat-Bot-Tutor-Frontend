import { formatDate } from "../../utils/date";
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
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip
} from "@mui/material";

const RestrictionsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openKeywords, setOpenKeywords] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
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

  const handleOpenKeywords = (keywords: string[]) => {
    setSelectedKeywords(keywords);
    setOpenKeywords(true);
  };

  const handleCloseKeywords = () => {
    setOpenKeywords(false);
    setSelectedKeywords([]);
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
      <Card sx={{ minHeight: '200px' }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 2 }}>
            Keyword Restrictions
          </Typography>
          <TableContainer>
            <Table sx={{ "& .MuiTableCell-root": { padding: '12px 16px' } }}>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Keywords</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {restrictions?.data.data.map((restriction: GetKeywordRestrictionResponse, index: number) => (
                  <TableRow key={restriction.id} sx={{ "&:hover": { backgroundColor: '#f9f9f9' }, backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5' }}>
                    <TableCell>{restriction.title}</TableCell>
                    <TableCell>
                      <PmsButton buttonVarient="outlined" name={`${restriction.keywords.length} keywords`} buttonClick={() => handleOpenKeywords(restriction.keywords)} />
                    </TableCell>
                    <TableCell>{formatDate(restriction.created_at)}</TableCell>
                    <TableCell>{formatDate(restriction.updated_at)}</TableCell>
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

      <Dialog open={openKeywords} onClose={handleCloseKeywords}>
        <DialogTitle>Keywords</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {selectedKeywords.map((keyword, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Chip label={keyword} variant="outlined" />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <PmsButton buttonVarient="outlined" name={"Close"} buttonClick={handleCloseKeywords} />
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default RestrictionsTab;
