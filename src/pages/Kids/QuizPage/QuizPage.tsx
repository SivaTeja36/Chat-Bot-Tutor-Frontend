import React from "react";
import Quiz from "./Quiz/Quiz";
import HandoverChildPage from "../Handover/HandoverChildPage";

const QuizPage: React.FC = () => {
  return (
    <HandoverChildPage>
      <Quiz />
    </HandoverChildPage>
  );
};

export default QuizPage;