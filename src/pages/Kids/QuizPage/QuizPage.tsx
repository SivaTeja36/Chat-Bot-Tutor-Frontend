import React from "react";
import Quiz from "./Quiz/Quiz";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Stack direction={"row"} alignItems={"center"} m={2}>
        <IconButton onClick={() => navigate("/kids")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography fontSize={"16px"} fontWeight={500}>
          Go Back
        </Typography>
      </Stack>
      <Quiz />
    </div>
  );
};

export default QuizPage;
