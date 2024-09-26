import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Intro from './app/screens/Intro';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteScreen from './app/screens/NoteScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import NoteScreen from './app/screens/NoteScreen';
import NoteDetail from './app/components/NoteDetail';


const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState({});
  const findUser = async () => {
    const result = await AsyncStorage.getItem('user');
    if (result !== null){
      setUser(JSON.parse(result));
    }
  };

  useEffect(() => {
    findUser();
  }, []);

  const renderNoteScreen = () => <NoteScreen {...props} user={user} />;

  if (!user.name) return <Intro onFinish={findUser} />;
  return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerTitle: '', headerTransparent: true}}>
      <Stack.Screen name="NoteScreen" component={renderNoteScreen} />
      <Stack.Screen name="NoteDetail" component={NoteDetail} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
