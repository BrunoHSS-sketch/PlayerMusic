import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isPlaying: boolean;
  repeat: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onToggleRepeat: () => void;
};

const PlayerControls = ({ isPlaying, repeat, onPlayPause, onNext, onPrev, onToggleRepeat }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggleRepeat}>
        <Ionicons name="repeat" size={28} color={repeat ? '#F7054A' : '#444'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPrev} disabled={!onPrev}>
        <Ionicons name="play-skip-back" size={36} color={onPrev ? '#000' : '#aaa'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext} disabled={!onNext}>
        <Ionicons name="play-skip-forward" size={36} color={onNext ? '#000' : '#aaa'} />
      </TouchableOpacity>
    </View>
    
  );
};

export default PlayerControls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 32,
  },
  playButton: {
    backgroundColor: '#F7054A',
    borderRadius: 50,
    padding: 16,
  },
});
