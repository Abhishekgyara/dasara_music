import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import { PlayArrow, Favorite, PlaylistAdd } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useMusicStore, Song } from '../store/musicStore';

interface PlaylistRecommendationsProps {
  currentMood: any;
}

const PlaylistRecommendations: React.FC<PlaylistRecommendationsProps> = ({
  currentMood,
}) => {
  const { setCurrentSong, addToQueue, createPlaylist } = useMusicStore();

  // Dummy playlist data based on moods
  const getPlaylistsForMood = (moodType?: string) => {
    const playlists = {
      happy: [
        {
          id: '1',
          name: 'Sunshine Vibes',
          description: 'Upbeat songs to keep your spirits high',
          songs: [
            { id: '1', title: 'Happy Days', artist: 'Sunshine Band', album: 'Summer Vibes', duration: 180, url: '', cover: 'https://picsum.photos/300/300?random=1', genre: 'pop' },
            { id: '2', title: 'Good Vibes Only', artist: 'Positive Energy', album: 'Feel Good Hits', duration: 200, url: '', cover: 'https://picsum.photos/300/300?random=2', genre: 'pop' },
            { id: '3', title: 'Smile', artist: 'Joy Collective', album: 'Happy Times', duration: 175, url: '', cover: 'https://picsum.photos/300/300?random=3', genre: 'pop' },
          ],
          mood: 'happy',
          matchScore: 95,
        },
        {
          id: '2',
          name: 'Dance Party',
          description: 'Energetic tracks to get you moving',
          songs: [
            { id: '4', title: 'Dance All Night', artist: 'Groove Masters', album: 'Party Time', duration: 220, url: '', cover: 'https://picsum.photos/300/300?random=4', genre: 'electronic' },
            { id: '5', title: 'Move Your Body', artist: 'Rhythm Kings', album: 'Dance Floor', duration: 195, url: '', cover: 'https://picsum.photos/300/300?random=5', genre: 'electronic' },
          ],
          mood: 'happy',
          matchScore: 88,
        },
      ],
      sad: [
        {
          id: '3',
          name: 'Comfort Zone',
          description: 'Gentle melodies to soothe your soul',
          songs: [
            { id: '6', title: 'Gentle Rain', artist: 'Peaceful Sounds', album: 'Calm Waters', duration: 240, url: '', cover: 'https://picsum.photos/300/300?random=6', genre: 'ambient' },
            { id: '7', title: 'Soft Embrace', artist: 'Healing Hearts', album: 'Comfort', duration: 280, url: '', cover: 'https://picsum.photos/300/300?random=7', genre: 'ambient' },
          ],
          mood: 'sad',
          matchScore: 92,
        },
        {
          id: '4',
          name: 'Uplifting Journey',
          description: 'Songs to gradually lift your mood',
          songs: [
            { id: '8', title: 'Rise Above', artist: 'Hope Collective', album: 'Better Days', duration: 210, url: '', cover: 'https://picsum.photos/300/300?random=8', genre: 'pop' },
            { id: '9', title: 'New Beginning', artist: 'Fresh Start', album: 'Tomorrow', duration: 225, url: '', cover: 'https://picsum.photos/300/300?random=9', genre: 'pop' },
          ],
          mood: 'sad',
          matchScore: 85,
        },
      ],
      energetic: [
        {
          id: '5',
          name: 'Power Workout',
          description: 'High-energy tracks for maximum motivation',
          songs: [
            { id: '10', title: 'Power Up', artist: 'Energy Boost', album: 'Workout Mix', duration: 180, url: '', cover: 'https://picsum.photos/300/300?random=10', genre: 'electronic' },
            { id: '11', title: 'Push Limits', artist: 'Strength Builders', album: 'Fitness', duration: 190, url: '', cover: 'https://picsum.photos/300/300?random=11', genre: 'electronic' },
          ],
          mood: 'energetic',
          matchScore: 96,
        },
      ],
      calm: [
        {
          id: '6',
          name: 'Peaceful Moments',
          description: 'Serene sounds for relaxation',
          songs: [
            { id: '12', title: 'Ocean Waves', artist: 'Nature Sounds', album: 'Peaceful', duration: 300, url: '', cover: 'https://picsum.photos/300/300?random=12', genre: 'ambient' },
            { id: '13', title: 'Gentle Breeze', artist: 'Calm Collective', album: 'Tranquility', duration: 250, url: '', cover: 'https://picsum.photos/300/300?random=13', genre: 'ambient' },
          ],
          mood: 'calm',
          matchScore: 94,
        },
      ],
      anxious: [
        {
          id: '7',
          name: 'Anxiety Relief',
          description: 'Soothing sounds to calm your mind',
          songs: [
            { id: '14', title: 'Deep Breath', artist: 'Mindful Sounds', album: 'Relaxation', duration: 320, url: '', cover: 'https://picsum.photos/300/300?random=14', genre: 'ambient' },
            { id: '15', title: 'Inner Peace', artist: 'Zen Masters', album: 'Meditation', duration: 280, url: '', cover: 'https://picsum.photos/300/300?random=15', genre: 'ambient' },
          ],
          mood: 'anxious',
          matchScore: 90,
        },
      ],
      focused: [
        {
          id: '8',
          name: 'Deep Focus',
          description: 'Concentration-enhancing tracks',
          songs: [
            { id: '16', title: 'Concentration', artist: 'Focus Group', album: 'Productivity', duration: 240, url: '', cover: 'https://picsum.photos/300/300?random=16', genre: 'ambient' },
            { id: '17', title: 'Mental Clarity', artist: 'Clear Mind', album: 'Focus', duration: 260, url: '', cover: 'https://picsum.photos/300/300?random=17', genre: 'ambient' },
          ],
          mood: 'focused',
          matchScore: 93,
        },
      ],
    };

    return playlists[moodType as keyof typeof playlists] || playlists.happy;
  };

  const playlists = getPlaylistsForMood(currentMood?.type);

  const handlePlayPlaylist = (playlist: any) => {
    if (playlist.songs.length > 0) {
      setCurrentSong(playlist.songs[0]);
      // Add remaining songs to queue
      playlist.songs.slice(1).forEach((song: Song) => {
        addToQueue(song);
      });
    }
  };

  const handleSavePlaylist = (playlist: any) => {
    createPlaylist({
      name: playlist.name,
      description: playlist.description,
      songs: playlist.songs,
      mood: playlist.mood,
    });
  };

  const getMoodColor = (moodType: string) => {
    switch (moodType) {
      case 'happy':
        return '#4caf50';
      case 'sad':
        return '#f44336';
      case 'energetic':
        return '#ff9800';
      case 'calm':
        return '#2196f3';
      case 'anxious':
        return '#ff5722';
      case 'focused':
        return '#795548';
      default:
        return '#9e9e9e';
    }
  };

  if (!currentMood) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No mood detected yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use one of the mood detection methods above to get personalized music recommendations
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Recommended for your {currentMood.type} mood
      </Typography>
      
      <Grid container spacing={3}>
        {playlists.map((playlist, index) => (
          <Grid item xs={12} sm={6} md={4} key={playlist.id}>
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
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: getMoodColor(playlist.mood),
                        mr: 2,
                      }}
                    >
                      {playlist.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {playlist.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {playlist.songs.length} songs
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {playlist.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Mood Match
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {playlist.matchScore}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={playlist.matchScore}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getMoodColor(playlist.mood),
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      label={playlist.mood}
                      size="small"
                      sx={{
                        backgroundColor: getMoodColor(playlist.mood),
                        color: 'white',
                      }}
                    />
                    <Chip
                      label={`${playlist.songs.length} tracks`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => handlePlayPlaylist(playlist)}
                      sx={{
                        flexGrow: 1,
                        backgroundColor: getMoodColor(playlist.mood),
                        '&:hover': {
                          backgroundColor: getMoodColor(playlist.mood),
                        },
                      }}
                    >
                      Play
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PlaylistAdd />}
                      onClick={() => handleSavePlaylist(playlist)}
                    >
                      Save
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlaylistRecommendations; 