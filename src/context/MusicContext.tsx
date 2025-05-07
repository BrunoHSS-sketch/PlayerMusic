// context/MusicContext.tsx
import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { Audio } from 'expo-av';

export type Track = {
  uri: string;
  name: string;
};

type MusicContextType = {
  tracks: Track[];
  currentTrackIndex: number;
  addTrack: (track: Track) => void;
  setCurrentTrackIndex: (index: number) => void; // <== adicionado de volta
  playTrack: (index: number) => Promise<void>;
  soundRef: React.MutableRefObject<Audio.Sound | null>;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const addTrack = (track: Track) => {
    setTracks((prevTracks) => [...prevTracks, track]);
  };

  const playTrack = async (index: number) => {
    // Para o áudio anterior se estiver tocando
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.warn('Erro ao descarregar áudio anterior:', error);
      }
      soundRef.current = null;
    }

    setCurrentTrackIndex(index);
  };

  return (
    <MusicContext.Provider
    value={{
      tracks,
      currentTrackIndex,
      addTrack,
      setCurrentTrackIndex, // <== aqui também
      playTrack,
      soundRef,
    }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
