import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVerySatisfied,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  TrendingUp,
  MusicNote,
} from '@mui/icons-material';
import { useMusicStore, Song } from '../store/musicStore';

const Analytics: React.FC = () => {
  const theme = useTheme();
  const { moodHistory, playlists } = useMusicStore();

  // Calculate mood statistics
  const getMoodStats = () => {
    const moodCounts: { [key: string]: number } = {};
    const moodIntensities: { [key: string]: number[] } = {};
    
    moodHistory.forEach(mood => {
      moodCounts[mood.type] = (moodCounts[mood.type] || 0) + 1;
      if (!moodIntensities[mood.type]) {
        moodIntensities[mood.type] = [];
      }
      moodIntensities[mood.type].push(mood.intensity);
    });

    const averageIntensities: { [key: string]: number } = {};
    Object.keys(moodIntensities).forEach(mood => {
      const avg = moodIntensities[mood].reduce((a, b) => a + b, 0) / moodIntensities[mood].length;
      averageIntensities[mood] = Math.round(avg * 10) / 10;
    });

    return { moodCounts, averageIntensities };
  };

  const { moodCounts, averageIntensities } = getMoodStats();

  // Prepare data for charts
  const moodFrequencyData = Object.keys(moodCounts).map(mood => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    count: moodCounts[mood],
    color: getMoodColor(mood),
  }));

  const moodIntensityData = Object.keys(averageIntensities).map(mood => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    intensity: averageIntensities[mood],
    color: getMoodColor(mood),
  }));

  // Weekly mood trend (last 7 days)
  const getWeeklyTrend = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayMoods = moodHistory.filter(mood => 
        new Date(mood.timestamp).toDateString() === date.toDateString()
      );
      
      const avgIntensity = dayMoods.length > 0 
        ? dayMoods.reduce((sum, mood) => sum + mood.intensity, 0) / dayMoods.length
        : 0;

      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        intensity: Math.round(avgIntensity * 10) / 10,
        count: dayMoods.length,
      });
    }
    return last7Days;
  };

  const weeklyTrendData = getWeeklyTrend();

  // Music genre preferences by mood
  const getGenrePreferences = () => {
    const genreByMood: { [key: string]: { [key: string]: number } } = {};
    
    playlists.forEach(playlist => {
  playlist.songs.forEach((song: Song) => {
    if (playlist.mood && song.genre) {
      genreByMood[playlist.mood] = genreByMood[playlist.mood] || {};
      genreByMood[playlist.mood][song.genre] =
        (genreByMood[playlist.mood][song.genre] || 0) + 1;
    }
  });
});

    return genreByMood;
  };

  const genrePreferences = getGenrePreferences();

  function getMoodColor(moodType: string) {
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
  }

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Mood Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your emotional patterns and discover insights about your mood-music relationship
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: 'primary.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {moodHistory.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Entries
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: 'success.main' }}>
                  <SentimentVerySatisfied />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {Object.keys(moodCounts).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mood Types
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: 'info.main' }}>
                  <MusicNote />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {playlists.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Playlists Created
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: 'warning.main' }}>
                  <SentimentSatisfied />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {moodHistory.length > 0 
                      ? Math.round(moodHistory.reduce((sum, mood) => sum + mood.intensity, 0) / moodHistory.length * 10) / 10
                      : 0
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Intensity
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Mood Frequency Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mood Frequency
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mood" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Mood Intensity Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Mood Intensity
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodIntensityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mood" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="intensity" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Trend */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Mood Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Mood Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mood Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodFrequencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ mood, percent }) => `${mood} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {moodFrequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Most Common Moods */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Common Moods
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {moodFrequencyData
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((mood, index) => (
                    <Box key={mood.mood} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: mood.color }}>
                        {getMoodIcon(mood.mood.toLowerCase())}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {mood.mood}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mood.count} entries
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${Math.round((mood.count / moodHistory.length) * 100)}%`}
                        size="small"
                        sx={{ backgroundColor: mood.color, color: 'white' }}
                      />
                    </Box>
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Music Genre Preferences */}
        {Object.keys(genrePreferences).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Music Genre Preferences by Mood
                </Typography>
                <Grid container spacing={2}>
                  {Object.keys(genrePreferences).map(mood => (
                    <Grid item xs={12} sm={6} md={4} key={mood}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {mood.charAt(0).toUpperCase() + mood.slice(1)}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(genrePreferences[mood])
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 3)
                              .map(([genre, count]) => (
                                <Chip
                                  key={genre}
                                  label={`${genre} (${count})`}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Analytics;