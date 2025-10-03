import React, { useState, useEffect, useRef } from 'react';
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
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  LinearProgress, 
  CircularProgress, 
  Slider, 
  TextField, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import {
  CameraAlt,
  MusicNote,
  Psychology,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  Lyrics,
  Close,
  Chat,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import WebcamCapture from '../components/WebcamCapture';
import MoodDetectionModal from '../components/MoodDetectionModal';
import VoiceControl from '../components/VoiceControl';
import SmartPlaylistGenerator from '../components/SmartPlaylistGenerator';
import { useMusicStore } from '../store/musicStore';
import ChatBot from '../components/ChatBot';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';



// Use the Song interface from your store to avoid type conflicts
interface LyricLine {
  text: string;
  time: number;
  duration: number;
}

// Real songs with YouTube video IDs - matching the store's Song interface
const realMoodSongs = {
  happy: [
    {
      id: "1",
      title: "Yemito",
      artist: "Hari Charan",
      album: "Andala Rakshasi",
      duration: 262,
      cover: "https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg",
      mood: "happy",
      genre: "Pop",
      youtubeId: "ZPZmMrUn63w",
      url: "https://www.youtube.com/watch?v=ZPZmMrUn63w"
    },
    {
      id: "2",
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
      id: "3",
      title: "Someone Like You",
      artist: "Adele",
      album: "21",
      duration: 285,
      cover: "https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg",
      mood: "sad",
      genre: "Pop",
      youtubeId: "hLQl3WQQoQ0",
      url: "https://www.youtube.com/watch?v=hLQl3WQQoQ0"
    },
    {
      id: "4",
      title: "The Sound of Silence",
      artist: "Simon & Garfunkel",
      album: "Wednesday Morning, 3 A.M.",
      duration: 184,
      cover: "https://i.ytimg.com/vi/4zLfCnGVeL4/hqdefault.jpg",
      mood: "sad",
      genre: "Folk",
      youtubeId: "4zLfCnGVeL4",
      url: "https://www.youtube.com/watch?v=4zLfCnGVeL4"
    }
  ],
  energetic: [
    {
      id: "5",
      title: "Eye of the Tiger",
      artist: "Survivor",
      album: "Eye of the Tiger",
      duration: 245,
      cover: "https://i.ytimg.com/vi/btPJPFnesV4/hqdefault.jpg",
      mood: "energetic",
      genre: "Rock",
      youtubeId: "btPJPFnesV4",
      url: "https://www.youtube.com/watch?v=btPJPFnesV4"
    },
    {
      id: "6",
      title: "Lose Yourself",
      artist: "Eminem",
      album: "8 Mile",
      duration: 326,
      cover: "https://i.ytimg.com/vi/_Yhyp-_hX2s/hqdefault.jpg",
      mood: "energetic",
      genre: "Hip-Hop",
      youtubeId: "_Yhyp-_hX2s",
      url: "https://www.youtube.com/watch?v=_Yhyp-_hX2s"
    }
  ],
  calm: [
    {
      id: "7",
      title: "Weightless",
      artist: "Marconi Union",
      album: "Weightless",
      duration: 480,
      cover: "https://i.ytimg.com/vi/UfcAVejslrU/hqdefault.jpg",
      mood: "calm",
      genre: "Ambient",
      youtubeId: "UfcAVejslrU",
      url: "https://www.youtube.com/watch?v=UfcAVejslrU"
    },
    {
      id: "8",
      title: "Clair de Lune",
      artist: "Claude Debussy",
      album: "Suite bergamasque",
      duration: 300,
      cover: "https://i.ytimg.com/vi/CvFH_6DNRCY/hqdefault.jpg",
      mood: "calm",
      genre: "Classical",
      youtubeId: "CvFH_6DNRCY",
      url: "https://www.youtube.com/watch?v=CvFH_6DNRCY"
    }

  ]
};

// Mock listening history data
const initialListeningData = [
  { date: '2025-01-01', happy: 30, sad: 15, energetic: 45, calm: 20 },
  { date: '2025-01-02', happy: 25, sad: 20, energetic: 35, calm: 30 },
  { date: '2025-01-03', happy: 40, sad: 10, energetic: 50, calm: 25 },
];

// YouTube Music Player Service
class YouTubeMusicPlayer {
  private player: any = null;
  private isReady: boolean = false;

  initializePlayer(containerId: string, onStateChange: (state: number) => void) {
    return new Promise<void>((resolve) => {
      // Load YouTube IFrame API if not already loaded
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      (window as any).onYouTubeIframeAPIReady = () => {
        this.player = new (window as any).YT.Player(containerId, {
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1
          },
          events: {
            onReady: () => {
              this.isReady = true;
              resolve();
            },
            onStateChange: (event: any) => {
              onStateChange(event.data);
            }
          }
        });
      };
    });
  }

  loadVideo(youtubeId: string, startSeconds: number = 0) {
    if (this.player && this.isReady) {
      this.player.loadVideoById({
        videoId: youtubeId,
        startSeconds: startSeconds
      });
    }
  }

  play() {
    if (this.player && this.isReady) {
      this.player.playVideo();
    }
  }

  pause() {
    if (this.player && this.isReady) {
      this.player.pauseVideo();
    }
  }

  seekTo(seconds: number) {
    if (this.player && this.isReady) {
      this.player.seekTo(seconds, true);
    }
  }

  setVolume(volume: number) {
    if (this.player && this.isReady) {
      this.player.setVolume(volume);
    }
  }

  getCurrentTime(): number {
    if (this.player && this.isReady) {
      return this.player.getCurrentTime();
    }
    return 0;
  }

  getDuration(): number {
    if (this.player && this.isReady) {
      return this.player.getDuration();
    }
    return 0;
  }
}

// OpenRouter Lyrics Service
class OpenRouterLyricsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchRealLyrics(songTitle: string, artist: string, youtubeUrl: string): Promise<LyricLine[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MelodyMind Music App',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content: `You are a music expert. Given a song's YouTube URL, return the EXACT real lyrics with precise timing information in JSON format. 
              Format: {lyrics: [{text: "exact lyric line", time: seconds, duration: seconds}]}
              Use the actual timing from the song and be 100% accurate.`
            },
            {
              role: 'user',
              content: `Get real lyrics with timing for: "${songTitle}" by ${artist}
              YouTube: ${youtubeUrl}
              Return ONLY valid JSON with exact lyrics and proper timing.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.3,
        })
      });

      if (!response.ok) throw new Error('OpenRouter API error');

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) throw new Error('No content received');

      // Parse JSON response
      const parsed = JSON.parse(content);
      return parsed.lyrics || [];
      
    } catch (error) {
      console.error('OpenRouter lyrics error:', error);
      return [];
    }
  }
}

// Initialize services (Replace with your actual API keys)
const youTubePlayer = new YouTubeMusicPlayer();
//uncommment this line
//const lyricsService = new OpenRouterLyricsService('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');

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showWebcam, setShowWebcam] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showSmartPlaylist, setShowSmartPlaylist] = useState(false);
  const [currentMood, setCurrentMood] = useState<any>(null);
  const [selectedMood, setSelectedMood] = useState('all');
  // const [listeningData, setListeningData] = useState(initialListeningData); // unused
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState<LyricLine[]>([]);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  const { currentSong, togglePlay, playSong, listeningHistory, addToHistory } = useMusicStore();
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Song end handler (useCallback for stable reference)
  const handleSongEnd = React.useCallback(() => {
    if (currentSong) {
      addToHistory({
        songId: currentSong.id.toString(), // Convert to string to match store type
        mood: currentSong.mood,
        duration: currentSong.duration,
        completed: true,
      });
    }
    setCurrentTime(0);
    setCurrentLyricIndex(-1);
    setIsPlaying(false);
  }, [currentSong, addToHistory]);

  // Initialize YouTube Player
  useEffect(() => {
    const initializePlayer = async () => {
      if (playerContainerRef.current) {
        await youTubePlayer.initializePlayer('youtube-player', (state) => {
          switch (state) {
            case 1: // Playing
              setIsPlaying(true);
              break;
            case 2: // Paused
              setIsPlaying(false);
              break;
            case 0: // Ended
              handleSongEnd();
              break;
          }
        });
        setPlayerReady(true);
        youTubePlayer.setVolume(volume);
      }
    };

    initializePlayer();
  }, [handleSongEnd, volume]);

  // Sync current time with YouTube player
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        const time = youTubePlayer.getCurrentTime();
        setCurrentTime(Math.floor(time));
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync lyrics highlighting with current time
  useEffect(() => {
    if (currentLyrics.length > 0 && currentTime > 0) {
      const currentIndex = currentLyrics.findIndex((line, index) => {
        const nextLine = currentLyrics[index + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
      });
      
      if (currentIndex !== -1 && currentIndex !== currentLyricIndex) {
        setCurrentLyricIndex(currentIndex);
        
        // Auto-scroll to current lyric
        if (lyricsContainerRef.current && currentIndex > -1) {
          const activeElement = lyricsContainerRef.current.children[currentIndex] as HTMLElement;
          if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
  }, [currentTime, currentLyrics, currentLyricIndex]);

  // (Removed duplicate handleSongEnd)

  const loadLyrics = async (song: any) => {
    setIsLoadingLyrics(true);
    try {
      const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtubeId || song.id}`;
      const lyrics = await lyricsService.fetchRealLyrics(song.title, song.artist, youtubeUrl);
      setCurrentLyrics(lyrics);
    } catch (error) {
      console.error('Error loading lyrics:', error);
      setCurrentLyrics([]);
    }
    setIsLoadingLyrics(false);
  };

  const handleMoodDetected = (mood: any) => {
    setCurrentMood(mood);
    setSelectedMood(mood.type);
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

  const handlePlaySong = async (song: any) => {
    // If it's the same song, just toggle play/pause
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        youTubePlayer.pause();
      } else {
        youTubePlayer.play();
      }
      togglePlay();
      return;
    }

    // Play new song - ensure the song object has all required properties
    const songToPlay = {
      ...song,
      url: song.url || `https://www.youtube.com/watch?v=${song.youtubeId || song.id}`
    };
    playSong(songToPlay);
    
    // Load and play the song
    if (playerReady) {
      const youtubeId = song.youtubeId || song.id;
      youTubePlayer.loadVideo(youtubeId);
      setTimeout(() => {
        youTubePlayer.play();
        setIsPlaying(true);
      }, 100);
    }

    // Load lyrics
    await loadLyrics(song);

    // Add to listening history
    addToHistory({
      songId: song.id.toString(), // Convert to string
      mood: song.mood,
      duration: song.duration,
      completed: false,
    });

    setCurrentTime(0);
    setCurrentLyricIndex(-1);
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const seekTime = Array.isArray(newValue) ? newValue[0] : newValue;
    setCurrentTime(seekTime);
    youTubePlayer.seekTo(seekTime);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(newVolume);
    youTubePlayer.setVolume(newVolume);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    youTubePlayer.setVolume(newMutedState ? 0 : volume);
  };

  const handleNextSong = () => {
    const allSongs = Object.values(realMoodSongs).flat();
    const currentIndex = allSongs.findIndex(song => song.id === currentSong?.id);
    const nextSong = allSongs[(currentIndex + 1) % allSongs.length];
    if (nextSong) handlePlaySong(nextSong);
  };

  const handlePreviousSong = () => {
    const allSongs = Object.values(realMoodSongs).flat();
    const currentIndex = allSongs.findIndex(song => song.id === currentSong?.id);
    const prevSong = allSongs[(currentIndex - 1 + allSongs.length) % allSongs.length];
    if (prevSong) handlePlaySong(prevSong);
  };

  const getFilteredSongs = () => {
    if (selectedMood === 'all') {
      return Object.values(realMoodSongs).flat();
    }
    return realMoodSongs[selectedMood as keyof typeof realMoodSongs] || [];
  };

  const getMoodStats = () => {
    const stats: any = {};
    Object.keys(realMoodSongs).forEach((mood) => {
      const moodHistory = listeningHistory.filter((entry: any) => entry.mood === mood);
      stats[mood] = moodHistory.reduce((total: number, entry: any) => total + entry.duration, 0);
    });
    return stats;
  };

  const moodStats = getMoodStats();
  const chartData = Object.entries(moodStats).map(([mood, duration]) => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    duration: Math.round(Number(duration) / 60),
    color: getMoodColor(mood)
  }));

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Hidden YouTube Player */}
      <div 
        ref={playerContainerRef}
        id="youtube-player"
        style={{ display: 'none' }}
      />

      {/* Lyrics Dialog */}
      <Dialog 
        open={showLyrics} 
        onClose={() => setShowLyrics(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {currentSong ? `🎵 ${currentSong.title} - ${currentSong.artist}` : 'Lyrics'}
            </Typography>
            <IconButton onClick={() => setShowLyrics(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isLoadingLyrics ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Fetching real lyrics from OpenRouter AI...
              </Typography>
            </Box>
          ) : currentLyrics.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                No lyrics available for this song
              </Typography>
            </Box>
          ) : (
            <Box 
              ref={lyricsContainerRef}
              sx={{ 
                maxHeight: 400, 
                overflow: 'auto', 
                py: 2,
                textAlign: 'center'
              }}
            >
              {currentLyrics.map((line, index) => (
                <Typography 
                  key={index}
                  variant="body1" 
                  sx={{ 
                    mb: 2,
                    fontSize: index === currentLyricIndex ? '1.2rem' : '1rem',
                    fontWeight: index === currentLyricIndex ? 'bold' : 'normal',
                    color: index === currentLyricIndex ? theme.palette.primary.main : 'text.primary',
                    background: index === currentLyricIndex ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                    padding: index === currentLyricIndex ? '8px 16px' : '4px 8px',
                    borderRadius: index === currentLyricIndex ? '8px' : '0px',
                    transition: 'all 0.3s ease',
                    transform: index === currentLyricIndex ? 'scale(1.05)' : 'scale(1)',
                    display: 'block'
                  }}
                >
                  {line.text}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
          Welcome to MelodyMind
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Your AI-powered mood-based music companion
        </Typography>
      </motion.div>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { icon: CameraAlt, title: "Detect Your Mood", desc: "Use camera for emotion analysis", action: () => setShowWebcam(true), gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { icon: Psychology, title: "Describe Mood (Text)", desc: "Type how you feel", action: () => setShowTextModal(true), gradient: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)' },
          { icon: MusicNote, title: "Voice Control", desc: "Speak commands or mood", action: () => setShowVoice(true), gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
          { icon: Lyrics, title: "Smart Playlist", desc: "AI-generated playlists", action: () => setShowSmartPlaylist(true), gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' },
        ].map((item, index) => (
          <Grid item xs={12} md={3} key={item.title}>
            <motion.div initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Card sx={{ background: item.gradient, color: 'white', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }} onClick={item.action}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <item.icon sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{item.desc}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Music Player Section */}
      {currentSong && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>🎵 Now Playing</Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={currentSong.cover} sx={{ width: 80, height: 80 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{currentSong.title}</Typography>
                      <Typography variant="body1">{currentSong.artist}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>{currentSong.album}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Progress Bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ minWidth: 40 }}>{formatTime(currentTime)}</Typography>
                      <Slider
                        value={currentTime}
                        max={currentSong.duration}
                        onChange={handleSeek}
                        sx={{ flexGrow: 1, color: 'white' }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 40 }}>{formatTime(currentSong.duration)}</Typography>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                      <IconButton sx={{ color: 'white' }} onClick={handlePreviousSong}>
                        <SkipPrevious />
                      </IconButton>
                      <IconButton 
                        sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                        onClick={() => handlePlaySong(currentSong)}
                      >
                        {isPlaying ? <Pause /> : <PlayArrow />}
                      </IconButton>
                      <IconButton sx={{ color: 'white' }} onClick={handleNextSong}>
                        <SkipNext />
                      </IconButton>
                      <IconButton sx={{ color: 'white' }} onClick={() => setShowLyrics(true)}>
                        <Lyrics />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton sx={{ color: 'white' }} onClick={toggleMute}>
                      {isMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                    <Slider
                      value={volume}
                      onChange={handleVolumeChange}
                      sx={{ flexGrow: 1, color: 'white', maxWidth: 100 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* YouTube Link */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                  Listening via YouTube Music
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  href={currentSong.url || `https://www.youtube.com/watch?v=${currentSong.id}`}

                  target="_blank"
                >
                  Watch on YouTube
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Mood Filtering and Songs Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">🎵 Browse Songs by Mood</Typography>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Mood</InputLabel>
                <Select value={selectedMood} label="Mood" onChange={(e) => setSelectedMood(e.target.value)}>
                  <MenuItem value="all">All Moods</MenuItem>
                  <MenuItem value="happy">Happy</MenuItem>
                  <MenuItem value="sad">Sad</MenuItem>
                  <MenuItem value="energetic">Energetic</MenuItem>
                  <MenuItem value="calm">Calm</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={2}>
              {getFilteredSongs().map((song) => (
                <Grid item xs={12} sm={6} md={4} key={song.id}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 2, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }} onClick={() => handlePlaySong(song)}>
                    <Avatar src={song.cover} sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>{song.title}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{song.artist}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip label={song.mood} size="small" sx={{ backgroundColor: getMoodColor(song.mood), color: 'white', fontSize: '0.7rem', height: 20 }} />
                        <Typography variant="caption" color="text.secondary">{formatTime(song.duration)}</Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }}>
                      {currentSong?.id === song.id && isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>📊 Listening Analytics</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <WebcamCapture open={showWebcam} onClose={() => setShowWebcam(false)} onMoodDetected={handleMoodDetected} />
      <MoodDetectionModal open={showTextModal} onClose={() => setShowTextModal(false)} onMoodDetected={handleMoodDetected} source="text" />
      <VoiceControl open={showVoice} onClose={() => setShowVoice(false)} onMoodDetected={handleMoodDetected} />
      <SmartPlaylistGenerator open={showSmartPlaylist} onClose={() => setShowSmartPlaylist(false)} />

      {/* Floating Chat */}
      <FloatingChat />
    </Box>
  );
};

const predefinedQnA: Record<string, string> = {
  "Play me a happy song": "Try 'Happy' by Pharrell Williams or 'Can't Stop the Feeling' by Justin Timberlake!",
  "Show lyrics of 'Someone Like You'": "You can view the lyrics in the Lyrics section after playing the song.",
  "What's a good workout playlist?": "Energetic songs like 'Eye of the Tiger' by Survivor or 'Lose Yourself' by Eminem work great!",
  "Recommend calm music for studying": "Try 'Weightless' by Marconi Union or 'Clair de Lune' by Debussy for focus."
};

function FloatingChat() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const apiKey = "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";

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    if (predefinedQnA[text]) {
      setMessages(prev => [...prev, { sender: 'bot', text: predefinedQnA[text] }]);
      return;
    }
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: 'You are a helpful music assistant.' },
            { role: 'user', content: text }
          ],
          max_tokens: 500,
          temperature: 0.5
        })
      });
      const data = await response.json();
      const botMessage = data.choices?.[0]?.message?.content || 'Sorry, no response.';
      setMessages(prev => [...prev, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to OpenRouter API.' }]);
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}>
      {!open ? (
        <IconButton
          color="primary"
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, color: 'white', width: 60, height: 60 }}
          onClick={() => setOpen(true)}
        >
          <Chat />
        </IconButton>
      ) : (
        <Paper elevation={6} sx={{ width: 380, height: 480, display: 'flex', flexDirection: 'column', p: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Music ChatBot</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}><Close /></IconButton>
          </Box>
          <Box mb={1} display="flex" flexWrap="wrap" gap={1}>
            {Object.keys(predefinedQnA).map((q, idx) => (
              <Button key={idx} size="small" variant="outlined" onClick={() => sendMessage(q)}>
                {q}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1, border: '1px solid #eee', borderRadius: 1, mb: 1 }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <ListItemText
                    primary={msg.text}
                    sx={{
                      bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                      color: msg.sender === 'user' ? 'white' : 'black',
                      borderRadius: 2,
                      p: 1.5,
                      maxWidth: '75%'
                    }}
                  />
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={input}
              placeholder="Ask me something..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
            />
            <Button variant="contained" onClick={() => sendMessage(input)}>Send</Button>
          </Box>
        </Paper>
      )}
      <ChatBot />
              
    </Box>
    
  );
}

export default Dashboard;