import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMusic } from '../context/MusicContext';
import PlayerControls from '../components/PlayerControls';
import ProgressBar from '../components/ProgressBar';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

// Definindo tipo para as rotas
type RootStackParamList = {
  Library: undefined;
  Player: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Player'>;

const PlayerScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const { tracks, currentTrackIndex, setCurrentTrackIndex } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const repeatRef = useRef(repeat);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const track = tracks[currentTrackIndex];

  const pickBackgroundImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setBackgroundImage(result.assets[0].uri);
    }
  };

  // Atualiza ref sempre que o estado repeat mudar
  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  useEffect(() => {
    if (!track) return;

    // Quando a música muda, garantimos que a música será pausada corretamente.
    setIsPlaying(false); // Pausa a música quando a faixa muda.
    loadAudio(); // Carrega e toca a nova faixa

    return () => {
      unloadAudio(); // Descarrega a música ao sair
    };
  }, [currentTrackIndex]);

  const loadAudio = async () => {
    try {
      await unloadAudio();
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsPlaying(true); // Garante que o estado de isPlaying seja atualizado
    } catch (error) {
      Alert.alert('Erro ao carregar áudio');
    }
  };

  const unloadAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    if (status.isPlaying && status.durationMillis) {
      setProgress(status.positionMillis / status.durationMillis);
    }

    if (status.didJustFinish) {
      if (repeatRef.current) {
        soundRef.current?.setPositionAsync(0).then(() => {
          soundRef.current?.playAsync();
        });
      } else {
        handleNext();
      }
    }
  };

  const handlePlayPause = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pauseAsync(); // Pausa o áudio
    } else {
      soundRef.current.playAsync(); // Começa a tocar
    }

    setIsPlaying(!isPlaying); // Alterna entre play e pause
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const BackgroundComponent = backgroundImage ? (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}
      resizeMode="cover"
    >
      {renderContent()}
    </ImageBackground>
  ) : (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.background}
    >
      {renderContent()}
    </LinearGradient>
  );
  
  function renderContent() {
    if (!track) {
      return (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={pickBackgroundImage} style={styles.iconButton}>
              <Ionicons name="image-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Library')}
              style={styles.iconButton}
            >
              <Ionicons name="library-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <Text style={styles.trackName}>Nenhuma música selecionada</Text>
          </View>
        </>
      );
    }
    return (
      <>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={pickBackgroundImage} style={styles.iconButton}>
            <Ionicons name="image-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Library')}
            style={styles.iconButton}
          >
            <Ionicons name="library-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Image
            source={require('../assets/musica-img-notfound.jpg')}
            style={styles.albumArt}
          />
          <Text style={styles.trackName}>{track.name}</Text>
          <ProgressBar progress={progress} />
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={handlePrev} style={styles.controlButton}>
              <Ionicons name="play-skip-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setRepeat(!repeat)}
            style={styles.repeatButton}
          >
            <Ionicons
              name="repeat"
              size={24}
              color={repeat ? '#F7054A' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return BackgroundComponent;
};

export default PlayerScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  albumArt: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
  trackName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#fff',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
