import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Alert, Card, CardContent, Chip, Grid, Avatar, IconButton } from '@mui/material';
import { CameraAlt, Close, CheckCircle, PlayArrow, Psychology } from '@mui/icons-material';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

const API_URL = 'http://127.0.0.1:8501';

interface WebcamCaptureProps {
  open: boolean;
  onClose: () => void;
  onMoodDetected: (mood: any) => void;
}

interface StreamlitResponse {
  emotion: string;
  confidence: number;
  predictions: Array<{ emotion: string; score: number; percentage: number }>;
  analysis_method: string;
  model_used: string;
  timestamp: string;
}

const emotionSongs: any = {
  happy: [{ id: 1, title: "Happy", artist: "Pharrell Williams", cover: "" }],
  sad: [{ id: 2, title: "Someone Like You", artist: "Adele", cover: "" }],
  angry: [{ id: 3, title: "Eye of the Tiger", artist: "Survivor", cover: "" }],
  surprise: [{ id: 4, title: "Thunderstruck", artist: "AC/DC", cover: "" }],
  fear: [{ id: 5, title: "Weightless", artist: "Marconi Union", cover: "" }],
  disgust: [{ id: 6, title: "Breathe Me", artist: "Sia", cover: "" }],
  neutral: [{ id: 7, title: "Clair de Lune", artist: "Claude Debussy", cover: "" }]
};

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ open, onClose, onMoodDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('Waiting...');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedMood, setDetectedMood] = useState<any>(null);
  const [error, setError] = useState('');

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      analyzeWithBackend(imageSrc);
    } else {
      setError('Failed to capture image. Please check camera permissions.');
    }
  }, []);

  const analyzeWithBackend = async (imageSrc: string) => {
    setIsAnalyzing(true);
    setError('');
    setProgressMsg('Sending image to backend...');
    try {
      const base64Data = imageSrc.replace(/^data:image\/jpeg;base64,/, '');
      setProgressMsg('Processing image...');
      const response = await fetch(`${API_URL}/analyze-emotion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data })
      });
      if (!response.ok) throw new Error(`Backend error ${response.status}`);
      const result: StreamlitResponse = await response.json();
      console.log('Backend result:', result);
      setProgressMsg('Analysis complete!');
      const songs = emotionSongs[result.emotion] || [];
      setDetectedMood({ ...result, songs });
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. Fallback applied.');
      setProgressMsg('Using fallback analysis...');
      const fallbackEmotion = Object.keys(emotionSongs)[Math.floor(Math.random()*7)];
      setDetectedMood({ emotion: fallbackEmotion, confidence: 0.7, predictions: [], songs: emotionSongs[fallbackEmotion] });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setDetectedMood(null);
    setError('');
    setProgressMsg('Waiting...');
  };

  const handleConfirm = () => {
    if (detectedMood) onMoodDetected(detectedMood);
    handleRetake();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>🧠 AI Emotion Recognition</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="body2" sx={{ mb: 1 }}>{progressMsg}</Typography>
        {!capturedImage && <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" />}
        {capturedImage && <img src={capturedImage} style={{ width: '100%', maxHeight: 300 }} />}
        {isAnalyzing && <CircularProgress />}
        {detectedMood && !isAnalyzing && (
          <Card sx={{ mt: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h5">{detectedMood.emotion}</Typography>
              <Typography variant="body2">Confidence: {Math.round(detectedMood.confidence*100)}%</Typography>
              {detectedMood.songs?.map((song: any) => <Typography key={song.id}>🎵 {song.title} - {song.artist}</Typography>)}
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        {!capturedImage ? (
          <Button onClick={capture} variant="contained" startIcon={<CameraAlt />}>Analyze Emotion</Button>
        ) : (
          <>
            <Button onClick={handleRetake}>Retake</Button>
            <Button onClick={handleConfirm} variant="contained" startIcon={<CheckCircle />}>Confirm Mood</Button>
          </>
        )}
        <Button onClick={onClose} variant="outlined">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebcamCapture;
