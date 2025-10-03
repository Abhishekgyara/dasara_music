import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  PrivacyTip,
  Mic,
  CameraAlt,
  Notifications,
  Palette,
  Security,
  DataUsage,
  Help,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    // Privacy Settings
    enableWebcam: true,
    enableVoiceRecording: true,
    shareMoodData: false,
    allowAnalytics: true,
    
    // AI Voice Settings
    aiVoiceType: 'friendly',
    voiceSpeed: 1.0,
    voiceVolume: 0.8,
    
    // App Preferences
    autoPlayMusic: true,
    showMoodSuggestions: true,
    enableNotifications: true,
    darkMode: false,
    
    // Music Settings
    defaultVolume: 0.7,
    crossfadeDuration: 3,
    audioQuality: 'high',
  });

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const settingSections = [
    {
      title: 'Privacy & Security',
      icon: <PrivacyTip />,
      color: '#f44336',
      settings: [
        {
          key: 'enableWebcam',
          label: 'Enable Camera Access',
          description: 'Allow facial expression analysis for mood detection',
          type: 'switch',
        },
        {
          key: 'enableVoiceRecording',
          label: 'Enable Voice Recording',
          description: 'Allow voice commands and tone analysis',
          type: 'switch',
        },
        {
          key: 'shareMoodData',
          label: 'Share Mood Data',
          description: 'Help improve AI by sharing anonymous mood patterns',
          type: 'switch',
        },
        {
          key: 'allowAnalytics',
          label: 'Analytics & Insights',
          description: 'Allow app to collect usage data for personal insights',
          type: 'switch',
        },
      ],
    },
    {
      title: 'AI Voice Assistant',
      icon: <Mic />,
      color: '#2196f3',
      settings: [
        {
          key: 'aiVoiceType',
          label: 'Voice Personality',
          description: 'Choose your preferred AI voice style',
          type: 'select',
          options: [
            { value: 'friendly', label: 'Friendly & Warm' },
            { value: 'professional', label: 'Professional' },
            { value: 'energetic', label: 'Energetic & Upbeat' },
            { value: 'calm', label: 'Calm & Soothing' },
          ],
        },
        {
          key: 'voiceSpeed',
          label: 'Voice Speed',
          description: 'Adjust how fast the AI speaks',
          type: 'slider',
          min: 0.5,
          max: 2.0,
          step: 0.1,
        },
        {
          key: 'voiceVolume',
          label: 'Voice Volume',
          description: 'Set the volume for AI voice responses',
          type: 'slider',
          min: 0,
          max: 1,
          step: 0.1,
        },
      ],
    },
    {
      title: 'App Preferences',
      icon: <SettingsIcon />,
      color: '#4caf50',
      settings: [
        {
          key: 'autoPlayMusic',
          label: 'Auto-play Music',
          description: 'Automatically start playing music after mood detection',
          type: 'switch',
        },
        {
          key: 'showMoodSuggestions',
          label: 'Mood Suggestions',
          description: 'Show mood upliftment suggestions for negative moods',
          type: 'switch',
        },
        {
          key: 'enableNotifications',
          label: 'Push Notifications',
          description: 'Receive reminders and mood check-ins',
          type: 'switch',
        },
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme for better eye comfort',
          type: 'switch',
        },
      ],
    },
    {
      title: 'Music Settings',
      icon: <Mic />,
      color: '#ff9800',
      settings: [
        {
          key: 'defaultVolume',
          label: 'Default Volume',
          description: 'Set the default volume for music playback',
          type: 'slider',
          min: 0,
          max: 1,
          step: 0.1,
        },
        {
          key: 'crossfadeDuration',
          label: 'Crossfade Duration',
          description: 'Smooth transition between songs (seconds)',
          type: 'slider',
          min: 0,
          max: 10,
          step: 1,
        },
        {
          key: 'audioQuality',
          label: 'Audio Quality',
          description: 'Choose your preferred audio quality',
          type: 'select',
          options: [
            { value: 'low', label: 'Low (Save Data)' },
            { value: 'medium', label: 'Medium (Balanced)' },
            { value: 'high', label: 'High (Best Quality)' },
          ],
        },
      ],
    },
  ];

  const getSettingComponent = (setting: any) => {
    const value = settings[setting.key as keyof typeof settings];

    switch (setting.type) {
      case 'switch':
        return (
          <Switch
            checked={value as boolean}
            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            color="primary"
          />
        );
      case 'select':
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={value}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            >
              {setting.options?.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'slider':
        return (
          <Box sx={{ width: 200 }}>
            <Slider
              value={value as number}
              onChange={(_, newValue) => handleSettingChange(setting.key, newValue)}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              valueLabelDisplay="auto"
              size="small"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Customize your MelodyMind experience and manage your preferences
      </Typography>

      <Grid container spacing={3}>
        {settingSections.map((section, sectionIndex) => (
          <Grid item xs={12} key={section.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ backgroundColor: section.color, mr: 2 }}>
                      {section.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {section.title}
                    </Typography>
                  </Box>

                  <List>
                    {section.settings.map((setting, index) => (
                      <React.Fragment key={setting.key}>
                        <ListItem>
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: section.color,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={setting.label}
                            secondary={setting.description}
                          />
                          <ListItemSecondaryAction>
                            {getSettingComponent(setting)}
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < section.settings.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DataUsage />}
                    onClick={() => alert('Data export feature coming soon!')}
                  >
                    Export Data
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Security />}
                    onClick={() => alert('Privacy settings updated!')}
                  >
                    Privacy Policy
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Help />}
                    onClick={() => alert('Help center coming soon!')}
                  >
                    Help & Support
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Info />}
                    onClick={() => alert('About MelodyMind v1.0.0')}
                  >
                    About App
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Settings Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Settings Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {Object.values(settings).filter(v => v === true).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Features Enabled
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {settings.aiVoiceType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Voice Style
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {Math.round(settings.defaultVolume * 100)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Default Volume
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Chip
                      label={settings.darkMode ? 'Dark Mode' : 'Light Mode'}
                      color={settings.darkMode ? 'primary' : 'default'}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Theme
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 