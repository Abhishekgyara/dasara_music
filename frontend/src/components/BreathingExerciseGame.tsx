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
  LinearProgress,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Close, Favorite, Timer, PlayArrow, Pause, Stop } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface BreathingExerciseGameProps {
  open: boolean;
  onClose: () => void;
}

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  pauseTime: number;
  color: string;
  benefits: string[];
}

const BreathingExerciseGame: React.FC<BreathingExerciseGameProps> = ({ open, onClose }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [selectedPattern, setSelectedPattern] = useState<string>('4-4-4-4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [customPattern, setCustomPattern] = useState({
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
  });

  const breathingPatterns: BreathingPattern[] = [
    {
      id: '4-4-4-4',
      name: 'Box Breathing',
      description: 'Equal timing for all phases - great for beginners',
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 4,
      pauseTime: 4,
      color: '#4caf50',
      benefits: ['Calmness', 'Focus', 'Stress Relief']
    },
    {
      id: '4-7-8',
      name: '4-7-8 Breathing',
      description: 'Popular technique for relaxation and sleep',
      inhaleTime: 4,
      holdTime: 7,
      exhaleTime: 8,
      pauseTime: 0,
      color: '#2196f3',
      benefits: ['Relaxation', 'Sleep Aid', 'Anxiety Relief']
    },
    {
      id: '6-2-6-2',
      name: 'Gentle Breathing',
      description: 'Smooth and gentle pattern for daily use',
      inhaleTime: 6,
      holdTime: 2,
      exhaleTime: 6,
      pauseTime: 2,
      color: '#ff9800',
      benefits: ['Mindfulness', 'Energy', 'Balance']
    },
    {
      id: 'custom',
      name: 'Custom Pattern',
      description: 'Create your own breathing rhythm',
      inhaleTime: customPattern.inhale,
      holdTime: customPattern.hold,
      exhaleTime: customPattern.exhale,
      pauseTime: customPattern.pause,
      color: '#9c27b0',
      benefits: ['Personalized', 'Flexible', 'Adaptive']
    }
  ];

  const currentPattern = breathingPatterns.find(p => p.id === selectedPattern) || breathingPatterns[0];

  useEffect(() => {
    if (open) {
      setGameState('intro');
      setIsPlaying(false);
      setCurrentPhase('inhale');
      setTimeLeft(0);
      setCycleCount(0);
    }
  }, [open]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && gameState === 'playing') {
      if (timeLeft > 0) {
        timer = setTimeout(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else {
        // Move to next phase
        const phases = ['inhale', 'hold', 'exhale', 'pause'] as const;
        const currentIndex = phases.indexOf(currentPhase);
        
        if (currentIndex === phases.length - 1) {
          // Cycle complete
          setCycleCount(prev => prev + 1);
          if (cycleCount + 1 >= totalCycles) {
            setIsPlaying(false);
            setGameState('completed');
            return;
          }
          setCurrentPhase('inhale');
        } else {
          setCurrentPhase(phases[currentIndex + 1]);
        }
        
        // Set time for next phase
        const nextPhase = currentIndex === phases.length - 1 ? 'inhale' : phases[currentIndex + 1];
        setTimeLeft(getPhaseTime(nextPhase));
      }
    }

    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, currentPhase, cycleCount, totalCycles, selectedPattern, customPattern]);

  const getPhaseTime = (phase: string): number => {
    switch (phase) {
      case 'inhale': return currentPattern.inhaleTime;
      case 'hold': return currentPattern.holdTime;
      case 'exhale': return currentPattern.exhaleTime;
      case 'pause': return currentPattern.pauseTime;
      default: return 4;
    }
  };

  const startExercise = () => {
    setGameState('playing');
    setCurrentPhase('inhale');
    setTimeLeft(currentPattern.inhaleTime);
    setCycleCount(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const stopExercise = () => {
    setIsPlaying(false);
    setGameState('intro');
    setCurrentPhase('inhale');
    setTimeLeft(0);
    setCycleCount(0);
  };

  const getPhaseMessage = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe in slowly and deeply';
      case 'hold': return 'Hold your breath gently';
      case 'exhale': return 'Breathe out slowly and completely';
      case 'pause': return 'Rest and prepare for the next breath';
      default: return '';
    }
  };

  const getPhaseEmoji = () => {
    switch (currentPhase) {
      case 'inhale': return '🫁';
      case 'hold': return '⏸️';
      case 'exhale': return '💨';
      case 'pause': return '😌';
      default: return '🫁';
    }
  };

  const getEncouragementMessage = () => {
    const messages = [
      "Breathing exercises can help calm your mind and reduce stress. Take your time and focus on your breath.",
      "Deep breathing activates your body's relaxation response. Let go of tension with each exhale.",
      "This exercise can help center your mind and bring a sense of peace and calm.",
      "Focus on the rhythm of your breath and let it guide you to a more relaxed state."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getCompletionMessage = () => {
    if (cycleCount >= totalCycles) {
      return "Excellent! You've completed your breathing exercise. Notice how you feel more relaxed and centered.";
    }
    return "Great job! You're doing well with your breathing practice.";
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
          <Favorite sx={{ color: '#ff5722' }} />
          <Typography variant="h5" fontWeight="bold">
            Breathing Exercise
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Follow guided breathing patterns to calm your mind and reduce stress
        </Typography>
      </DialogTitle>

      <DialogContent>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🫁 Guided Breathing Exercise
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose a breathing pattern and follow the visual guide. This exercise can help
                  reduce stress, anxiety, and bring a sense of calm and focus.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="5-10 minutes" size="small" />
                  <Chip label="Stress relief" size="small" />
                  <Chip label="Mindfulness" size="small" />
                </Box>
              </CardContent>
            </Card>

            {/* Pattern Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Choose Breathing Pattern:
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Breathing Pattern</InputLabel>
                <Select
                  value={selectedPattern}
                  onChange={(e) => setSelectedPattern(e.target.value)}
                  label="Breathing Pattern"
                >
                  {breathingPatterns.map((pattern) => (
                    <MenuItem key={pattern.id} value={pattern.id}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {pattern.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pattern.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Custom Pattern Controls */}
              {selectedPattern === 'custom' && (
                <Card sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Customize Your Pattern:
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography variant="body2">Inhale: {customPattern.inhale}s</Typography>
                      <Slider
                        value={customPattern.inhale}
                        onChange={(_, value) => setCustomPattern(prev => ({ ...prev, inhale: value as number }))}
                        min={2}
                        max={10}
                        step={1}
                        marks
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Hold: {customPattern.hold}s</Typography>
                      <Slider
                        value={customPattern.hold}
                        onChange={(_, value) => setCustomPattern(prev => ({ ...prev, hold: value as number }))}
                        min={0}
                        max={10}
                        step={1}
                        marks
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Exhale: {customPattern.exhale}s</Typography>
                      <Slider
                        value={customPattern.exhale}
                        onChange={(_, value) => setCustomPattern(prev => ({ ...prev, exhale: value as number }))}
                        min={2}
                        max={10}
                        step={1}
                        marks
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Pause: {customPattern.pause}s</Typography>
                      <Slider
                        value={customPattern.pause}
                        onChange={(_, value) => setCustomPattern(prev => ({ ...prev, pause: value as number }))}
                        min={0}
                        max={10}
                        step={1}
                        marks
                      />
                    </Box>
                  </Box>
                </Card>
              )}

              {/* Pattern Info */}
              <Card sx={{ mt: 2, backgroundColor: `${currentPattern.color}10` }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {currentPattern.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {currentPattern.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {currentPattern.benefits.map((benefit) => (
                      <Chip
                        key={benefit}
                        label={benefit}
                        size="small"
                        sx={{
                          backgroundColor: `${currentPattern.color}20`,
                          color: currentPattern.color,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Cycles Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Number of Cycles:
              </Typography>
              <Slider
                value={totalCycles}
                onChange={(_, value) => setTotalCycles(value as number)}
                min={1}
                max={10}
                step={1}
                marks
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {totalCycles} cycle{totalCycles !== 1 ? 's' : ''} ({totalCycles * (currentPattern.inhaleTime + currentPattern.holdTime + currentPattern.exhaleTime + currentPattern.pauseTime)} seconds total)
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {getEncouragementMessage()}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={startExercise}
              sx={{
                background: `linear-gradient(135deg, ${currentPattern.color}, ${currentPattern.color}dd)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${currentPattern.color}dd, ${currentPattern.color})`,
                },
              }}
            >
              Start Exercise
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <Box>
            {/* Progress */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Cycle {cycleCount + 1} of {totalCycles}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(((cycleCount + 1) / totalCycles) * 100)}% Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={((cycleCount + 1) / totalCycles) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: currentPattern.color,
                  },
                }}
              />
            </Box>

            {/* Breathing Circle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <motion.div
                animate={{
                  scale: currentPhase === 'inhale' ? 1.2 : currentPhase === 'exhale' ? 0.8 : 1,
                  opacity: currentPhase === 'pause' ? 0.7 : 1,
                }}
                transition={{
                  duration: getPhaseTime(currentPhase),
                  ease: currentPhase === 'inhale' ? 'easeOut' : currentPhase === 'exhale' ? 'easeIn' : 'linear',
                }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  backgroundColor: currentPattern.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                }}
              >
                {getPhaseEmoji()}
              </motion.div>
            </Box>

            {/* Phase Info */}
            <Card sx={{ textAlign: 'center', mb: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {timeLeft}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {getPhaseMessage()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} for {getPhaseTime(currentPhase)} seconds
                </Typography>
              </CardContent>
            </Card>

            {/* Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={togglePlayPause}
                startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                sx={{
                  backgroundColor: currentPattern.color,
                  '&:hover': {
                    backgroundColor: currentPattern.color,
                  },
                }}
              >
                {isPlaying ? 'Pause' : 'Resume'}
              </Button>
              <Button
                variant="outlined"
                onClick={stopExercise}
                startIcon={<Stop />}
              >
                Stop
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
                <Favorite sx={{ fontSize: 60, color: '#ff5722', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Exercise Complete!
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {getCompletionMessage()}
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You've completed {totalCycles} breathing cycle{totalCycles !== 1 ? 's' : ''} using the {currentPattern.name} pattern.
                Take a moment to notice how you feel - more relaxed, centered, and calm.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setGameState('intro');
                    setCycleCount(0);
                    setIsPlaying(false);
                  }}
                >
                  Try Again
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

export default BreathingExerciseGame;
