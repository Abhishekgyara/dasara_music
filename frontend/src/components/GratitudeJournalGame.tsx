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
  TextField,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Close, Star, Add, Delete, Edit, Check, EmojiEmotions } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface GratitudeJournalGameProps {
  open: boolean;
  onClose: () => void;
}

interface GratitudeEntry {
  id: string;
  text: string;
  category: string;
  timestamp: Date;
}

const GratitudeJournalGame: React.FC<GratitudeJournalGameProps> = ({ open, onClose }) => {
  const [gameState, setGameState] = useState<'intro' | 'writing' | 'completed'>('intro');
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);

  const categories = [
    { name: 'People', color: '#e91e63', icon: '👥' },
    { name: 'Experiences', color: '#9c27b0', icon: '🌟' },
    { name: 'Health', color: '#4caf50', icon: '💪' },
    { name: 'Nature', color: '#2196f3', icon: '🌿' },
    { name: 'Learning', color: '#ff9800', icon: '📚' },
    { name: 'Creativity', color: '#f44336', icon: '🎨' },
    { name: 'Comfort', color: '#795548', icon: '🏠' },
    { name: 'Other', color: '#607d8b', icon: '✨' },
  ];

  const prompts = [
    "What made you smile today?",
    "Who are you grateful to have in your life?",
    "What small thing brought you joy?",
    "What challenge helped you grow?",
    "What beauty did you notice today?",
    "What kindness did you receive or give?",
    "What are you proud of accomplishing?",
    "What made you feel safe or comfortable?",
    "What opportunity are you grateful for?",
    "What memory makes you happy?"
  ];

  useEffect(() => {
    if (open) {
      setGameState('intro');
      setGratitudeEntries([]);
      setCurrentEntry('');
      setCurrentCategory('');
      setEditingEntry(null);
      setEditText('');
      setShowPrompts(false);
    }
  }, [open]);

  const addGratitudeEntry = () => {
    if (currentEntry.trim() && currentCategory) {
      const newEntry: GratitudeEntry = {
        id: Date.now().toString(),
        text: currentEntry.trim(),
        category: currentCategory,
        timestamp: new Date(),
      };
      setGratitudeEntries(prev => [...prev, newEntry]);
      setCurrentEntry('');
      setCurrentCategory('');
    }
  };

  const deleteEntry = (id: string) => {
    setGratitudeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const startEditing = (entry: GratitudeEntry) => {
    setEditingEntry(entry.id);
    setEditText(entry.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setGratitudeEntries(prev =>
        prev.map(entry =>
          entry.id === editingEntry
            ? { ...entry, text: editText.trim() }
            : entry
        )
      );
      setEditingEntry(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditText('');
  };

  const completeJournal = () => {
    setGameState('completed');
  };

  const getRandomPrompt = () => {
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const getEncouragementMessage = () => {
    const messages = [
      "Writing down what you're grateful for can shift your perspective and improve your mood.",
      "Gratitude journaling helps you focus on the positive aspects of your life.",
      "Even small things can bring great joy when we take time to appreciate them.",
      "This practice can help you develop a more positive outlook on life."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getCompletionMessage = () => {
    const entryCount = gratitudeEntries.length;
    if (entryCount >= 5) return "Amazing! You found so many things to be grateful for! 🌟";
    if (entryCount >= 3) return "Great job! You've captured some wonderful moments! ✨";
    if (entryCount >= 1) return "Good start! Every grateful thought counts! 🌈";
    return "That's okay! Sometimes it takes time to find things to appreciate. 🌱";
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.color : '#607d8b';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.icon : '✨';
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
          <Star sx={{ color: '#ff9800' }} />
          <Typography variant="h5" fontWeight="bold">
            Gratitude Journal
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Write down three things you're grateful for today, no matter how small they may seem
        </Typography>
      </DialogTitle>

      <DialogContent>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mb: 3, backgroundColor: '#fff8e1' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ✨ Gratitude Journaling
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Take a moment to reflect on the positive aspects of your day. Write down things
                  you're grateful for, no matter how big or small. This practice can help improve
                  your mood and overall well-being.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="5-10 minutes" size="small" />
                  <Chip label="Gratitude practice" size="small" />
                  <Chip label="Positive reflection" size="small" />
                </Box>
              </CardContent>
            </Card>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {getEncouragementMessage()}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => setGameState('writing')}
              sx={{
                background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f57c00, #ff9800)',
                },
              }}
            >
              Start Writing
            </Button>
          </motion.div>
        )}

        {gameState === 'writing' && (
          <Box>
            {/* Writing Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  What are you grateful for today?
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="Write about something you're grateful for..."
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category.name}
                      label={`${category.icon} ${category.name}`}
                      onClick={() => setCurrentCategory(category.name)}
                      variant={currentCategory === category.name ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: currentCategory === category.name ? category.color : 'transparent',
                        color: currentCategory === category.name ? 'white' : category.color,
                        borderColor: category.color,
                        '&:hover': {
                          backgroundColor: `${category.color}20`,
                        },
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={addGratitudeEntry}
                    disabled={!currentEntry.trim() || !currentCategory}
                    startIcon={<Add />}
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': {
                        backgroundColor: '#388e3c',
                      },
                    }}
                  >
                    Add Entry
                  </Button>
                  
                  <Tooltip title="Get a random prompt">
                    <IconButton
                      onClick={() => setCurrentEntry(getRandomPrompt() + ' ')}
                      color="primary"
                    >
                      <EmojiEmotions />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>

            {/* Entries List */}
            {gratitudeEntries.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Gratitude Entries ({gratitudeEntries.length})
                  </Typography>
                  
                  {gratitudeEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          mb: 2,
                          backgroundColor: `${getCategoryColor(entry.category)}10`,
                          border: `1px solid ${getCategoryColor(entry.category)}30`,
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar
                              sx={{
                                backgroundColor: getCategoryColor(entry.category),
                                width: 40,
                                height: 40,
                              }}
                            >
                              {getCategoryIcon(entry.category)}
                            </Avatar>
                            
                            <Box sx={{ flexGrow: 1 }}>
                              {editingEntry === entry.id ? (
                                <Box>
                                  <TextField
                                    fullWidth
                                    multiline
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    sx={{ mb: 1 }}
                                  />
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                      size="small"
                                      onClick={saveEdit}
                                      startIcon={<Check />}
                                      variant="contained"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="small"
                                      onClick={cancelEdit}
                                      variant="outlined"
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                </Box>
                              ) : (
                                <Box>
                                  <Typography variant="body1" sx={{ mb: 1 }}>
                                    {entry.text}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                      label={entry.category}
                                      size="small"
                                      sx={{
                                        backgroundColor: getCategoryColor(entry.category),
                                        color: 'white',
                                        fontSize: '0.7rem',
                                      }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {entry.timestamp.toLocaleTimeString()}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </Box>

                            {editingEntry !== entry.id && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit entry">
                                  <IconButton
                                    size="small"
                                    onClick={() => startEditing(entry)}
                                    color="primary"
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete entry">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteEntry(entry.id)}
                                    color="error"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={completeJournal}
                      sx={{
                        background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #388e3c, #4caf50)',
                        },
                      }}
                    >
                      Complete Journal
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
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
                  Journal Complete!
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {getCompletionMessage()}
                </Typography>
              </Box>

              {gratitudeEntries.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    You wrote about {gratitudeEntries.length} thing{gratitudeEntries.length !== 1 ? 's' : ''} you're grateful for:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {gratitudeEntries.map((entry) => (
                      <Chip
                        key={entry.id}
                        label={`${getCategoryIcon(entry.category)} ${entry.category}`}
                        sx={{
                          backgroundColor: getCategoryColor(entry.category),
                          color: 'white',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Great job on completing your gratitude journal! Taking time to appreciate
                the positive aspects of your life can help improve your mood and overall
                well-being. Keep practicing gratitude daily!
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setGameState('intro');
                    setGratitudeEntries([]);
                    setCurrentEntry('');
                    setCurrentCategory('');
                  }}
                >
                  Write Again
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

export default GratitudeJournalGame;
