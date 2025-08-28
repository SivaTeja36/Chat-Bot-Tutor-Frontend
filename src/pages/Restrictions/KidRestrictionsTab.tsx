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
  InputLabel,
} from "@mui/material";

const KidRestrictionsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedKidRestriction, setSelectedKidRestriction] =
    useState<GetKidKeywordRestrictionResponse | null>(null);

  const { data: kidRestrictions, isLoading: isLoadingKidRestrictions } = useQuery({
    queryKey: ["kidRestrictions"],
    queryFn: () => keywordRestrictionsAPI.getAllKidsKeywordRestrictions(),
  });

  const { data: kids, isLoading: isLoadingKids } = useQuery({
    queryKey: ["kids"],
    queryFn: () => kidsAPI.getAllKids(),
  });

  const { data: restrictions, isLoading: isLoadingRestrictions } = useQuery({
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

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <PmsButton buttonVarient="contained" name={"Map Restriction to Kid"} buttonClick={() => handleOpen()} />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kid</TableCell>
              <TableCell>Restriction</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kidRestrictions?.data.data.map((kidRestriction) => (
              <TableRow
                key={`${kidRestriction.kid.id}-${kidRestriction.keyword_restrictions.id}`}
              >
                <TableCell>{kidRestriction.kid.name}</TableCell>
                <TableCell>
                  {/* You can display title or join keywords */}
                  {kidRestriction.keyword_restrictions.title}
                  {kidRestriction.keyword_restrictions.keywords.length > 0 && (
                    <> ({kidRestriction.keyword_restrictions.keywords.join(", ")})</>
                  )}
                </TableCell>
                <TableCell>
                  <PmsButton buttonVarient="outlined" name={"Update"} buttonClick={() => handleOpen(kidRestriction)} />
                  <PmsButton buttonVarient="outlined" name={"Delete"} buttonClick={() => handleDelete(kidRestriction.keyword_restrictions.id, kidRestriction.kid.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedKidRestriction ? "Update" : "Map"} Restriction to Kid
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Kid</InputLabel>
              <Select
                name="kidId"
                defaultValue={selectedKidRestriction?.kid.id || ""}
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
              >
                {restrictions?.data.data.map(
                  (restriction: GetKeywordRestrictionResponse) => (
                    <MenuItem key={restriction.id} value={restriction.id}>
                      {restriction.title}
                      {restriction.keywords.length > 0 && (
                        <> ({restriction.keywords.join(", ")})</>
                      )}
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
    </div>
  );
};

export default KidRestrictionsTab;
