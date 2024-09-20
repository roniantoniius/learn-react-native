import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Intro from './app/screens/intro';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const findUser = async () => {
    const result = await AsyncStorage.getItem('user');
    console.log(result);
  };

  useEffect(() => {
    findUser();
  }, []);
  return <Intro />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
