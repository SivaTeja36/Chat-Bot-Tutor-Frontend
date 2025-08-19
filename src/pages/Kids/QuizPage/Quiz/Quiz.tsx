import React, { useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { PmsButton } from '../../../../components/ui/button'; // Adjust import if necessary

const quizData = {
  maths: [
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      answer: '4',
    },
    {
      question: 'What is 5 * 5?',
      options: ['20', '25', '30', '35'],
      answer: '25',
    },
    {
      question: 'What is 10 - 3?',
      options: ['6', '7', '8', '9'],
      answer: '7',
    },
    {
      question: 'What is 12 / 4?',
      options: ['2', '3', '4', '5'],
      answer: '3',
    },
    {
      question: 'What is 8 * 2?',
      options: ['14', '16', '18', '20'],
      answer: '16',
    },
    {
      question: 'What is 15 + 5?',
      options: ['18', '20', '22', '24'],
      answer: '20',
    },
    {
      question: 'What is 20 - 11?',
      options: ['7', '8', '9', '10'],
      answer: '9',
    },
    {
      question: 'What is 7 * 3?',
      options: ['18', '21', '24', '27'],
      answer: '21',
    },
    {
      question: 'What is 30 / 5?',
      options: ['4', '5', '6', '7'],
      answer: '6',
    },
    {
      question: 'What is 9 + 9?',
      options: ['16', '17', '18', '19'],
      answer: '18',
    },
  ],
  science: [
    {
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'O2', 'NaCl'],
      answer: 'H2O',
    },
    {
      question: 'What planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      answer: 'Mars',
    },
    {
      question: 'What is the largest organ in the human body?',
      options: ['Heart', 'Liver', 'Skin', 'Lungs'],
      answer: 'Skin',
    },
    {
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
      answer: 'Mitochondrion',
    },
    {
      question: 'What gas do plants absorb from the atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
      answer: 'Carbon Dioxide',
    },
    {
      question: 'What is the boiling point of water in Celsius?',
      options: ['90°C', '100°C', '110°C', '120°C'],
      answer: '100°C',
    },
    {
      question: 'What is the hardest natural substance on Earth?',
      options: ['Gold', 'Iron', 'Diamond', 'Quartz'],
      answer: 'Diamond',
    },
    {
      question: 'How many bones are in the adult human body?',
      options: ['206', '208', '210', '212'],
      answer: '206',
    },
    {
      question: 'What is the chemical formula for table salt?',
      options: ['H2O', 'CO2', 'NaCl', 'C6H12O6'],
      answer: 'NaCl',
    },
    {
      question: 'What type of star is the Sun?',
      options: ['Red Giant', 'White Dwarf', 'Yellow Dwarf', 'Blue Giant'],
      answer: 'Yellow Dwarf',
    },
  ],
  social: [
    {
      question: 'Who was the first president of the United States?',
      options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
      answer: 'George Washington',
    },
    {
      question: 'What is the largest country in the world by area?',
      options: ['China', 'Russia', 'Canada', 'United States'],
      answer: 'Russia',
    },
    {
      question: 'In which country are the pyramids of Giza located?',
      options: ['Mexico', 'Egypt', 'Peru', 'Sudan'],
      answer: 'Egypt',
    },
    {
      question: 'Who wrote the play Romeo and Juliet?',
      options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
      answer: 'William Shakespeare',
    },
    {
      question: 'What was the name of the ship that carried the Pilgrims to America in 1620?',
      options: ['Santa Maria', 'Mayflower', 'Titanic', 'Endeavour'],
      answer: 'Mayflower',
    },
    {
      question: 'Which ancient civilization built the city of Machu Picchu?',
      options: ['Aztec', 'Maya', 'Inca', 'Roman'],
      answer: 'Inca',
    },
    {
      question: 'The Renaissance was a period of great cultural change and artistic development that began in which country?',
      options: ['France', 'Italy', 'Spain', 'Greece'],
      answer: 'Italy',
    },
    {
      question: 'Who was the first person to walk on the moon?',
      options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'],
      answer: 'Neil Armstrong',
    },
    {
      question: 'The ancient Olympic Games originated in which country?',
      options: ['Rome', 'Egypt', 'Greece', 'China'],
      answer: 'Greece',
    },
    {
      question: 'What is the name of the river that flows through London?',
      options: ['River Thames', 'River Severn', 'River Trent', 'River Clyde'],
      answer: 'River Thames',
    },
  ],
  'general knowledge': [
    {
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Madrid', 'Paris'],
      answer: 'Paris',
    },
    {
      question: 'What is the tallest mountain in the world?',
      options: ['K2', 'Kangchenjunga', 'Lhotse', 'Mount Everest'],
      answer: 'Mount Everest',
    },
    {
      question: 'Which is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
      answer: 'Pacific Ocean',
    },
    {
      question: 'What is the name of the largest desert in the world?',
      options: ['Sahara Desert', 'Arabian Desert', 'Gobi Desert', 'Antarctic Polar Desert'],
      answer: 'Antarctic Polar Desert',
    },
    {
      question: 'Who painted the Mona Lisa?',
      options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
      answer: 'Leonardo da Vinci',
    },
    {
      question: 'How many continents are there in the world?',
      options: ['5', '6', '7', '8'],
      answer: '7',
    },
    {
      question: 'What is the currency of Japan?',
      options: ['Yuan', 'Won', 'Yen', 'Dollar'],
      answer: 'Yen',
    },
    {
      question: 'What is the smallest country in the world?',
      options: ['Monaco', 'Nauru', 'Vatican City', 'San Marino'],
      answer: 'Vatican City',
    },
    {
      question: 'What is the most spoken language in the world?',
      options: ['Spanish', 'Mandarin Chinese', 'English', 'Hindi'],
      answer: 'Mandarin Chinese',
    },
    {
      question: 'Which planet in our solar system is known for its rings?',
      options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      answer: 'Saturn',
    },
  ],
};

const Quiz: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<keyof typeof quizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubjectSelection = (subject: keyof typeof quizData) => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSubmitted(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedSubject) {
      const currentQuestion = quizData[selectedSubject][currentQuestionIndex];
      if (answer === currentQuestion.answer) {
        setScore(score + 1);
      }
      if (currentQuestionIndex < quizData[selectedSubject].length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setSubmitted(true);
      }
    }
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent>
          {!selectedSubject ? (
            <div className="text-center">
              <Typography variant="h4" component="h1" gutterBottom>
                Choose a Subject
              </Typography>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <PmsButton buttonVarient="contained" name="Maths" buttonClick={() => handleSubjectSelection('maths')} />
                <PmsButton buttonVarient="contained" name="Science" buttonClick={() => handleSubjectSelection('science')} />
                <PmsButton buttonVarient="contained" name="Social" buttonClick={() => handleSubjectSelection('social')} />
                <PmsButton buttonVarient="contained" name="General Knowledge" buttonClick={() => handleSubjectSelection('general knowledge')} />
              </div>
            </div>
          ) : submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Typography variant="h4" component="h1" gutterBottom>
                {score > quizData[selectedSubject].length / 2 ? 'Congratulations!' : 'Good Try!'}
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                You scored {score} out of {quizData[selectedSubject].length}
              </Typography>
              <PmsButton buttonVarient="contained" name="Play Again" buttonClick={() => setSelectedSubject(null)} />
            </motion.div>
          ) : (
            <div>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedSubject.toUpperCase()}
              </Typography>
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentQuestionIndex / quizData[selectedSubject].length) * 100}
                />
              </Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {quizData[selectedSubject][currentQuestionIndex].question}
              </Typography>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {quizData[selectedSubject][currentQuestionIndex].options.map((option) => (
                  <PmsButton
                    key={option}
                    buttonVarient="outlined"
                    name={option}
                    buttonClick={() => handleAnswer(option)}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
