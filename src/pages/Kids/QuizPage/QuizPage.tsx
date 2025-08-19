import React from 'react';
import Quiz from './Quiz/Quiz';
import { PmsButton } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PmsButton
        buttonClick={() => navigate('/kids')}
        name="Go Back"
        buttonVarient="contained"
        style={{ margin: '16px' }}
      />
      <Quiz />
    </div>
  );
};

export default QuizPage;
