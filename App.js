import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NoteWritingScreen from './screens/NoteWritingScreen';
import NoteEditingScreen from './screens/NoteEditingScreen';
import { NotesProvider } from './context/NotesContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NotesProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: true }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="NoteWriting" component={NoteWritingScreen} />
          <Stack.Screen name="NoteEditing" component={NoteEditingScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </NotesProvider>
  );
}

