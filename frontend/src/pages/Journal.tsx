import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Chip,
  Avatar,
  useTheme,
  Alert,
} from '@mui/material';
import {
  CalendarToday,
  Add,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVerySatisfied,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  MusicNote,
  AutoAwesome,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useMusicStore } from '../store/musicStore';

const Journal: React.FC = () => {
  const theme = useTheme();
  const { moodHistory, addMoodToHistory, listeningHistory } = useMusicStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: '',
    intensity: 5,
    notes: '',
  });
  const [autoDetectedMoods, setAutoDetectedMoods] = useState<{[key: string]: string}>({});

  // Function to automatically detect mood from listening history
  const detectMoodFromListeningHistory = (date: Date) => {
    const dateStr = date.toDateString();
    
    // Get listening history for the specific date
    const dayHistory = listeningHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.toDateString() === dateStr;
    });

    if (dayHistory.length === 0) {
      return null;
    }

    // Calculate mood based on most listened mood and total duration
    const moodStats: {[key: string]: number} = {};
    
    dayHistory.forEach(entry => {
      if (entry.mood) {
        moodStats[entry.mood] = (moodStats[entry.mood] || 0) + entry.duration;
      }
    });

    // Find the mood with maximum listening time
    let maxMood = '';
    let maxDuration = 0;

    Object.entries(moodStats).forEach(([mood, duration]) => {
      if (duration > maxDuration) {
        maxDuration = duration;
        maxMood = mood;
      }
    });

    // Calculate intensity based on listening patterns
    const totalDuration = dayHistory.reduce((total, entry) => total + entry.duration, 0);
    const intensity = Math.min(10, Math.max(1, Math.round((maxDuration / totalDuration) * 10)));

    if (maxMood && maxDuration > 0) {
      return {
        mood: maxMood,
        intensity,
        totalListeningTime: totalDuration,
        songCount: dayHistory.length
      };
    }

    return null;
  };

  // Auto-detect and add mood entries for dates without journal entries
  useEffect(() => {
    const autoDetectMoods = () => {
      const today = new Date();
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date;
      });

      const newAutoDetectedMoods: {[key: string]: string} = {};

      last30Days.forEach(date => {
        const dateStr = date.toDateString();
        
        // Skip if already has a mood entry
        const existingMood = moodHistory.find(mood => 
          new Date(mood.timestamp).toDateString() === dateStr
        );

        if (!existingMood) {
          const detectedMood = detectMoodFromListeningHistory(date);
          if (detectedMood) {
            // Store for display (don't auto-add to avoid spamming)
            newAutoDetectedMoods[dateStr] = `${detectedMood.mood} (${detectedMood.intensity}/10)`;
          }
        }
      });

      setAutoDetectedMoods(newAutoDetectedMoods);
    };

    autoDetectMoods();
  }, [moodHistory, listeningHistory]);

  // Function to add auto-detected mood to journal
  const addAutoDetectedMood = (date: Date) => {
    const detectedMood = detectMoodFromListeningHistory(date);
    if (detectedMood) {
      addMoodToHistory({
        id: Date.now().toString(),
        type: detectedMood.mood as any,
        intensity: detectedMood.intensity,
        timestamp: date,
        source: "text",
        notes: `Auto-detected from listening history: ${detectedMood.songCount} songs, ${Math.round(detectedMood.totalListeningTime / 60)} minutes`,
        confidence: 0.8,
      });

      // Remove from auto-detected list
      setAutoDetectedMoods(prev => {
        const newState = { ...prev };
        delete newState[date.toDateString()];
        return newState;
      });
    }
  };

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMoodForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return moodHistory.find(mood => 
      new Date(mood.timestamp).toDateString() === dateStr
    );
  };

  const getMoodColor = (moodType: string) => {
    switch (moodType) {
      case 'happy':
      case 'excited':
        return '#4caf50';
      case 'sad':
      case 'melancholic':
        return '#f44336';
      case 'energetic':
        return '#ff9800';
      case 'calm':
      case 'focused':
        return '#2196f3';
      case 'anxious':
        return '#ff5722';
      default:
        return '#9e9e9e';
    }
  };

  const getMoodIcon = (moodType: string) => {
    switch (moodType) {
      case 'happy':
      case 'excited':
        return <SentimentVerySatisfied />;
      case 'sad':
      case 'melancholic':
        return <SentimentVeryDissatisfied />;
      case 'energetic':
        return <SentimentSatisfied />;
      case 'anxious':
        return <SentimentDissatisfied />;
      default:
        return <SentimentNeutral />;
    }
  };

  const handleAddEntry = () => {
    if (newEntry.mood) {
      addMoodToHistory({
        id: Date.now().toString(),
        type: newEntry.mood as any,
        intensity: newEntry.intensity,
        timestamp: selectedDate,
        source: 'journal',
        notes: newEntry.notes,
        confidence: 1,
      });
      
      setNewEntry({ mood: '', intensity: 5, notes: '' });
      setShowAddEntry(false);
    }
  };

  const moodOptions = [
    { value: 'happy', label: 'Happy', color: '#4caf50' },
    { value: 'sad', label: 'Sad', color: '#f44336' },
    { value: 'energetic', label: 'Energetic', color: '#ff9800' },
    { value: 'calm', label: 'Calm', color: '#2196f3' },
    { value: 'anxious', label: 'Anxious', color: '#ff5722' },
    { value: 'excited', label: 'Excited', color: '#9c27b0' },
    { value: 'melancholic', label: 'Melancholic', color: '#607d8b' },
    { value: 'focused', label: 'Focused', color: '#795548' },
  ];

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mood Journal
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddEntry(true)}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            },
          }}
        >
          Add Entry
        </Button>
      </Box>

      {/* Auto-detection Alert */}
      {Object.keys(autoDetectedMoods).length > 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          icon={<AutoAwesome />}
        >
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            🎵 Mood Detection Available
          </Typography>
          <Typography variant="body2">
            We detected your mood from your listening history on {Object.keys(autoDetectedMoods).length} day(s). 
            Click on the calendar dates with <MusicNote sx={{ fontSize: 16 }} /> icon to add them automatically.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Calendar */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </Typography>
                <Box>
                  <Button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                  >
                    ←
                  </Button>
                  <Button
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                  >
                    →
                  </Button>
                </Box>
              </Box>

              {/* Calendar Grid */}
              <Grid container spacing={1}>
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Grid item xs={12/7} key={day}>
                    <Box sx={{ textAlign: 'center', py: 1, fontWeight: 'bold', color: 'text.secondary' }}>
                      {day}
                    </Box>
                  </Grid>
                ))}

                {/* Calendar days */}
                {days.map((day, index) => {
                  const mood = day ? getMoodForDate(day) : null;
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  const isSelected = day && day.toDateString() === selectedDate.toDateString();
                  const hasAutoDetection = day && autoDetectedMoods[day.toDateString()];

                  return (
                    <Grid item xs={12/7} key={index}>
                      {day ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Box
                            onClick={() => setSelectedDate(day)}
                            sx={{
                              aspectRatio: '1',
                              border: isToday ? '2px solid' : '1px solid',
                              borderColor: isToday ? 'primary.main' : 'divider',
                              borderRadius: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'primary.light' : mood ? `${getMoodColor(mood.type)}10` : 'transparent',
                              position: 'relative',
                              '&:hover': {
                                backgroundColor: isSelected ? 'primary.light' : 'grey.50',
                              },
                            }}
                          >
                            <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
                              {day.getDate()}
                            </Typography>
                            
                            {/* Mood Indicators */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              {mood && (
                                <Box sx={{ color: getMoodColor(mood.type) }}>
                                  {getMoodIcon(mood.type)}
                                </Box>
                              )}
                              {hasAutoDetection && !mood && (
                                <MusicNote 
                                  sx={{ 
                                    fontSize: 16, 
                                    color: '#ff9800',
                                    animation: 'pulse 2s infinite'
                                  }} 
                                />
                              )}
                            </Box>

                            {/* Auto-detection badge */}
                            {hasAutoDetection && !mood && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 2,
                                  right: 2,
                                  width: 8,
                                  height: 8,
                                  backgroundColor: '#ff9800',
                                  borderRadius: '50%',
                                  animation: 'pulse 2s infinite'
                                }}
                              />
                            )}
                          </Box>
                        </motion.div>
                      ) : (
                        <Box sx={{ aspectRatio: '1' }} />
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Selected Date Details */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>

              {(() => {
                const mood = getMoodForDate(selectedDate);
                const autoDetection = autoDetectedMoods[selectedDate.toDateString()];
                
                if (mood) {
                  return (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ backgroundColor: getMoodColor(mood.type) }}>
                          {getMoodIcon(mood.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {mood.type.charAt(0).toUpperCase() + mood.type.slice(1)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Intensity: {mood.intensity}/10
                          </Typography>
                        </Box>
                      </Box>
                      
                      {mood.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          "{mood.notes}"
                        </Typography>
                      )}
                      
                      <Chip
                        label={`Detected via ${mood.source}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  );
                } else if (autoDetection) {
                  return (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <AutoAwesome sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                      <Typography variant="body1" fontWeight="bold" gutterBottom>
                        Mood Detected from Music
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Based on your listening history, we detected: {autoDetection}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => addAutoDetectedMood(selectedDate)}
                        sx={{
                          background: 'linear-gradient(135deg, #ff9800, #ff5722)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ff5722, #ff9800)',
                          },
                        }}
                      >
                        Add to Journal
                      </Button>
                    </Box>
                  );
                } else {
                  return (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CalendarToday sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        No mood entry for this date
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => setShowAddEntry(true)}
                        startIcon={<Add />}
                      >
                        Add Entry
                      </Button>
                    </Box>
                  );
                }
              })()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Entry Dialog */}
      <Dialog
        open={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Add Mood Entry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              How were you feeling?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {moodOptions.map((mood) => (
                <Chip
                  key={mood.value}
                  label={mood.label}
                  onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value }))}
                  sx={{
                    backgroundColor: newEntry.mood === mood.value ? mood.color : 'grey.100',
                    color: newEntry.mood === mood.value ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: newEntry.mood === mood.value ? mood.color : 'grey.200',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Intensity: {newEntry.intensity}/10
            </Typography>
            <Slider
              value={newEntry.intensity}
              onChange={(_, value) => setNewEntry(prev => ({ ...prev, intensity: value as number }))}
              min={1}
              max={10}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <TextField
            fullWidth
            label="Notes (optional)"
            multiline
            rows={3}
            value={newEntry.notes}
            onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Describe your day, what happened, or any specific feelings..."
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowAddEntry(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddEntry}
            variant="contained"
            disabled={!newEntry.mood}
          >
            Save Entry
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default Journal;