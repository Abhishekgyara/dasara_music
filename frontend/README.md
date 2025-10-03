# MelodyMind - AI-Powered Mood-Based Music Player

MelodyMind is a React + TypeScript application that uses AI to detect your mood and recommend personalized music playlists. The app features multiple mood detection methods, interactive games, mood tracking, and comprehensive analytics.

## 🎵 Features

### Core Features
- **Multi-Modal Mood Detection**
  - Camera-based facial expression analysis
  - Text-based mood input with intensity slider
  - Voice tone analysis and commands
  - Manual journal entries

- **AI-Powered Music Recommendations**
  - Personalized playlists based on detected mood
  - Mood-music correlation analytics
  - Smart song suggestions

- **Interactive Mood Upliftment Games**
  - Tap the Notes game for mood improvement
  - Coming soon: Breathing exercises, mood quizzes, gratitude journal

- **Comprehensive Mood Tracking**
  - Interactive calendar with mood visualization
  - Daily mood entries with notes
  - Mood history and patterns

- **Advanced Analytics**
  - Mood frequency and intensity charts
  - Weekly mood trends
  - Music genre preferences by mood
  - Personal insights and statistics

### Technical Features
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Modern UI**: Material UI components with smooth animations
- **State Management**: Zustand for efficient state management
- **Type Safety**: Full TypeScript implementation
- **Route Protection**: Authentication-based access control
- **Persistent Storage**: Local storage for user data

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MelodyMind/melodymind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Credentials
- **Email**: `demo@melodymind.com`
- **Password**: `demo123`

## 🎮 How to Use

### 1. Login
- Use the demo credentials or click "Continue with Google"
- The app will redirect you to the dashboard after successful authentication

### 2. Mood Detection
Choose from three mood detection methods:

**Camera Detection**
- Click the camera icon
- Allow camera access
- Look at the camera for facial expression analysis
- Review detected mood and confirm

**Text Input**
- Click the text icon
- Select your mood from the available options
- Adjust intensity using the slider
- Add optional notes about your feelings

**Voice Control**
- Click the voice icon
- Speak naturally about your mood or use voice commands
- The app will analyze your voice tone and content
- Review detected mood and confirm

### 3. Music Recommendations
- After mood detection, view AI-recommended playlists
- Each playlist shows mood match percentage
- Click "Play" to start listening
- Save playlists for later use

### 4. Mood Tracking
- Use the Journal page to track daily moods
- Interactive calendar shows mood history
- Add manual entries for any date
- View detailed mood information

### 5. Analytics
- Visit the Analytics page for insights
- View mood frequency and intensity charts
- Track weekly mood trends
- Discover music genre preferences

### 6. Mood Games
- Access games from the Games page
- Play "Tap the Notes" for mood improvement
- More games coming soon

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── MusicPlayer.tsx # Music player controls
│   ├── MoodDetectionModal.tsx
│   ├── WebcamCapture.tsx
│   ├── VoiceControl.tsx
│   ├── PlaylistRecommendations.tsx
│   └── MoodUpliftmentGame.tsx
├── pages/              # Main application pages
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── Journal.tsx
│   ├── Analytics.tsx
│   ├── Games.tsx
│   └── Settings.tsx
├── store/              # State management
│   ├── authStore.ts    # Authentication state
│   └── musicStore.ts   # Music and mood state
└── App.tsx             # Main application component
```

## 🛠️ Technologies Used

- **Frontend Framework**: React 19 with TypeScript
- **UI Library**: Material UI (MUI)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Webcam**: React Webcam
- **Styling**: Emotion (CSS-in-JS)

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: Page transitions and micro-interactions
- **Mood-Based Theming**: Background colors change based on detected mood
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern UI**: Clean, intuitive interface with Material Design principles

## 🔧 Configuration

### Settings Page
- **Privacy & Security**: Control camera, voice, and data sharing permissions
- **AI Voice Assistant**: Customize voice personality, speed, and volume
- **App Preferences**: Auto-play, notifications, dark mode
- **Music Settings**: Default volume, crossfade, audio quality

## 📱 Mobile Experience

- **Bottom Navigation**: Easy thumb navigation on mobile devices
- **Touch-Friendly**: Large touch targets and gesture support
- **Responsive Layout**: Optimized for all screen sizes
- **Offline Support**: Local storage for core functionality

## 🔮 Future Features

- **Real AI Integration**: Connect to actual mood detection APIs
- **Music Streaming**: Integration with Spotify, Apple Music, etc.
- **Social Features**: Share playlists and mood insights
- **Advanced Games**: More interactive mood improvement activities
- **Voice Assistant**: Full conversational AI integration
- **Dark Mode**: Complete dark theme implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material UI for the beautiful component library
- Framer Motion for smooth animations
- Recharts for data visualization
- The React community for excellent tools and libraries

## 📞 Support

For support, email support@melodymind.com or create an issue in the repository.

---

**MelodyMind** - Your AI-powered mood-based music companion 🎵✨
