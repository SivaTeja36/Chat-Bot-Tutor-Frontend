import React from "react";
import HandoverChildPage from "./HandoverChildPage";
import QuizPage from "../QuizPage/Quiz/Quiz";

const QuizPageWrapper: React.FC = () => (
  <HandoverChildPage>
    <QuizPage />
  </HandoverChildPage>
);

export default QuizPageWrapper;
