import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { useMusicStore } from '../store/musicStore';

const MusicPlayer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    currentTime, 
    duration,
    togglePlay, 
    playNext, 
    playPrevious, 
    setVolume,
    seekTo 
  } = useMusicStore();
  const [showVolume, setShowVolume] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <Card
      sx={{
        position: 'fixed',
        bottom: isMobile ? 56 : 0, // Account for bottom navigation on mobile
        left: 0,
        right: 0,
        zIndex: 1001,
        borderRadius: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <CardContent sx={{ py: 1, px: 2 }}>
        {/* Progress Bar */}
        <Slider
          value={duration > 0 ? currentTime : 0}
          max={duration || 100}
          onChange={(_, value) => seekTo(value as number)}
          sx={{
            mb: 1,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
            },
            '& .MuiSlider-track': {
              height: 2,
            },
            '& .MuiSlider-rail': {
              height: 2,
            },
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Song Cover */}
          <Avatar
            src={currentSong.cover}
            alt={currentSong.title}
            sx={{ width: 48, height: 48 }}
          />

          {/* Song Info */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentSong.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentSong.artist}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'flex', gap: 1 }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={playPrevious}>
              <SkipPrevious />
            </IconButton>
            
            <IconButton
              size="large"
              onClick={togglePlay}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            
            <IconButton size="small" onClick={playNext}>
              <SkipNext />
            </IconButton>
          </Box>

          {/* Volume Control */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setShowVolume(!showVolume)}
            >
              {volume === 0 ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            
            {showVolume && (
              <Slider
                value={volume}
                onChange={(_, value) => setVolume(value as number)}
                min={0}
                max={1}
                step={0.1}
                sx={{ width: 100 }}
                size="small"
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer; 