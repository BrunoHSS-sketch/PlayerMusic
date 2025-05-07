import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useMusic } from '../context/MusicContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const LibraryScreen = () => {
  const { tracks, addTrack, setCurrentTrackIndex } = useMusic();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  
  interface Track {
    uri: string;
    name: string;
    albumArt?: string;
  }

  const handleAddMusic = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const document = result.assets[0];
        addTrack({
          uri: document.uri,
          name: document.name || 'Música sem nome',
        });
      }
    } catch (error) {
      console.error('Erro ao selecionar arquivo:', error);
    }
  };

  const handlePlayTrack = (index: number) => {
    setCurrentTrackIndex(index);
    navigation.navigate('Player' as never);
  };

  const filteredTracks = tracks.filter((track) =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePlayTrack(index)}
    >
      <Image
        source={
          item.albumArt
            ? { uri: item.albumArt }
            : require('../assets/musica-img-notfound.jpg')
        }
        style={styles.albumArt}
      />
      <View style={styles.info}>
        <Text style={styles.trackName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Sua Biblioteca</Text>
          <TouchableOpacity onPress={handleAddMusic} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
      </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar músicas..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredTracks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </LinearGradient>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  searchBar: {
    backgroundColor: '#ffffff20',
    borderRadius: 8,
    padding: 8,
    marginTop: 16,
    color: '#fff',
  },
  list: {
    marginTop: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  info: {
    marginLeft: 12,
  },
  trackName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
