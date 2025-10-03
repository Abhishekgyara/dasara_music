import React, { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import { Close, EmojiEmotions, MusicNote, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface MoodUpliftmentGameProps {
  open: boolean;
  onClose: () => void;
}

const MoodUpliftmentGame: React.FC<MoodUpliftmentGameProps> = ({
  open,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [notes, setNotes] = useState<Array<{ x: number; y: number; id: number; clicked: boolean }>>([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Use refs to track game state without re-renders
  const gameStateRef = useRef(gameState);
  const notesRef = useRef(notes);

  // Sync refs with state
  useEffect(() => {
    gameStateRef.current = gameState;
    notesRef.current = notes;
  }, [gameState, notes]);

  useEffect(() => {
    if (open) {
      setGameState('intro');
      setScore(0);
      setTimeLeft(30);
      setNotes([]);
      setGameStarted(false);
    }
  }, [open]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('completed');
    }

    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  // Note generation effect - improved version
  useEffect(() => {
    let noteInterval: NodeJS.Timeout;
    
    const generateNotes = () => {
      if (gameStateRef.current === 'playing' && timeLeft > 0) {
        const currentNotesCount = notesRef.current.length;
        
        // Generate 1-3 notes at a time, but limit total notes on screen
        const notesToGenerate = Math.min(3 - currentNotesCount, Math.floor(Math.random() * 3) + 1);
        
        if (notesToGenerate > 0 && currentNotesCount < 5) { // Max 5 notes on screen
          const newNotes = Array.from({ length: notesToGenerate }, () => ({
            x: Math.random() * 80 + 10, // 10% to 90% of container width
            y: Math.random() * 60 + 20, // 20% to 80% of container height
            id: Date.now() + Math.random(), // Unique ID
            clicked: false,
          }));
          
          setNotes(prev => [...prev, ...newNotes]);
        }
      }
    };

    if (gameState === 'playing') {
      // Generate notes at random intervals between 0.8 to 1.5 seconds
      const startNoteGeneration = () => {
        generateNotes();
        noteInterval = setTimeout(startNoteGeneration, 800 + Math.random() * 700);
      };
      
      startNoteGeneration();
    }

    return () => {
      if (noteInterval) clearTimeout(noteInterval);
    };
  }, [gameState, timeLeft]);

  // Auto-remove notes that weren't clicked after 3 seconds
  useEffect(() => {
    let cleanupInterval: NodeJS.Timeout;
    
    if (gameState === 'playing' && notes.length > 0) {
      cleanupInterval = setInterval(() => {
        setNotes(prev => {
          const now = Date.now();
          // Remove notes that are older than 3 seconds and not clicked
          return prev.filter(note => {
            const noteAge = now - note.id;
            return note.clicked || noteAge < 3000;
          });
        });
      }, 1000);
    }
    
    return () => {
      if (cleanupInterval) clearInterval(cleanupInterval);
    };
  }, [gameState, notes.length]);

  const startGame = () => {
    setGameState('playing');
    setGameStarted(true);
    // Initial notes
    const initialNotes = Array.from({ length: 2 }, (_, i) => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      id: Date.now() + i,
      clicked: false,
    }));
    setNotes(initialNotes);
  };

  const handleNoteClick = (noteId: number) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === noteId ? { ...note, clicked: true } : note
      )
    );
    setScore(prev => prev + 10);
    
    // Remove clicked note after animation
    setTimeout(() => {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }, 300);
  };

  const getGameMessage = () => {
    if (score >= 150) return "Amazing! You're a music maestro! 🎵";
    if (score >= 100) return "Great job! You've got rhythm! 🎶";
    if (score >= 60) return "Good effort! Keep the beat going! 🥁";
    return "Nice try! Music is all about practice! 🎼";
  };

  const getEncouragementMessage = () => {
    const messages = [
      "Remember, every note you catch brings you closer to a better mood!",
      "Music has the power to transform your feelings.",
      "You're doing great! Keep focusing on the positive notes.",
      "Each successful catch is a step toward feeling better.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Calculate notes per second for performance info
  const notesPerSecond = notes.length > 0 ? (score / (30 - timeLeft)).toFixed(1) : '0';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEmotions sx={{ color: '#ff9800' }} />
          <Typography variant="h5" fontWeight="bold">
            Mood Upliftment Game
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Catch the musical notes to boost your mood! Notes: {notes.length}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mb: 3, backgroundColor: '#fff3e0', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎵 Tap the Notes Game
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Musical notes will appear continuously on the screen. Tap them quickly to score points!
                  This simple game can help shift your focus and improve your mood.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="30 seconds" size="small" color="primary" />
                  <Chip label="Continuous notes" size="small" color="secondary" />
                  <Chip label="Score points" size="small" color="success" />
                </Box>
              </CardContent>
            </Card>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
              {getEncouragementMessage()}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={startGame}
              sx={{
                background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f57c00, #ff9800)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
                fontSize: '1.1rem',
                padding: '10px 30px',
              }}
            >
              Start Game
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <Box>
            {/* Game Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Score: <span style={{ color: '#ff9800' }}>{score}</span>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Notes/sec: {notesPerSecond}
                </Typography>
              </Box>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{ 
                  color: timeLeft <= 10 ? '#f44336' : timeLeft <= 20 ? '#ff9800' : '#4caf50',
                  animation: timeLeft <= 5 ? 'pulse 0.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  }
                }}
              >
                Time: {timeLeft}s
              </Typography>
            </Box>

            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={(timeLeft / 30) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: timeLeft <= 10 ? '#f44336' : timeLeft <= 20 ? '#ff9800' : '#4caf50',
                  borderRadius: 5,
                },
              }}
            />

            {/* Game Area */}
            <Box
              sx={{
                position: 'relative',
                height: 400,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                border: '3px dashed',
                borderColor: 'grey.300',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
              }}
            >
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: note.clicked ? [1, 1.5, 0] : 1,
                    opacity: note.clicked ? [1, 0.5, 0] : 1,
                    rotate: note.clicked ? [0, 45, 90] : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    left: `${note.x}%`,
                    top: `${note.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: note.clicked ? 10 : 1,
                  }}
                  onClick={() => !note.clicked && handleNoteClick(note.id)}
                >
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <MusicNote
                      sx={{
                        fontSize: 48,
                        color: note.clicked ? '#4caf50' : '#ff9800',
                        filter: note.clicked 
                          ? 'drop-shadow(0 0 15px #4caf50)' 
                          : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                        opacity: note.clicked ? 0.7 : 1,
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}

              {notes.length === 0 && gameStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Get ready! Notes will appear soon...
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </Box>

            {/* Instructions */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              💡 Tip: Notes appear continuously. Click them quickly before they disappear!
            </Typography>
          </Box>
        )}

        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ textAlign: 'center', p: 4, backgroundColor: '#e8f5e8', boxShadow: 3 }}>
              <Box sx={{ mb: 3 }}>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Star sx={{ fontSize: 80, color: '#ffd700', mb: 2, filter: 'drop-shadow(0 0 10px gold)' }} />
                </motion.div>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="#2e7d32">
                  Game Complete!
                </Typography>
                <Typography variant="h3" color="#ff9800" gutterBottom fontWeight="bold">
                  {score} Points
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {getGameMessage()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Notes per second: {notesPerSecond}
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                Great job! Playing games can help distract from negative thoughts and boost your mood.
                Remember, it's okay to not feel okay, and small activities like this can make a difference.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setGameState('intro');
                    setScore(0);
                    setTimeLeft(30);
                    setNotes([]);
                    setGameStarted(false);
                  }}
                  sx={{ minWidth: 120 }}
                >
                  Play Again
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onClose}
                  sx={{
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #388e3c, #4caf50)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease',
                    minWidth: 120,
                  }}
                >
                  Continue to Music
                </Button>
              </Box>
            </Card>
          </motion.div>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, background: 'rgba(255,255,255,0.8)' }}>
        {gameState === 'playing' && (
          <Button
            onClick={() => {
              setGameState('completed');
              setTimeLeft(0);
            }}
            variant="outlined"
            color="warning"
          >
            End Game Early
          </Button>
        )}
        <Button onClick={onClose} variant="outlined" startIcon={<Close />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoodUpliftmentGame;