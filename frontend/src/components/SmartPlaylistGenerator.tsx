import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Snackbar,
  Slider,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Add,
  MusicNote,
  Psychology,
  CameraAlt,
  Mic,
  Delete,
  TrendingUp,
  SmartToy,
  CheckCircle,
  QueueMusic,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import WebcamCapture from './WebcamCapture';
import MoodDetectionModal from './MoodDetectionModal';
import VoiceControl from './VoiceControl';
import { useMusicStore } from '../store/musicStore';

// YouTube Player Utility - COMPLETELY FIXED VERSION
let ytPlayer: any = null;
let ytPlayerReady = false;

declare global {
  interface Window {
    onYouTubeIframeAPIReady: (() => void) | undefined;
    YT: any;
  }
}

const loadYouTubeAPI = () =>
  new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      ytPlayerReady = true;
      return resolve();
    }
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    
    window.onYouTubeIframeAPIReady = () => {
      ytPlayerReady = true;
      resolve();
    };
    
    document.body.appendChild(tag);
  });

const createYTPlayer = (videoId: string, onStateChange: (state: number) => void) => {
  try {
    // Clear existing player
    if (ytPlayer) {
      ytPlayer.destroy();
      ytPlayer = null;
    }

    // Create player container if it doesn't exist
    let playerContainer = document.getElementById('smartplaylist-youtube-player');
    if (!playerContainer) {
      playerContainer = document.createElement('div');
      playerContainer.id = 'smartplaylist-youtube-player';
      document.body.appendChild(playerContainer);
    }

    console.log('Creating YouTube player for video:', videoId);
    
    ytPlayer = new window.YT.Player('smartplaylist-youtube-player', {
      height: '0',
      width: '0',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0
      },
      events: {
        onReady: (event: any) => {
          console.log('YouTube player ready');
          event.target.playVideo();
        },
        onStateChange: (event: any) => {
          console.log('Player state changed:', event.data);
          onStateChange(event.data);
        },
        onError: (error: any) => {
          console.error('YouTube player error:', error);
        }
      }
    });

    return ytPlayer;
  } catch (error) {
    console.error('Error creating YouTube player:', error);
    throw error;
  }
};

const playYT = () => {
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.playVideo();
  }
};

const pauseYT = () => {
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    ytPlayer.pauseVideo();
  }
};

const stopYT = () => {
  if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
    ytPlayer.stopVideo();
  }
};

const getYTTime = () => {
  if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
    return ytPlayer.getCurrentTime();
  }
  return 0;
};

const seekYT = (time: number) => {
  if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
    ytPlayer.seekTo(time, true);
  }
};

interface SmartPlaylistGeneratorProps {
  open: boolean;
  onClose: () => void;
}

interface GeneratedPlaylist {
  id: string;
  name: string;
  description: string;
  mood: string;
  songs: any[];
  createdAt: Date;
  source: 'camera' | 'voice' | 'text';
}

// Real YouTube songs with working IDs
const realMoodSongs = {
  happy: [
    {
      id: "happy1",
      title: "Happy - Pharrell Williams",
      artist: "Pharrell Williams",
      album: "Girl",
      duration: 233,
      cover: "https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg",
      mood: "happy",
      genre: "Pop",
      youtubeId: "ZbZSe6N_BXs",
      url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs"
    },
    {
      id: "happy2",
      title: "Can't Stop the Feeling",
      artist: "Justin Timberlake",
      album: "Trolls",
      duration: 237,
      cover: "https://i.ytimg.com/vi/ru0K8uYEZWw/hqdefault.jpg",
      mood: "happy",
      genre: "Pop",
      youtubeId: "ru0K8uYEZWw",
      url: "https://www.youtube.com/watch?v=ru0K8uYEZWw"
    }
  ],
  sad: [
    {
      id: "sad1",
      title: "Someone Like You",
      artist: "Adele",
      album: "21",
      duration: 285,
      cover: "https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg",
      mood: "sad",
      genre: "Pop",
      youtubeId: "hLQl3WQQoQ0",
      url: "https://www.youtube.com/watch?v=hLQl3WQQoQ0"
    }
  ],
  energetic: [
    {
      id: "energy1",
      title: "Eye of the Tiger",
      artist: "Survivor",
      album: "Eye of the Tiger",
      duration: 245,
      cover: "https://i.ytimg.com/vi/btPJPFnesV4/hqdefault.jpg",
      mood: "energetic",
      genre: "Rock",
      youtubeId: "btPJPFnesV4",
      url: "https://www.youtube.com/watch?v=btPJPFnesV4"
    }
  ],
  calm: [
    {
      id: "calm1",
      title: "Weightless",
      artist: "Marconi Union",
      album: "Weightless",
      duration: 480,
      cover: "https://i.ytimg.com/vi/UfcAVejslrU/hqdefault.jpg",
      mood: "calm",
      genre: "Ambient",
      youtubeId: "UfcAVejslrU",
      url: "https://www.youtube.com/watch?v=UfcAVejslrU"
    }
  ],
  anxious: [
    {
      id: "anxious1",
      title: "Breathe Me",
      artist: "Sia",
      album: "Colour the Small One",
      duration: 268,
      cover: "https://i.ytimg.com/vi/2To6qk1API4/hqdefault.jpg",
      mood: "anxious",
      genre: "Pop",
      youtubeId: "2To6qk1API4",
      url: "https://www.youtube.com/watch?v=2To6qk1API4"
    }
  ],
  focused: [
    {
      id: "focused1",
      title: "Focus",
      artist: "Ariana Grande",
      album: "Dangerous Woman",
      duration: 210,
      cover: "https://i.ytimg.com/vi/6GUmDlKYp24/hqdefault.jpg",
      mood: "focused",
      genre: "Pop",
      youtubeId: "6GUmDlKYp24",
      url: "https://www.youtube.com/watch?v=6GUmDlKYp24"
    }
  ]
};

// Mood-based quotes
const moodQuotes = {
  happy: ["🎵 Happiness is the secret to all beauty!", "🌟 Let the music lift your spirits!"],
  sad: ["💙 Music understands feelings better than words", "🌧️ Every storm runs out of rain"],
  energetic: ["⚡ Get ready to conquer the world!", "🔥 Fuel your fire with powerful beats!"],
  calm: ["🌊 Let gentle waves of music wash over you", "🍃 Find your center with melodies"],
  anxious: ["🌬️ Breathe deeply - let music calm you", "🕯️ Gentle melodies to ease your mind"],
  focused: ["🎯 Laser focus activated!", "📚 Perfect for deep work sessions"]
};

// Fancy playlist name generators for each mood
const playlistNameGenerators = {
  happy: () => {
    const prefixes = ['Radiant', 'Sunshine', 'Joyful', 'Blissful'];
    const suffixes = ['Vibes', 'Melodies', 'Harmonies', 'Grooves'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  sad: () => {
    const prefixes = ['Melancholy', 'Serene', 'Reflective', 'Tranquil'];
    const suffixes = ['Whispers', 'Echoes', 'Memories', 'Dreams'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  energetic: () => {
    const prefixes = ['Electric', 'Dynamic', 'Power', 'Adrenaline'];
    const suffixes = ['Pulse', 'Rush', 'Surge', 'Drive'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  calm: () => {
    const prefixes = ['Peaceful', 'Gentle', 'Soothing', 'Calm'];
    const suffixes = ['Waves', 'Breeze', 'Stillness', 'Zen'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  anxious: () => {
    const prefixes = ['Soothing', 'Comforting', 'Calming', 'Healing'];
    const suffixes = ['Sanctuary', 'Haven', 'Retreat', 'Shelter'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  focused: () => {
    const prefixes = ['Focused', 'Productive', 'Concentrated', 'Mindful'];
    const suffixes = ['Flow', 'Zone', 'Focus', 'Clarity'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }
};

const SmartPlaylistGenerator: React.FC<SmartPlaylistGeneratorProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [currentMood, setCurrentMood] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaylists, setGeneratedPlaylists] = useState<GeneratedPlaylist[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [isPlayingPlaylist, setIsPlayingPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);

  const { addToQueue } = useMusicStore();
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Initialize YouTube API when dialog opens
  useEffect(() => {
    isMountedRef.current = true;
    
    if (open) {
      loadYouTubeAPI().then(() => {
        if (isMountedRef.current) {
          setPlayerReady(true);
        }
      }).catch(err => {
        console.error('Failed to load YouTube API:', err);
        if (isMountedRef.current) {
          setError('Failed to initialize audio player.');
        }
      });
    }

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
      
      // Clean up YouTube player
      if (ytPlayer) {
        try {
          ytPlayer.stopVideo();
          ytPlayer.destroy();
        } catch (e) {
          console.log('Error cleaning up YouTube player:', e);
        }
        ytPlayer = null;
      }
    };
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      // Stop playback
      if (ytPlayer) {
        pauseYT();
        stopYT();
      }
      
      if (isMountedRef.current) {
        setIsPlaying(false);
        setCurrentSong(null);
        setIsPlayingPlaylist(false);
        setCurrentTime(0);
        setCurrentPlaylistId(null);
        setError('');
      }
      
      // Clear interval
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }
  }, [open]);

  // Handle time updates - FIXED VERSION
  useEffect(() => {
    // Clear existing interval
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }

    // Only set up interval if we're playing and have a valid player
    if (isPlaying && ytPlayer) {
      timeIntervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        
        try {
          const time = getYTTime();
          setCurrentTime(time);
          
          // Safety check for song end
          if (currentSong && time >= currentSong.duration - 1) {
            handleSongEnd();
          }
        } catch (err) {
          console.error('Error getting current time:', err);
          // If we get an error, clear the interval
          if (timeIntervalRef.current) {
            clearInterval(timeIntervalRef.current);
            timeIntervalRef.current = null;
          }
        }
      }, 1000);
    }
    
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    };
  }, [isPlaying, currentSong]);

  const handleSongEnd = useCallback(() => {
    console.log('Song ended, moving to next...');
    
    if (!isMountedRef.current) return;

    // Clear interval first
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }

    if (isPlayingPlaylist && currentPlaylistId) {
      const currentPlaylist = generatedPlaylists.find(p => p.id === currentPlaylistId);
      if (currentPlaylist && currentPlaylist.songs.length > 0) {
        const currentSongIndex = currentPlaylist.songs.findIndex(song => song.id === currentSong?.id);
        if (currentSongIndex < currentPlaylist.songs.length - 1) {
          // Play next song in playlist
          const nextSong = currentPlaylist.songs[currentSongIndex + 1];
          console.log('Playing next song:', nextSong.title);
          setTimeout(() => {
            if (isMountedRef.current) {
              handlePlaySong(nextSong, currentPlaylist.id);
            }
          }, 500);
          return;
        } else {
          // End of playlist - COMPLETELY STOP PLAYBACK
          console.log('Playlist completed - stopping playback');
          if (ytPlayer) {
            stopYT();
          }
          setIsPlayingPlaylist(false);
          setCurrentPlaylistId(null);
          setCurrentSong(null);
          setIsPlaying(false);
          setCurrentTime(0);
          setSuccessMessage('🎊 Playlist completed! Ready for your next mood adventure!');
        }
      }
    } else {
      // Single song ended
      if (ytPlayer) {
        stopYT();
      }
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isPlayingPlaylist, currentPlaylistId, generatedPlaylists, currentSong]);

  const handlePlaySong = useCallback(async (song: any, playlistId?: string) => {
    if (!playerReady || !ytPlayerReady) {
      setError('Audio player is not ready yet. Please wait...');
      return;
    }

    try {
      // Extract video ID from YouTube URL or use direct ID
      const videoId = song.youtubeId || 
                     (song.url && song.url.includes('youtube.com') ? 
                      song.url.split('v=')[1].split('&')[0] : null);

      if (!videoId) {
        throw new Error('No valid YouTube video ID found');
      }

      console.log('Playing song:', song.title, 'Video ID:', videoId);

      // Stop current playback
      if (ytPlayer) {
        ytPlayer.stopVideo();
      }

      // Create new player instance
      createYTPlayer(videoId, (state: number) => {
        if (!isMountedRef.current) return;
        
        switch (state) {
          case window.YT.PlayerState.PLAYING:
            setIsPlaying(true);
            break;
          case window.YT.PlayerState.PAUSED:
            setIsPlaying(false);
            break;
          case window.YT.PlayerState.ENDED:
            handleSongEnd();
            break;
        }
      });

      setCurrentSong(song);
      setCurrentTime(0);
      
      if (playlistId) {
        setCurrentPlaylistId(playlistId);
      }

    } catch (err) {
      console.error('Error playing song:', err);
      setError('Failed to play song. Please try again.');
      setIsPlaying(false);
    }
  }, [playerReady, ytPlayerReady, handleSongEnd]);

  const playPlaylist = useCallback((playlist: GeneratedPlaylist) => {
    if (playlist.songs.length > 0) {
      console.log('Starting playlist:', playlist.name);
      
      const playlistIndex = generatedPlaylists.findIndex(p => p.id === playlist.id);
      setCurrentPlaylistIndex(playlistIndex);
      setIsPlayingPlaylist(true);
      
      // Stop any current playback
      if (ytPlayer) {
        pauseYT();
        stopYT();
      }

      // Reset states
      setIsPlaying(false);
      setCurrentTime(0);

      // Clear any existing interval
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }

      // Play the first song in the playlist
      handlePlaySong(playlist.songs[0], playlist.id);
    } else {
      setError('This playlist has no songs.');
    }
  }, [generatedPlaylists, handlePlaySong]);

  const togglePlayPause = useCallback(() => {
    if (!currentSong) {
      setError('No song selected to play.');
      return;
    }

    if (isPlaying) {
      pauseYT();
      setIsPlaying(false);
      
      // Clear interval when pausing
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    } else {
      if (currentSong.youtubeId && ytPlayer) {
        playYT();
        setIsPlaying(true);
      } else {
        // Re-initialize player
        handlePlaySong(currentSong, currentPlaylistId || undefined);
      }
    }
  }, [currentSong, isPlaying, currentPlaylistId, handlePlaySong]);

  const playNextSongInPlaylist = useCallback(() => {
    if (!currentPlaylistId) {
      setError('No active playlist.');
      return;
    }
    
    const currentPlaylist = generatedPlaylists.find(p => p.id === currentPlaylistId);
    if (currentPlaylist && currentPlaylist.songs.length > 0) {
      const currentSongIndex = currentPlaylist.songs.findIndex(song => song.id === currentSong?.id);
      if (currentSongIndex < currentPlaylist.songs.length - 1) {
        handlePlaySong(currentPlaylist.songs[currentSongIndex + 1], currentPlaylistId);
      } else {
        setSuccessMessage('🎊 Reached the end of the playlist!');
      }
    }
  }, [currentPlaylistId, generatedPlaylists, currentSong, handlePlaySong]);

  const playPreviousSongInPlaylist = useCallback(() => {
    if (!currentPlaylistId) {
      setError('No active playlist.');
      return;
    }
    
    const currentPlaylist = generatedPlaylists.find(p => p.id === currentPlaylistId);
    if (currentPlaylist && currentPlaylist.songs.length > 0) {
      const currentSongIndex = currentPlaylist.songs.findIndex(song => song.id === currentSong?.id);
      if (currentSongIndex > 0) {
        handlePlaySong(currentPlaylist.songs[currentSongIndex - 1], currentPlaylistId);
      } else {
        setError('This is the first song in the playlist.');
      }
    }
  }, [currentPlaylistId, generatedPlaylists, currentSong, handlePlaySong]);

  const handleSeek = useCallback((event: Event, value: number | number[]) => {
    const seekTo = typeof value === 'number' ? value : value[0];
    setCurrentTime(seekTo);
    seekYT(seekTo);
  }, []);

  const handleMoodDetected = async (mood: any) => {
    setCurrentMood(mood);
    setError('');
    await generateRecommendations(mood);
  };

  const generateRecommendations = async (mood: any) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const moodType = mood.type || mood.moodLabel;
      const moodSongsList = realMoodSongs[moodType as keyof typeof realMoodSongs] || [];
      setRecommendations(moodSongsList);
    } catch (err) {
      setError('Failed to generate recommendations.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSmartPlaylist = async (source: 'camera' | 'voice' | 'text') => {
    if (!currentMood) {
      setError('Please detect your mood first');
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const moodType = currentMood.type || currentMood.moodLabel;
      const nameGenerator = playlistNameGenerators[moodType as keyof typeof playlistNameGenerators] || playlistNameGenerators.happy;
      
      // Generate unique name
      let playlistName = '';
      let attempts = 0;
      const usedNames = new Set(generatedPlaylists.map(p => p.name));
      
      do {
        playlistName = nameGenerator();
        attempts++;
      } while (usedNames.has(playlistName) && attempts < 20);

      // If still not unique, add timestamp
      if (usedNames.has(playlistName)) {
        playlistName = `${playlistName} ${new Date().getTime()}`;
      }

      const newPlaylist: GeneratedPlaylist = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: playlistName,
        description: `AI-generated ${moodType} playlist based on your ${source} mood detection`,
        mood: moodType,
        songs: [...recommendations], // Create a copy to avoid reference issues
        createdAt: new Date(),
        source,
      };
      
      setGeneratedPlaylists(prev => [newPlaylist, ...prev]);
      setSuccessMessage(`🎉 Playlist "${playlistName}" created with ${recommendations.length} songs!`);
      setTabValue(1);
      
    } catch (err) {
      setError('Failed to generate playlist.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRandomQuote = (moodType: string) => {
    const quotes = moodQuotes[moodType as keyof typeof moodQuotes] || moodQuotes.happy;
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const getMoodColor = (moodType: string) => {
    const colors = {
      happy: '#4caf50',
      sad: '#f44336',
      energetic: '#ff9800',
      calm: '#2196f3',
      anxious: '#ff5722',
      focused: '#795548',
    };
    return colors[moodType as keyof typeof colors] || '#9e9e9e';
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    // Stop all playback before closing
    if (ytPlayer) {
      stopYT();
      pauseYT();
    }
    setIsPlaying(false);
    setCurrentSong(null);
    setIsPlayingPlaylist(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <SmartToy sx={{ color: 'white' }} />
            <Typography variant="h5" fontWeight="bold" color="white">
              Smart Playlist Generator
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <Delete />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, background: 'white' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab icon={<Psychology />} label="Mood Detection" />
            <Tab icon={<QueueMusic />} label={`Playlists (${generatedPlaylists.length})`} />
            <Tab icon={<TrendingUp />} label="Recommendations" />
          </Tabs>
        </Box>

        {/* Mood Detection Tab - JSX remains the same as before */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detect Your Mood to Generate Smart Playlists
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {!playerReady && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Initializing audio player...
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => setShowWebcam(true)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <CameraAlt sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Camera Mood Detection
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Use facial expressions to detect your mood
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => setShowTextModal(true)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Psychology sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Text Mood Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Describe your mood in text
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => setShowVoice(true)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Mic sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Voice Mood Detection
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Speak to detect mood and control music
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {currentMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Detected Mood
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Chip
                            label={currentMood.type || currentMood.moodLabel}
                            sx={{
                              backgroundColor: getMoodColor(currentMood.type || currentMood.moodLabel),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Confidence: {Math.round((currentMood.confidence || 0.5) * 100)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => generateSmartPlaylist(currentMood.source || 'text')}
                        disabled={isGenerating || recommendations.length === 0 || !playerReady}
                        startIcon={isGenerating ? <CircularProgress size={20} /> : <Add />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {isGenerating ? 'Generating...' : `Create Playlist (${recommendations.length} songs)`}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Box>
        )}

        {/* Generated Playlists Tab - JSX remains the same */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" gutterBottom>
                Your Generated Playlists ({generatedPlaylists.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {generatedPlaylists.reduce((total, playlist) => total + playlist.songs.length, 0)} songs
              </Typography>
            </Box>

            {generatedPlaylists.length === 0 ? (
              <Box textAlign="center" py={4}>
                <QueueMusic sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No playlists generated yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detect your mood first to generate smart playlists
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {generatedPlaylists.map((playlist, index) => (
                  <Grid item xs={12} key={playlist.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box flex={1}>
                              <Box display="flex" alignItems="center" gap={2} mb={1}>
                                <Box sx={{ width: '100%' }}>
                                  <Box display="flex" alignItems="center" gap={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                      {playlist.name}
                                    </Typography>
                                    {isPlayingPlaylist && currentPlaylistId === playlist.id && (
                                      <Chip 
                                        label="Now Playing" 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined" 
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {playlist.description}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Chip
                                  label={playlist.mood}
                                  size="small"
                                  sx={{
                                    backgroundColor: getMoodColor(playlist.mood),
                                    color: 'white',
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {playlist.songs.length} songs • Created {playlist.createdAt.toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlayArrow />}
                                onClick={() => playPlaylist(playlist)}
                                disabled={!playerReady}
                              >
                                Play
                              </Button>
                            </Box>
                          </Box>
                          
                          {/* Playlist Songs Preview */}
                          <Box mt={2}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Songs in this playlist:
                            </Typography>
                            <Grid container spacing={1}>
                              {playlist.songs.slice(0, 3).map((song, songIndex) => (
                                <Grid item xs={12} sm={6} md={4} key={song.id}>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar src={song.cover} sx={{ width: 32, height: 32 }} />
                                    <Box flex={1}>
                                      <Typography variant="body2" noWrap>
                                        {song.title}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        {song.artist}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                              {playlist.songs.length > 3 && (
                                <Grid item xs={12}>
                                  <Typography variant="caption" color="text.secondary">
                                    +{playlist.songs.length - 3} more songs
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Box>

                          {/* Now Playing Controls */}
                          {isPlayingPlaylist && currentPlaylistId === playlist.id && currentSong && (
                            <Box mt={3} p={2} sx={{ backgroundColor: 'action.hover', borderRadius: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Now Playing: {currentSong.title} - {currentSong.artist}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={2}>
                                <IconButton size="small" onClick={playPreviousSongInPlaylist}>
                                  <SkipPrevious />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={togglePlayPause}
                                  color="primary"
                                >
                                  {isPlaying ? <Pause /> : <PlayArrow />}
                                </IconButton>
                                <IconButton size="small" onClick={playNextSongInPlaylist}>
                                  <SkipNext />
                                </IconButton>
                                <Typography variant="caption" sx={{ minWidth: 40 }}>
                                  {formatTime(currentTime)}
                                </Typography>
                                <Slider
                                  value={currentTime}
                                  max={currentSong.duration}
                                  sx={{ flexGrow: 1 }}
                                  size="small"
                                  onChange={handleSeek}
                                />
                                <Typography variant="caption" sx={{ minWidth: 40 }}>
                                  {formatTime(currentSong.duration)}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Recommendations Tab - JSX remains the same */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI-Powered Song Recommendations
            </Typography>

            {currentMood && (
              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)' }}>
                <CardContent>
                  <Typography variant="body1" fontStyle="italic" textAlign="center">
                    {getRandomQuote(currentMood.type || currentMood.moodLabel)}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {recommendations.length === 0 ? (
              <Box textAlign="center" py={4}>
                <TrendingUp sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No recommendations yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detect your mood to get personalized song recommendations
                </Typography>
              </Box>
            ) : (
              <List>
                {recommendations.map((song, index) => (
                  <ListItem
                    key={song.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={song.cover} alt={song.title}>
                        <MusicNote />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={song.title}
                      secondary={`${song.artist} • ${song.album} • ${formatTime(song.duration)}`}
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handlePlaySong(song)}
                          color="primary"
                          disabled={!playerReady}
                        >
                          {currentSong?.id === song.id && isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => addToQueue(song)}
                          color="secondary"
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          icon={<CheckCircle />}
          sx={{ 
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Mood Detection Modals */}
      <WebcamCapture
        open={showWebcam}
        onClose={() => setShowWebcam(false)}
        onMoodDetected={handleMoodDetected}
      />

      <MoodDetectionModal
        open={showTextModal}
        onClose={() => setShowTextModal(false)}
        onMoodDetected={handleMoodDetected}
        source="text"
      />

      <VoiceControl
        open={showVoice}
        onClose={() => setShowVoice(false)}
        onMoodDetected={handleMoodDetected}
      />
    </Dialog>
  );
};

export default SmartPlaylistGenerator;