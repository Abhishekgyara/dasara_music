import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// src/store/musicStore.ts

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  cover?: string;
  mood?: string;
  genre?: string;
  youtubeId?: string;
  url?: string;
}

export interface Mood {
  id: string;
  type: 'happy' | 'sad' | 'energetic' | 'calm' | 'anxious' | 'excited' | 'melancholic' | 'focused';
  intensity: number; 
  confidence: number;
  timestamp: Date;
  source: 'camera' | 'text' | 'voice' | 'journal';
  notes?: string;
  songs?: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  mood: string;
  created: Date;
}

export interface ListeningHistory {
  id: string;
  songId: string;
  song: Song;
  mood?: string;
  duration: number;
  timestamp: Date;
  completed: boolean;
}

interface MusicState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  currentMood: Mood | null;
  moodHistory: Mood[];
  playlists: Playlist[];
  listeningHistory: ListeningHistory[];
  isLoading: boolean;
  currentTime: number;
  duration: number;
  audioElement: HTMLAudioElement | null;

  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  setCurrentMood: (mood: Mood) => void;
  addMoodToHistory: (mood: Mood) => void;
  createPlaylist: (playlist: Omit<Playlist, 'id' | 'created'>) => void;
  setLoading: (loading: boolean) => void;

  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  playSong: (song: Song) => void;
  stopPlayback: () => void;

  addToHistory: (entry: Omit<ListeningHistory, 'id' | 'timestamp' | 'song'>) => void;
  clearHistory: () => void;
  getMoodStats: () => { [mood: string]: number };

  getSongsByMood: (mood: string) => Song[];
  getAllSongs: () => Song[];
}

const dummySongs: Song[] = [
  {
    id: '1',
    title: 'Happy Days',
    artist: 'Sunshine Band',
    album: 'Summer Vibes',
    duration: 180,
    url: 'https://example.com/song1.mp3',
    cover: 'https://picsum.photos/300/300?random=1',
    genre: 'pop',
    mood: 'happy',
  },
  {
    id: '2',
    title: 'Calm Waters',
    artist: 'Ocean Waves',
    album: 'Peaceful Moments',
    duration: 240,
    url: 'https://example.com/song2.mp3',
    cover: 'https://picsum.photos/300/300?random=2',
    genre: 'ambient',
    mood: 'calm',
  },
  {
    id: '3',
    title: 'Energetic Beat',
    artist: 'Power Pulse',
    album: 'Workout Mix',
    duration: 200,
    url: 'https://example.com/song3.mp3',
    cover: 'https://picsum.photos/300/300?random=3',
    genre: 'electronic',
    mood: 'energetic',
  },
  {
    id: '4',
    title: 'Melancholy Rain',
    artist: 'Sad Symphony',
    album: 'Grey Skies',
    duration: 220,
    url: 'https://example.com/song4.mp3',
    cover: 'https://picsum.photos/300/300?random=4',
    genre: 'indie',
    mood: 'sad',
  },
  {
    id: '5',
    title: 'Focus Flow',
    artist: 'Deep Work',
    album: 'Productivity',
    duration: 300,
    url: 'https://example.com/song5.mp3',
    cover: 'https://picsum.photos/300/300?random=5',
    genre: 'ambient',
    mood: 'focused',
  },
  {
    id: '6',
    title: 'Anxious Thoughts',
    artist: 'Mind Waves',
    album: 'Inner Peace',
    duration: 190,
    url: 'https://example.com/song6.mp3',
    cover: 'https://picsum.photos/300/300?random=6',
    genre: 'electronic',
    mood: 'anxious',
  },
];

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      isPlaying: false,
      volume: 0.7,
      queue: [],
      currentMood: null,
      moodHistory: [],
      playlists: [],
      listeningHistory: [],
      isLoading: false,
      currentTime: 0,
      duration: 0,
      audioElement: null,

      setCurrentSong: (song) => {
        const { audioElement } = get();
        if (audioElement) audioElement.pause();

        if (song) {
          const newAudio = new Audio(song.url || "");
          newAudio.volume = get().volume;

          newAudio.addEventListener('loadedmetadata', () => {
            set({ duration: newAudio.duration });
          });

          newAudio.addEventListener('timeupdate', () => {
            set({ currentTime: newAudio.currentTime });
          });

          newAudio.addEventListener('ended', () => {
            const { currentSong } = get();
            if (currentSong) {
              get().addToHistory({
                songId: currentSong.id,
                mood: currentSong.mood,
                duration: currentSong.duration,
                completed: true,
              });
            }
            get().playNext();
          });

          set({
            currentSong: song,
            audioElement: newAudio,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
          });
        } else {
          set({
            currentSong: null,
            audioElement: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
          });
        }
      },

      togglePlay: () => {
        const { audioElement, isPlaying, currentSong } = get();
        if (!audioElement) return;

        if (isPlaying) {
          audioElement.pause();
          set({ isPlaying: false });
        } else {
          audioElement.play();
          set({ isPlaying: true });

          if (currentSong) {
            get().addToHistory({
              songId: currentSong.id,
              mood: currentSong.mood,
              duration: currentSong.duration,
              completed: false,
            });
          }
        }
      },

      setVolume: (volume) => {
        const { audioElement } = get();
        if (audioElement) audioElement.volume = volume;
        set({ volume });
      },

      addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),

      removeFromQueue: (songId) =>
        set((state) => ({ queue: state.queue.filter((s) => s.id !== songId) })),

      setCurrentMood: (mood) => set({ currentMood: mood }),

      addMoodToHistory: (mood) =>
        set((state) => ({
          moodHistory: [mood, ...state.moodHistory.slice(0, 99)],
        })),

      createPlaylist: (playlist) =>
        set((state) => ({
          playlists: [
            { ...playlist, id: Date.now().toString(), created: new Date() },
            ...state.playlists,
          ],
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      playSong: (song) => {
        get().setCurrentSong(song);
        setTimeout(() => get().togglePlay(), 100);
      },

      stopPlayback: () => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
        set({ isPlaying: false, currentTime: 0 });
      },

      playNext: () => {
        const { queue, currentSong } = get();
        const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
        const nextSong = queue[currentIndex + 1] || queue[0];
        if (nextSong) get().playSong(nextSong);
      },

      playPrevious: () => {
        const { queue, currentSong } = get();
        const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
        const prevSong = queue[currentIndex - 1] || queue[queue.length - 1];
        if (prevSong) get().playSong(prevSong);
      },

      seekTo: (time) => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.currentTime = time;
          set({ currentTime: time });
        }
      },

      addToHistory: (entry) => {
        const song =
          dummySongs.find((s) => s.id === entry.songId) || get().currentSong;
        if (song) {
          set((state) => ({
            listeningHistory: [
              { ...entry, id: Date.now().toString(), timestamp: new Date(), song },
              ...state.listeningHistory.slice(0, 499),
            ],
          }));
        }
      },

      clearHistory: () => set({ listeningHistory: [] }),

      getMoodStats: () => {
        const { listeningHistory } = get();
        const stats: { [mood: string]: number } = {};
        listeningHistory.forEach((e) => {
          if (!e.mood) return;
          stats[e.mood] = (stats[e.mood] || 0) + e.duration;
        });
        return stats;
      },

      getSongsByMood: (mood: string) =>
        dummySongs.filter((song) => song.mood === mood),

      getAllSongs: () => dummySongs,
    }),
    {
      name: 'music-storage',
      partialize: (state) => ({
        volume: state.volume,
        moodHistory: state.moodHistory,
        playlists: state.playlists,
        listeningHistory: state.listeningHistory,
      }),
    }
  )
);

export const moodSongs = {
  happy: dummySongs.filter((s) => s.mood === 'happy'),
  sad: dummySongs.filter((s) => s.mood === 'sad'),
  energetic: dummySongs.filter((s) => s.mood === 'energetic'),
  calm: dummySongs.filter((s) => s.mood === 'calm'),
  anxious: dummySongs.filter((s) => s.mood === 'anxious'),
  focused: dummySongs.filter((s) => s.mood === 'focused'),
  excited: dummySongs.filter((s) => s.mood === 'excited'),
  melancholic: dummySongs.filter((s) => s.mood === 'melancholic'),
};
