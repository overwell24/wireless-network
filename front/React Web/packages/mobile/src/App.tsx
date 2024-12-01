// src/App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
