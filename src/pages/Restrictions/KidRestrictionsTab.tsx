import { formatDate } from "../../utils/date";
import { Edit, Delete } from "@mui/icons-material";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { PmsButton } from "../../components/ui/button";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keywordRestrictionsAPI, kidsAPI } from "../../services/api";
import {
  GetKidKeywordRestrictionResponse,
  GetKeywordRestrictionResponse,
  GetKidResponse,
} from "../../types/api";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel, Chip, Tooltip
} from "@mui/material";

const KidRestrictionsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openKeywords, setOpenKeywords] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedKidRestriction, setSelectedKidRestriction] =
    useState<GetKidKeywordRestrictionResponse | null>(null);

  const { data: kidRestrictions, isLoading: isLoadingKidRestrictions, isError: isErrorKidRestrictions } = useQuery({
    queryKey: ["kidRestrictions"],
    queryFn: () => keywordRestrictionsAPI.getAllKidsKeywordRestrictions(),
  });

  const { data: kids, isLoading: isLoadingKids, isError: isErrorKids } = useQuery({
    queryKey: ["kids"],
    queryFn: () => kidsAPI.getAllKids(),
  });

  const { data: restrictions, isLoading: isLoadingRestrictions, isError: isErrorRestrictions } = useQuery({
    queryKey: ["restrictions"],
    queryFn: () => keywordRestrictionsAPI.getAllRestrictions(),
  });

  const mapMutation = useMutation({
    mutationFn: (data: { restrictionId: number; kidId: number }) =>
      keywordRestrictionsAPI.mapRestrictionToKid(data.restrictionId, data.kidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kidRestrictions"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { restrictionId: number; kidId: number }) =>
      keywordRestrictionsAPI.updateMappedRestrictionForKid(data.restrictionId, data.kidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kidRestrictions"] });
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data: { restrictionId: number; kidId: number }) =>
      keywordRestrictionsAPI.deleteMappedRestrictionForKid(data.restrictionId, data.kidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kidRestrictions"] });
    },
  });

  const handleOpen = (kidRestriction: GetKidKeywordRestrictionResponse | null = null) => {
    setSelectedKidRestriction(kidRestriction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedKidRestriction(null);
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
    const data = {
      restrictionId: Number(formData.get("restrictionId")),
      kidId: Number(formData.get("kidId")),
    };

    if (selectedKidRestriction) {
      updateMutation.mutate(data);
    } else {
      mapMutation.mutate(data);
    }
  };

  const handleDelete = (restrictionId: number, kidId: number) => {
    deleteMutation.mutate({ restrictionId, kidId });
  };

  if (isLoadingKidRestrictions || isLoadingKids || isLoadingRestrictions)
    return <div>Loading...</div>;

  if (isErrorKidRestrictions || isErrorKids || isErrorRestrictions)
    return <div>Error fetching data.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1, mx: 2 }}>
        <PmsButton buttonVarient="contained" name={"Map Restriction to Kid"} buttonClick={() => handleOpen()} />
      </Box>
      <Card sx={{ minHeight: '400px', width: '100%', px: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 2 }} color="#002979">
            Kid Keyword Restrictions
          </Typography>
          <TableContainer>
            <Table sx={{ "& .MuiTableCell-root": { padding: '12px 16px' } }}>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kid</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Restriction</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Updated At</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kidRestrictions?.data.data.map((kidRestriction, index: number) => (
                  <TableRow
                    key={`${kidRestriction.kid.id}-${kidRestriction.keyword_restrictions.id}`}
                    sx={{ "&:hover": { backgroundColor: '#f9f9f9' }, backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5' }}
                  >
                    <TableCell>{kidRestriction.kid.name}</TableCell>
                    <TableCell>
                      <PmsButton buttonVarient="outlined" name={`${kidRestriction.keyword_restrictions.keywords.length} keywords`} buttonClick={() => handleOpenKeywords(kidRestriction.keyword_restrictions.keywords)} />
                    </TableCell>
                    <TableCell>{formatDate(kidRestriction.keyword_restrictions.created_at)}</TableCell>
                    <TableCell>{formatDate(kidRestriction.keyword_restrictions.updated_at)}</TableCell>
                    <TableCell>
                      <PmsButton buttonVarient="outlined" name={"Update"} buttonClick={() => handleOpen(kidRestriction)} startIcon={<Edit />} />
                      <PmsButton buttonVarient="outlined" name={"Delete"} buttonClick={() => handleDelete(kidRestriction.keyword_restrictions.id, kidRestriction.kid.id)} startIcon={<Delete />} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle component={motion.h6} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {selectedKidRestriction ? "Update" : "Map"} Restriction to Kid
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Kid</InputLabel>
              <Select
                name="kidId"
                defaultValue={selectedKidRestriction?.kid.id || ""}
                variant="outlined"
              >
                {kids?.data.data.map((kid: GetKidResponse) => (
                  <MenuItem key={kid.id} value={kid.id}>
                    {kid.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Restriction</InputLabel>
              <Select
                name="restrictionId"
                defaultValue={selectedKidRestriction?.keyword_restrictions.id || ""}
                variant="outlined"
              >
                {restrictions?.data.data.map(
                  (restriction: GetKeywordRestrictionResponse) => (
                    <MenuItem key={restriction.id} value={restriction.id}>
                      <Tooltip title={restriction.keywords.join(", ")}>
                        <Typography noWrap>
                          {restriction.title}
                          {restriction.keywords.length > 0 && (
                            <> ({restriction.keywords.slice(0, 3).join(", ")}{restriction.keywords.length > 3 ? '...' : ''})</>
                          )}
                        </Typography>
                      </Tooltip>
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <PmsButton buttonVarient="outlined" name={"Cancel"} buttonClick={handleClose} />
            <PmsButton buttonVarient="contained" name={selectedKidRestriction ? "Update" : "Map"} type="submit" />
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openKeywords} onClose={handleCloseKeywords} maxWidth="xs" fullWidth>
        <DialogTitle>Keywords</DialogTitle>
        <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {selectedKeywords.map((keyword, index) => (
            <Box key={index}>
              <Stack p={ 1 } borderRadius={"4px"} sx={{backgroundColor: "#002979", justifyContent: "center", width: "100%"}}>
                <Typography textAlign={"center"} color="white">
                  {keyword}
                </Typography>
                </Stack>
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

export default KidRestrictionsTab;
