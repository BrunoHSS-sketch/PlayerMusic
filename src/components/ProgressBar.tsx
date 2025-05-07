import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  progress: number; // valor entre 0 e 1
};

const ProgressBar = ({ progress }: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.filled, { width: `${Math.min(progress * 100, 100)}%` }]} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  filled: {
    height: '100%',
    backgroundColor: '#F7054A',
  },
});
