import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Slider,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';

interface MoodDetectionModalProps {
  open: boolean;
  onClose: () => void;
  onMoodDetected: (mood: any) => void;
  source: 'text' | 'camera' | 'voice';
}

// Emotion labels
const emotionLabels = ['happy', 'sad', 'angry', 'anxious', 'calm', 'surprised', 'neutral', 'energetic', 'melancholic', 'focused', 'excited'];

interface EmotionPattern {
  keywords: string[];
  intensityWords: {
    high: string[];
    medium: string[];
    low: string[];
  };
  positiveModifiers?: string[];
  negativeModifiers?: string[];
}

class TextEmotionAnalyzer {
  // Enhanced emotion patterns with weights and context
  private emotionPatterns: { [key: string]: EmotionPattern } = {
    happy: {
      keywords: [
        'happy', 'joy', 'joyful', 'excited', 'excitement', 'great', 'wonderful', 'amazing', 
        'good', 'fantastic', 'awesome', 'love', 'perfect', 'excellent', 'beautiful', 
        'brilliant', 'fabulous', 'marvelous', 'delighted', 'pleased', 'ecstatic', 
        'thrilled', 'overjoyed', 'bliss', 'content', 'satisfied', 'grateful', 'blessed',
        'smiling', 'laughing', 'laugh', 'fun', 'enjoy', 'celebration', 'party'
      ],
      intensityWords: {
        high: ['ecstatic', 'thrilled', 'overjoyed', 'euphoric', 'blissful'],
        medium: ['happy', 'joyful', 'delighted', 'pleased'],
        low: ['content', 'satisfied', 'fine', 'okay']
      },
      positiveModifiers: ['very', 'really', 'so', 'extremely', 'absolutely', 'completely', 'totally'],
      negativeModifiers: ['not very', 'slightly', 'a little', 'somewhat']
    },
    sad: {
      keywords: [
        'sad', 'sadness', 'depressed', 'depression', 'unhappy', 'miserable', 'down', 
        'blue', 'heartbroken', 'lonely', 'alone', 'upset', 'cry', 'crying', 'tears', 
        'miss', 'missing', 'grief', 'grieving', 'sorrow', 'melancholy', 'disappointed',
        'disappointment', 'regret', 'hopeless', 'despair', 'gloomy', 'dismal'
      ],
      intensityWords: {
        high: ['heartbroken', 'devastated', 'despair', 'hopeless', 'miserable'],
        medium: ['sad', 'depressed', 'unhappy', 'upset'],
        low: ['down', 'blue', 'melancholy', 'gloomy']
      },
      positiveModifiers: ['very', 'really', 'so', 'extremely', 'completely'],
      negativeModifiers: ['a little', 'slightly', 'somewhat']
    },
    angry: {
      keywords: [
        'angry', 'anger', 'mad', 'furious', 'fury', 'annoyed', 'annoyance', 'frustrated', 
        'frustration', 'irritated', 'irritation', 'rage', 'raging', 'hate', 'hatred', 
        'dislike', 'pissed', 'outraged', 'livid', 'fuming', 'seething', 'bitter',
        'resentful', 'hostile', 'aggressive', 'temper', 'outburst'
      ],
      intensityWords: {
        high: ['furious', 'enraged', 'livid', 'seething', 'outraged'],
        medium: ['angry', 'mad', 'frustrated', 'annoyed'],
        low: ['irritated', 'bothered', 'aggravated']
      },
      positiveModifiers: ['very', 'really', 'so', 'extremely', 'absolutely'],
      negativeModifiers: ['a little', 'slightly', 'somewhat']
    },
    anxious: {
      keywords: [
        'anxious', 'anxiety', 'nervous', 'worried', 'worry', 'scared', 'afraid', 
        'fearful', 'fear', 'stressed', 'stress', 'panic', 'panicked', 'tense', 
        'apprehensive', 'uneasy', 'restless', 'overwhelmed', 'pressure', 'dread',
        'paranoid', 'insecurity', 'insecure', 'uncertain', 'uncertainty'
      ],
      intensityWords: {
        high: ['panicked', 'terrified', 'overwhelmed', 'desperate'],
        medium: ['anxious', 'nervous', 'worried', 'stressed'],
        low: ['uneasy', 'apprehensive', 'concerned']
      },
      positiveModifiers: ['very', 'really', 'so', 'extremely', 'incredibly'],
      negativeModifiers: ['a little', 'slightly', 'somewhat']
    },
    calm: {
      keywords: [
        'calm', 'calmness', 'relaxed', 'relaxation', 'peaceful', 'peace', 'chill', 
        'serene', 'tranquil', 'quiet', 'still', 'relaxing', 'mellow', 'laidback',
        'composed', 'collected', 'balanced', 'centered', 'meditative', 'mindful',
        'soothing', 'gentle', 'easygoing', 'unhurried', 'leisurely'
      ],
      intensityWords: {
        high: ['serene', 'tranquil', 'blissful', 'zen'],
        medium: ['calm', 'relaxed', 'peaceful', 'chill'],
        low: ['mellow', 'laidback', 'easygoing']
      },
      positiveModifiers: ['very', 'really', 'so', 'extremely', 'completely'],
      negativeModifiers: ['not very', 'a little', 'somewhat']
    },
    surprised: {
      keywords: [
        'surprised', 'surprise', 'shocked', 'shock', 'amazed', 'amazement', 'astonished', 
        'astonishment', 'wow', 'unexpected', 'astonishing', 'stunned', 'astounded',
        'speechless', 'flabbergasted', 'incredible', 'unbelievable', 'remarkable'
      ],
      intensityWords: {
        high: ['shocked', 'stunned', 'flabbergasted', 'astounded'],
        medium: ['surprised', 'amazed', 'astonished'],
        low: ['surprised', 'impressed', 'intrigued']
      },
      positiveModifiers: ['very', 'really', 'so', 'completely', 'totally'],
      negativeModifiers: ['a little', 'slightly', 'somewhat']
    },
    energetic: {
      keywords: [
        'energetic', 'energy', 'lively', 'active', 'vibrant', 'dynamic', 'enthusiastic',
        'passionate', 'motivated', 'driven', 'powerful', 'strong', 'vigorous', 'peppy',
        'bouncy', 'hyper', 'awake', 'alert', 'refreshed', 'rejuvenated', 'pumped'
      ],
      intensityWords: {
        high: ['hyper', 'pumped', 'electrified', 'frenetic'],
        medium: ['energetic', 'lively', 'active', 'vibrant'],
        low: ['awake', 'alert', 'refreshed']
      }
    },
    melancholic: {
      keywords: [
        'melancholic', 'nostalgic', 'bittersweet', 'wistful', 'pensive', 'reflective',
        'contemplative', 'thoughtful', 'dreamy', 'romantic', 'sentimental', 'yearning',
        'longing', 'remembering', 'reminiscing', 'poetic', 'artistic'
      ],
      intensityWords: {
        high: ['wistful', 'yearning', 'longing', 'bittersweet'],
        medium: ['melancholic', 'nostalgic', 'pensive'],
        low: ['thoughtful', 'reflective', 'contemplative']
      }
    },
    focused: {
      keywords: [
        'focused', 'concentrated', 'attentive', 'absorbed', 'engaged', 'immersed',
        'determined', 'resolute', 'committed', 'disciplined', 'productive', 'efficient',
        'organized', 'systematic', 'methodical', 'studious', 'diligent'
      ],
      intensityWords: {
        high: ['absorbed', 'immersed', 'engrossed', 'rapt'],
        medium: ['focused', 'concentrated', 'attentive'],
        low: ['attentive', 'aware', 'observant']
      }
    },
    excited: {
      keywords: [
        'excited', 'anticipation', 'eager', 'enthusiastic', 'thrilled', 'pumped',
        'looking forward', 'can\'t wait', 'impatient', 'restless', 'electric',
        'buzzing', 'vibrating', 'charged', 'adrenaline', 'rush'
      ],
      intensityWords: {
        high: ['thrilled', 'electrified', 'buzzing', 'charged'],
        medium: ['excited', 'eager', 'enthusiastic'],
        low: ['looking forward', 'anticipating', 'hopeful']
      }
    }
  };

  // Tone indicators from punctuation and capitalization
  private detectTone(text: string): { intensity: number; isPositive: boolean; isNegative: boolean } {
    const tone = {
      intensity: 1,
      isPositive: false,
      isNegative: false
    };

    // Exclamation marks indicate excitement or strong emotion
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 0) {
      tone.intensity += exclamationCount * 0.5;
      tone.isPositive = exclamationCount > 1;
    }

    // Question marks might indicate confusion or curiosity
    const questionCount = (text.match(/\?/g) || []).length;
    if (questionCount > 2) {
      tone.intensity += 0.3;
    }

    // ALL CAPS indicates shouting/strong emotion
    const capsWords = text.split(' ').filter(word => word === word.toUpperCase() && word.length > 2);
    if (capsWords.length > 0) {
      tone.intensity += capsWords.length * 0.3;
      tone.isPositive = text.includes('!') || this.containsPositiveWords(text);
      tone.isNegative = !tone.isPositive && this.containsNegativeWords(text);
    }

    // Emojis and emoticons - using Unicode ranges instead of specific emojis
    const positiveEmojiPattern = /[\u263A-\u263F\u2700-\u27BF\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u2600-\u26FF\u2700-\u27BF]/g;
    const positiveEmojis = (text.match(positiveEmojiPattern) || []).length;
    
    // Common negative emoji pattern
    const negativeEmojiPattern = /[\u1F612-\u1F61F\u1F624-\u1F62F\u1F63F-\u1F64F]/g;
    const negativeEmojis = (text.match(negativeEmojiPattern) || []).length;
    
    if (positiveEmojis > 0) {
      tone.isPositive = true;
      tone.intensity += positiveEmojis * 0.4;
    }
    if (negativeEmojis > 0) {
      tone.isNegative = true;
      tone.intensity += negativeEmojis * 0.4;
    }

    // Word intensity modifiers
    const intensityModifiers = {
      high: ['extremely', 'incredibly', 'absolutely', 'completely', 'totally', 'utterly'],
      medium: ['very', 'really', 'so', 'pretty', 'quite'],
      low: ['slightly', 'a little', 'somewhat', 'kind of', 'sort of']
    };

    intensityModifiers.high.forEach(modifier => {
      if (text.includes(modifier)) tone.intensity += 0.8;
    });
    intensityModifiers.medium.forEach(modifier => {
      if (text.includes(modifier)) tone.intensity += 0.4;
    });
    intensityModifiers.low.forEach(modifier => {
      if (text.includes(modifier)) tone.intensity += 0.2;
    });

    return tone;
  }

  private containsPositiveWords(text: string): boolean {
    const positiveWords = ['love', 'great', 'good', 'amazing', 'wonderful', 'fantastic', 'awesome', 'perfect', 'excellent', 'happy'];
    return positiveWords.some(word => text.toLowerCase().includes(word));
  }

  private containsNegativeWords(text: string): boolean {
    const negativeWords = ['hate', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'angry', 'mad', 'sad', 'upset'];
    return negativeWords.some(word => text.toLowerCase().includes(word));
  }

  analyzeEmotion(text: string): { 
    emotion: string; 
    confidence: number; 
    predictions: Array<{ emotion: string; score: number; percentage: number }>;
    intensity: number;
    toneAnalysis: any;
  } {
    if (!text.trim()) {
      return {
        emotion: 'neutral',
        confidence: 0.1,
        predictions: [{ emotion: 'neutral', score: 0.1, percentage: 10 }],
        intensity: 1,
        toneAnalysis: {}
      };
    }

    const textLower = text.toLowerCase();
    const tone = this.detectTone(text);
    
    const scores: { [key: string]: number } = {};
    emotionLabels.forEach(emotion => scores[emotion] = 0.1); // Base scores

    // Calculate scores based on keywords and patterns
    Object.entries(this.emotionPatterns).forEach(([emotion, pattern]) => {
      // Check main keywords
      pattern.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          scores[emotion] += matches.length * 2;
        }
      });

      // Check intensity words
      if (pattern.intensityWords) {
        Object.entries(pattern.intensityWords).forEach(([intensityLevel, words]) => {
          const multiplier = intensityLevel === 'high' ? 3 : intensityLevel === 'medium' ? 2 : 1;
          words.forEach(word => {
            if (textLower.includes(word)) {
              scores[emotion] += 2 * multiplier;
            }
          });
        });
      }

      // Check for modifiers - safely handle optional properties
      if (pattern.positiveModifiers) {
        pattern.positiveModifiers.forEach((modifier: string) => {
          const modifierRegex = new RegExp(`\\b${modifier}\\s+\\w+`, 'gi');
          const modifierMatches = textLower.match(modifierRegex);
          if (modifierMatches) {
            scores[emotion] += modifierMatches.length * 1.5;
          }
        });
      }
    });

    // Apply tone analysis
    const toneMultiplier = Math.min(tone.intensity, 3); // Cap at 3x
    Object.keys(scores).forEach(emotion => {
      scores[emotion] *= toneMultiplier;
    });

    // Contextual phrases and patterns
    this.analyzeContextualPhrases(textLower, scores);

    // Normalize scores to probabilities
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const predictions = Object.entries(scores)
      .map(([emotion, score]) => ({
        emotion,
        score: score / totalScore,
        percentage: Math.round((score / totalScore) * 100)
      }))
      .sort((a, b) => b.score - a.score);

    const topPrediction = predictions[0];

    return {
      emotion: topPrediction.emotion,
      confidence: topPrediction.score,
      predictions: predictions.slice(0, 4), // Top 4 predictions
      intensity: tone.intensity,
      toneAnalysis: tone
    };
  }

  private analyzeContextualPhrases(text: string, scores: { [key: string]: number }): void {
    // Contextual phrase patterns
    const phrasePatterns = [
      { pattern: /\bfeel.*good\b/i, emotions: { happy: 3, calm: 2 } },
      { pattern: /\bhaving.*fun\b/i, emotions: { happy: 3, excited: 2 } },
      { pattern: /\benjoy.*time\b/i, emotions: { happy: 3, calm: 2 } },
      { pattern: /\blove.*this\b/i, emotions: { happy: 4, excited: 2 } },
      { pattern: /\bso.*happy\b/i, emotions: { happy: 4 } },
      { pattern: /\bfeel.*bad\b/i, emotions: { sad: 3, anxious: 2 } },
      { pattern: /\bnot.*good\b/i, emotions: { sad: 3, anxious: 1 } },
      { pattern: /\bmiss.*you\b/i, emotions: { sad: 3, melancholic: 2 } },
      { pattern: /\bheart.*hurt\b/i, emotions: { sad: 4 } },
      { pattern: /\breally.*sad\b/i, emotions: { sad: 4 } },
      { pattern: /\bpissed.*off\b/i, emotions: { angry: 4 } },
      { pattern: /\bmade.*me.*mad\b/i, emotions: { angry: 3 } },
      { pattern: /\bcan.*t.*stand\b/i, emotions: { angry: 3 } },
      { pattern: /\bso.*angry\b/i, emotions: { angry: 4 } },
      { pattern: /\bfeel.*anxious\b/i, emotions: { anxious: 4 } },
      { pattern: /\bworried.*about\b/i, emotions: { anxious: 3 } },
      { pattern: /\bnervous.*about\b/i, emotions: { anxious: 3 } },
      { pattern: /\bso.*stressed\b/i, emotions: { anxious: 4 } },
      { pattern: /\bneed.*break\b/i, emotions: { anxious: 2, calm: 1 } },
      { pattern: /\bcan.*t.*sleep\b/i, emotions: { anxious: 3 } },
      { pattern: /\bcalm.*down\b/i, emotions: { calm: 3 } },
      { pattern: /\brelax.*now\b/i, emotions: { calm: 3 } },
      { pattern: /\bpeace.*quiet\b/i, emotions: { calm: 4 } },
      { pattern: /\bso.*surprised\b/i, emotions: { surprised: 4 } },
      { pattern: /\bcan.*t.*believe\b/i, emotions: { surprised: 3 } },
      { pattern: /\bno.*way\b/i, emotions: { surprised: 3 } },
      { pattern: /\boh.*my.*god\b/i, emotions: { surprised: 3 } },
      { pattern: /\bfull.*energy\b/i, emotions: { energetic: 4 } },
      { pattern: /\bready.*go\b/i, emotions: { energetic: 3 } },
      { pattern: /\bthinking.*about\b/i, emotions: { melancholic: 2, focused: 1 } },
      { pattern: /\bremember.*when\b/i, emotions: { melancholic: 3 } },
      { pattern: /\bfocus.*on\b/i, emotions: { focused: 3 } },
      { pattern: /\bconcentrate.*on\b/i, emotions: { focused: 3 } },
      { pattern: /\bcan.*t.*wait\b/i, emotions: { excited: 3 } },
      { pattern: /\blooking.*forward\b/i, emotions: { excited: 3 } }
    ];

    phrasePatterns.forEach(({ pattern, emotions }) => {
      if (pattern.test(text)) {
        Object.entries(emotions).forEach(([emotion, score]) => {
          scores[emotion] += score;
        });
      }
    });
  }
}

const MoodDetectionModal: React.FC<MoodDetectionModalProps> = ({
  open,
  onClose,
  onMoodDetected,
  source,
}) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [analyzer] = useState(() => new TextEmotionAnalyzer());

  const analyzeTextWithAI = async () => {
    if (!notes.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      // Use the keyword and tone analyzer
      const result = analyzer.analyzeEmotion(notes);
      console.log('Text analysis result:', result);

      setAnalysisResult(result);
      setSelectedMood(result.emotion);
      
      // Auto-adjust intensity based on analysis
      const calculatedIntensity = Math.max(1, Math.min(10, Math.round(result.intensity * 3)));
      setIntensity(calculatedIntensity);

    } catch (err: any) {
      setError(`Analysis failed: ${err.message}`);
      console.error('Emotion analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedMood) return;

    const moodData = {
      type: selectedMood,
      intensity,
      source: 'text_ai',
      notes,
      analysis_method: 'keyword_tone_analysis',
      confidence: analysisResult?.confidence || 0.7,
      predictions: analysisResult?.predictions || [],
      timestamp: new Date().toISOString(),
      toneAnalysis: analysisResult?.toneAnalysis || {}
    };

    onMoodDetected(moodData);

    // Reset form
    setSelectedMood('');
    setIntensity(5);
    setNotes('');
    setAnalysisResult(null);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setSelectedMood('');
    setIntensity(5);
    setNotes('');
    setAnalysisResult(null);
    setError('');
    onClose();
  };

  const getMoodColor = (moodType: string) => {
    const colors: { [key: string]: string } = {
      happy: '#4caf50',
      sad: '#f44336',
      angry: '#ff5722',
      anxious: '#ff9800',
      calm: '#2196f3',
      surprised: '#9c27b0',
      neutral: '#9e9e9e',
      energetic: '#ff9800',
      melancholic: '#607d8b',
      focused: '#795548',
      excited: '#9c27b0',
    };
    return colors[moodType] || '#9e9e9e';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold" color="white">
              🎭 Text Emotion Analysis
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Describe your feelings - AI will detect emotions using keyword and tone analysis
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Card sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.95)' }}>
          <CardContent>
            {error && (
              <Alert severity={error.includes('failed') ? 'warning' : 'error'} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Text Input Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Describe Your Feelings
              </Typography>
              <TextField
                fullWidth
                label="How are you feeling today?"
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell me about your day, your thoughts, or how you're feeling right now. Examples: 'I'm feeling really happy today!' or 'This situation makes me so anxious and worried.'"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="contained"
                onClick={analyzeTextWithAI}
                disabled={!notes.trim() || isAnalyzing}
                sx={{ mb: 2 }}
              >
                {isAnalyzing ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Analyzing Text...
                  </>
                ) : (
                  '🎭 Analyze Emotion'
                )}
              </Button>

              <Typography variant="caption" color="text.secondary" display="block">
                Using advanced keyword matching and tone analysis
              </Typography>
            </Box>

            {/* AI Analysis Results */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ 
                  mb: 3, 
                  border: `2px solid ${getMoodColor(analysisResult.emotion)}`,
                  backgroundColor: `${getMoodColor(analysisResult.emotion)}08`
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color={getMoodColor(analysisResult.emotion)}>
                      Detected Mood: {analysisResult.emotion.charAt(0).toUpperCase() + analysisResult.emotion.slice(1)}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Confidence: {Math.round(analysisResult.confidence * 100)}% | 
                      Intensity Level: {analysisResult.intensity.toFixed(1)}
                    </Typography>

                    {/* Emotion Predictions */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Top Emotion Matches:
                      </Typography>
                      <Grid container spacing={1}>
                        {analysisResult.predictions.map((pred: any, index: number) => (
                          <Grid item key={pred.emotion}>
                            <Chip
                              label={`${pred.emotion} ${pred.percentage}%`}
                              size="small"
                              variant={index === 0 ? "filled" : "outlined"}
                              sx={{
                                backgroundColor: index === 0 ? getMoodColor(pred.emotion) : 'transparent',
                                color: index === 0 ? 'white' : getMoodColor(pred.emotion),
                                borderColor: getMoodColor(pred.emotion),
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Tone Analysis */}
                    {analysisResult.toneAnalysis && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Tone Analysis:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {analysisResult.toneAnalysis.isPositive && 'Positive tone detected • '}
                          {analysisResult.toneAnalysis.isNegative && 'Negative tone detected • '}
                          Intensity multiplier: {analysisResult.toneAnalysis.intensity.toFixed(1)}x
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Manual Selection Fallback */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Or Select Manually
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {emotionLabels.map((mood) => (
                  <Grid item key={mood}>
                    <Chip
                      label={mood.charAt(0).toUpperCase() + mood.slice(1)}
                      onClick={() => setSelectedMood(mood)}
                      sx={{
                        backgroundColor: selectedMood === mood ? getMoodColor(mood) : 'grey.100',
                        color: selectedMood === mood ? 'white' : 'text.primary',
                        '&:hover': {
                          backgroundColor: selectedMood === mood ? getMoodColor(mood) : 'grey.200',
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Intensity Slider */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Mood Intensity: {intensity}/10
              </Typography>
              <Slider
                value={intensity}
                onChange={(_, value) => setIntensity(value as number)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
                sx={{
                  '& .MuiSlider-mark': {
                    backgroundColor: 'grey.400',
                  },
                  '& .MuiSlider-markLabel': {
                    fontSize: '0.75rem',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ 
            color: 'white', 
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedMood}
          sx={{
            backgroundColor: selectedMood ? getMoodColor(selectedMood) : 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': {
              backgroundColor: selectedMood ? getMoodColor(selectedMood) : 'rgba(255,255,255,0.3)',
              opacity: 0.9,
            },
          }}
        >
          Apply to Music Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoodDetectionModal;