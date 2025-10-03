import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import { Close, Psychology, EmojiEmotions, Star, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface MoodQuizGameProps {
  open: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  positiveAspect: string;
  reflection: string;
}

const MoodQuizGame: React.FC<MoodQuizGameProps> = ({ open, onClose }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showReflection, setShowReflection] = useState(false);
  const [positiveInsights, setPositiveInsights] = useState<string[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "What's one small thing that made you smile today?",
      options: [
        "A kind message from someone",
        "A beautiful sunset or nature",
        "A funny video or joke",
        "A delicious meal or snack",
        "Nothing really stood out"
      ],
      positiveAspect: "Gratitude for small moments",
      reflection: "Even the smallest positive moments can brighten our day. Recognizing them helps us appreciate life's simple pleasures."
    },
    {
      id: 2,
      question: "How did you help someone today, even in a small way?",
      options: [
        "Listened to a friend",
        "Held the door for someone",
        "Said something encouraging",
        "Shared a smile",
        "I didn't get a chance to help anyone"
      ],
      positiveAspect: "Acts of kindness",
      reflection: "Helping others, no matter how small, creates positive energy and makes us feel good about ourselves."
    },
    {
      id: 3,
      question: "What's something you're looking forward to this week?",
      options: [
        "Spending time with loved ones",
        "A hobby or activity I enjoy",
        "Learning something new",
        "A relaxing moment",
        "I'm not sure what to look forward to"
      ],
      positiveAspect: "Future optimism",
      reflection: "Having things to look forward to gives us hope and motivation. Even small plans can bring joy."
    },
    {
      id: 4,
      question: "What's one thing you did well today?",
      options: [
        "Completed a task successfully",
        "Stayed calm in a difficult situation",
        "Took care of my health",
        "Learned something new",
        "I'm not sure I did anything well"
      ],
      positiveAspect: "Personal achievement",
      reflection: "Recognizing our accomplishments, big or small, builds confidence and self-worth."
    },
    {
      id: 5,
      question: "What's something beautiful you noticed recently?",
      options: [
        "Nature or scenery",
        "Art or music",
        "Someone's kindness",
        "A moment of peace",
        "I haven't noticed anything beautiful lately"
      ],
      positiveAspect: "Appreciation of beauty",
      reflection: "Beauty surrounds us in many forms. Taking time to notice it can lift our spirits and bring joy."
    }
  ];

  useEffect(() => {
    if (open) {
      setGameState('intro');
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      setShowReflection(false);
      setPositiveInsights([]);
    }
  }, [open]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Game completed
      const insights = questions.map((q, index) => {
        const answerIndex = selectedAnswers[index];
        if (answerIndex !== undefined && answerIndex < 4) { // Not the "negative" option
          return q.positiveAspect;
        }
        return null;
      }).filter(Boolean) as string[];
      
      setPositiveInsights(insights);
      setGameState('completed');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const startGame = () => {
    setGameState('playing');
  };

  const getEncouragementMessage = () => {
    const messages = [
      "This quiz will help you discover positive aspects of your day that you might have overlooked.",
      "Sometimes we focus on the negative, but there's always something good to find.",
      "Take a moment to reflect on the positive moments in your day.",
      "This exercise can help shift your perspective and improve your mood."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getCompletionMessage = () => {
    const insightCount = positiveInsights.length;
    if (insightCount >= 4) return "Amazing! You found so many positive aspects of your day! 🌟";
    if (insightCount >= 3) return "Great job! You're doing well at finding the positive! ✨";
    if (insightCount >= 2) return "Good effort! You found some positive moments! 🌈";
    return "That's okay! Tomorrow is a new opportunity to find positive moments! 🌱";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology sx={{ color: '#2196f3' }} />
          <Typography variant="h5" fontWeight="bold">
            Mood Quiz
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Discover positive aspects of your day through reflection
        </Typography>
      </DialogTitle>

      <DialogContent>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🧠 Positive Reflection Quiz
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Answer these questions to discover positive aspects of your day that you might have overlooked.
                  This exercise can help shift your perspective and improve your mood.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="5 questions" size="small" />
                  <Chip label="Self-reflection" size="small" />
                  <Chip label="Positive focus" size="small" />
                </Box>
              </CardContent>
            </Card>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {getEncouragementMessage()}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={startGame}
              sx={{
                background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                },
              }}
            >
              Start Quiz
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <Box>
            {/* Progress */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={((currentQuestion + 1) / questions.length) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2196f3',
                  },
                }}
              />
            </Box>

            {/* Question */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  {questions[currentQuestion].question}
                </Typography>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={selectedAnswers[currentQuestion] ?? ''}
                    onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}
                  >
                    {questions[currentQuestion].options.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={index}
                        control={<Radio />}
                        label={option}
                        sx={{
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'grey.50',
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                variant="outlined"
              >
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                  },
                }}
              >
                {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}

        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ textAlign: 'center', p: 4, backgroundColor: '#e8f5e8' }}>
              <Box sx={{ mb: 3 }}>
                <Star sx={{ fontSize: 60, color: '#ffd700', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Quiz Complete!
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {getCompletionMessage()}
                </Typography>
              </Box>

              {positiveInsights.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Positive Aspects You Found:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {positiveInsights.map((insight, index) => (
                      <Chip
                        key={index}
                        label={insight}
                        color="primary"
                        variant="outlined"
                        icon={<CheckCircle />}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Great job on completing the reflection quiz! Remember, focusing on positive aspects
                of your day can help improve your mood and overall well-being. Keep practicing
                this positive mindset!
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setGameState('intro');
                    setCurrentQuestion(0);
                    setSelectedAnswers([]);
                    setPositiveInsights([]);
                  }}
                >
                  Take Quiz Again
                </Button>
                <Button
                  variant="contained"
                  onClick={onClose}
                  sx={{
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #388e3c, #4caf50)',
                    },
                  }}
                >
                  Continue to Music
                </Button>
              </Box>
            </Card>
          </motion.div>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" startIcon={<Close />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoodQuizGame;
