import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  SportsEsports,
  EmojiEmotions,
  MusicNote,
  Psychology,
  Favorite,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import MoodUpliftmentGame from '../components/MoodUpliftmentGame';
import MoodQuizGame from '../components/MoodQuizGame';
import BreathingExerciseGame from '../components/BreathingExerciseGame';
import GratitudeJournalGame from '../components/GratitudeJournalGame';

const Games: React.FC = () => {
  const theme = useTheme();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'tap-notes',
      title: 'Tap the Notes',
      description: 'Catch musical notes as they appear on screen. A simple but engaging game to distract from negative thoughts and boost your mood.',
      icon: <MusicNote />,
      color: '#4caf50',
      difficulty: 'Easy',
      duration: '2-5 min',
      benefits: ['Distraction', 'Focus', 'Mood Boost'],
      instructions: [
        'Musical notes will appear randomly on screen',
        'Tap them quickly to score points',
        'Try to catch as many as possible in 30 seconds',
        'Each successful catch brings you closer to a better mood!'
      ],
    },
    {
      id: 'mood-quiz',
      title: 'Mood Quiz',
      description: 'Answer fun questions about your day and discover positive aspects you might have overlooked.',
      icon: <Psychology />,
      color: '#2196f3',
      difficulty: 'Easy',
      duration: '3-7 min',
      benefits: ['Self-reflection', 'Gratitude', 'Perspective'],
      instructions: [
        'Answer simple questions about your day',
        'Reflect on positive moments',
        'Discover things to be grateful for',
        'Shift your perspective to the positive'
      ],
    },
    {
      id: 'breathing-exercise',
      title: 'Breathing Exercise',
      description: 'Follow guided breathing patterns to calm your mind and reduce anxiety or stress.',
      icon: <Favorite />,
      color: '#ff5722',
      difficulty: 'Easy',
      duration: '5-10 min',
      benefits: ['Calmness', 'Stress Relief', 'Focus'],
      instructions: [
        'Follow the visual breathing guide',
        'Inhale and exhale at the rhythm shown',
        'Focus on your breath',
        'Let go of racing thoughts'
      ],
    },
    {
      id: 'gratitude-journal',
      title: 'Gratitude Journal',
      description: 'Write down three things you\'re grateful for today, no matter how small they may seem.',
      icon: <Star />,
      color: '#ff9800',
      difficulty: 'Easy',
      duration: '5-10 min',
      benefits: ['Gratitude', 'Positivity', 'Mindfulness'],
      instructions: [
        'Think about your day',
        'Write down three things you\'re grateful for',
        'They can be big or small',
        'Reflect on why they matter to you'
      ],
    },
  ];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Mood Upliftment Games
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Interactive activities designed to help improve your mood and mental well-being
      </Typography>

      <Grid container spacing={3}>
        {games.map((game, index) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                    boxShadow: theme.shadows[8],
                  },
                }}
                onClick={() => handleGameSelect(game.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: game.color,
                        mr: 2,
                      }}
                    >
                      {game.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {game.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={game.difficulty} size="small" variant="outlined" />
                        <Chip label={game.duration} size="small" variant="outlined" />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {game.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Benefits:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {game.benefits.map((benefit) => (
                        <Chip
                          key={benefit}
                          label={benefit}
                          size="small"
                          sx={{
                            backgroundColor: `${game.color}20`,
                            color: game.color,
                            fontSize: '0.7rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      How to play:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {game.instructions.map((instruction, idx) => (
                        <Typography
                          key={idx}
                          component="li"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {instruction}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SportsEsports />}
                    sx={{
                      mt: 'auto',
                      backgroundColor: game.color,
                      '&:hover': {
                        backgroundColor: game.color,
                      },
                    }}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Game Tips Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 Tips for Getting the Most Out of Mood Games
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                When to Play:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  When you're feeling down or anxious
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  During stressful moments
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  As a daily mood maintenance routine
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Before important events to calm nerves
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                How to Play Effectively:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  Find a quiet, comfortable space
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Focus fully on the activity
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Don't worry about performance
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Combine with music for enhanced effect
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Game Modals */}
      <MoodUpliftmentGame
        open={selectedGame === 'tap-notes'}
        onClose={() => setSelectedGame(null)}
      />
      <MoodQuizGame
        open={selectedGame === 'mood-quiz'}
        onClose={() => setSelectedGame(null)}
      />
      <BreathingExerciseGame
        open={selectedGame === 'breathing-exercise'}
        onClose={() => setSelectedGame(null)}
      />
      <GratitudeJournalGame
        open={selectedGame === 'gratitude-journal'}
        onClose={() => setSelectedGame(null)}
      />
    </Box>
  );
};

export default Games; 