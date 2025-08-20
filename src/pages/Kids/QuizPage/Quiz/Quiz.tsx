import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Paper,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { PmsButton } from '../../../../components/ui/button';

// ---- Quiz Data ---- 
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

const subjectMeta = [
  { key: 'maths',   label: 'Maths',   icon: '🧮' },
  { key: 'science', label: 'Science', icon: '🔬' },
  { key: 'social',  label: 'Social',  icon: '🌍' },
  { key: 'general knowledge', label: 'General Knowledge', icon: '🎓' },
];

const celebrationMessages = [
  "Amazing job! 🎉",
  "You’re a superstar! ⭐️",
  "Fantastic! 🤩",
  "Well done! 🏆",
  "Bravo! 👏",
  "Genius at work! 🧠",
];

const wrongAnswerShake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.45 }
};

const getBGGradient = () =>
  "#FFFFFF"; // Use same white background as main application

const Quiz: React.FC = () => {
  const theme = useTheme();
  const [selectedSubject, setSelectedSubject] = useState<keyof typeof quizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongAnimate, setWrongAnimate] = useState(0);

  const getCelebrationMessage = () => {
    if (score >= ((selectedSubject && quizData[selectedSubject].length) || 0) * 0.7) {
      return celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    }
    return "Keep Practicing! 🌈";
  };

  const handleSubjectSelection = (subject: keyof typeof quizData) => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSubmitted(false);
    setShowConfetti(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answer: string) => {
    if (!selectedSubject || showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQuestion = quizData[selectedSubject][currentQuestionIndex];
    if (answer === currentQuestion.answer) {
      setTimeout(() => {
        setScore(prev => prev + 1);
        goToNextQuestion();
      }, 800);
    } else {
      setWrongAnimate(wrongAnimate + 1);
      setTimeout(() => goToNextQuestion(), 1200);
    }
  };

  const goToNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (selectedSubject) {
      if (currentQuestionIndex < quizData[selectedSubject].length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setSubmitted(true);
        setShowConfetti(true);
      }
    }
  };

  const handlePlayAgain = () => {
    setSelectedSubject(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSubmitted(false);
    setShowConfetti(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        width: "100vw",
        minHeight: "100vh",
        background: getBGGradient(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden !important",
        zIndex: 0,
        p: 2,
        m: 0
      }}
    >
      {/* Confetti */}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={500} recycle={false} />
      )}

      <Card
        sx={{
          width: "100%",
          maxWidth: 430,
          mx: "auto",
          borderRadius: 4,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          background: "#FFFFFF",
          p: { xs: 2, sm: 2.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 40, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
      >
        <CardContent sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          px: { xs: 1, sm: 2 },
          py: { xs: 2, sm: 2 }
        }}>
          <AnimatePresence mode="wait">
            {/* SUBJECT SELECT SCREEN */}
            {!selectedSubject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                style={{ width: "100%" }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  fontWeight={700}
                  color="#2196F3"
                  sx={{ mb: 2.5, mt: 1, letterSpacing: 1, textAlign: "center" }}
                >
                  <span role="img" aria-label="rocket">🚀</span> Choose a Subject
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  {subjectMeta.map((sub, i) => (
                    <motion.div
                      key={sub.key}
                      whileHover={{ scale: 1.07, borderColor: "#287af9" }}
                      whileTap={{ scale: 0.96 }}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.07 * i }}
                      style={{
                        borderRadius: 12,
                        border: "2px solid #2196F3",
                        background: "#FFFFFF",
                        minHeight: 80,
                        cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onClick={() => handleSubjectSelection(sub.key as keyof typeof quizData)}
                    >
                      <span style={{ fontSize: 33, marginBottom: 6 }}>{sub.icon}</span>
                      <Typography fontWeight={700} fontSize={17} color="#212121">{sub.label}</Typography>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            )}
            {/* COMPLETION / CELEBRATION SCREEN */}
            {selectedSubject && submitted && (
              <motion.div
                key="celebration"
                initial={{ opacity: 0, scale: 0.95, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 24 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={{ minHeight: 280, width: "100%", textAlign: "center" }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -34 }}
                  animate={{ scale: 1.1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.45, duration: 0.9 }}
                  style={{ fontSize: "3.3rem" }}
                >🥳</motion.div>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#2196F3", mt: 1.5 }}
                  gutterBottom
                >
                  {score > quizData[selectedSubject].length / 2
                    ? getCelebrationMessage() : "Nice Try! 🚀"}
                </Typography>
                <Typography variant="body1" color="#2196F3" sx={{ mt: 1 }}>
                  You scored <b>{score}</b> out of {quizData[selectedSubject].length}
                </Typography>
                <Box mb={2}>
                  <LinearProgress
                    color="primary"
                    variant="determinate"
                    value={score / quizData[selectedSubject].length * 100}
                    sx={{
                      height: 9,
                      borderRadius: 5,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      my: 1.3
                    }}
                  />
                </Box>
                <PmsButton
                  buttonVarient="contained"
                  name="Play Again"
                  buttonClick={handlePlayAgain}
                  style={{
                    marginTop: 18,
                    fontSize: 15,
                    paddingLeft: 18,
                    paddingRight: 18
                  }}
                />
              </motion.div>
            )}
            {/* MAIN QUIZ (QUESTION/ANSWERS) */}
            {selectedSubject && !submitted && (
              <motion.div
                key={selectedSubject + currentQuestionIndex}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                style={{ width: "100%" }}
              >
                {/* Quiz Header */}
                <Box sx={{ mb: 1.1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                    <span style={{ fontSize: 22 }}>
                      {subjectMeta.find(s => s.key === selectedSubject)?.icon}
                    </span>
                    <Typography fontWeight={700} color="#2196F3" sx={{ fontSize: 18 }}>
                      {subjectMeta.find(s => s.key === selectedSubject)?.label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.2 }}>
                    <Typography variant="subtitle1" color="#757575">Question {currentQuestionIndex + 1}</Typography>
                    <Typography variant="subtitle2" color="#757575">Score: <b>{score}</b></Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((currentQuestionIndex) / quizData[selectedSubject].length) * 100}
                    sx={{
                      height: 7, borderRadius: 3, bgcolor: "rgba(0,0,0,0.1)", mt: 0.7
                    }}
                  />
                </Box>
                {/* Single Question Card */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: "rgba(0,0,0,0.03)",
                    border: "1px solid #2196F3",
                    p: 1.5,
                    mb: 2.2,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} color="#212121" sx={{ fontSize: 16 }}>
                    {quizData[selectedSubject][currentQuestionIndex].question}
                  </Typography>
                </Paper>
                {/* OPTIONS */}
                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr" },
                  gap: 1.6
                }}>
                  {quizData[selectedSubject][currentQuestionIndex].options.map((option, idx) => {
                    const isCorrect = option === quizData[selectedSubject][currentQuestionIndex].answer;
                    const isSelected = option === selectedAnswer;
                    let btnColor: "contained" | "outlined" | "text" = "outlined";
                    if (showFeedback && isSelected && isCorrect) btnColor = "contained";
                    return (
                      <motion.div
                        key={option + idx + wrongAnimate}
                        animate={showFeedback && isSelected && !isCorrect ? wrongAnswerShake : {}}
                        transition={{ type: 'spring', bounce: .22 }}
                      >
                        <PmsButton
                          buttonVarient={btnColor}
                          name={option}
                          buttonClick={() => handleAnswer(option)}
                          isDisable={showFeedback}
                          style={{
                            minHeight: 48,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            borderRadius: 9,
                            borderWidth: 1.3,
                            letterSpacing: ".5px",
                            ...(showFeedback && isSelected && isCorrect
                              ? { background: 'linear-gradient(90deg,#81fa85,#b5f7da 85%)', color: "#185c19" }
                              : {}),
                            ...(showFeedback && isSelected && !isCorrect
                              ? { background: 'linear-gradient(90deg,#fc9292,#fed7b8 85%)', color: "#a20e14" }
                              : {}),
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </Box>
                {/* Feedback Toast */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 22, opacity: 0 }}
                      transition={{ duration: .32 }}
                      style={{ marginTop: 19, textAlign: "center" }}
                    >
                      <Typography variant="body2" fontWeight={600} color={
                        selectedAnswer === quizData[selectedSubject][currentQuestionIndex].answer
                          ? "#12b551" : "#e13434"
                      }>
                        {selectedAnswer === quizData[selectedSubject][currentQuestionIndex].answer
                          ? '🎉 That’s correct! Good job!'
                          : '🙈 Oops! That’s not right.'}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Quiz;
