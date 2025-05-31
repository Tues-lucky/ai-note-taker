import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNotes } from '../context/NotesContext';

const NoteEditingScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const { handleUpdateNote } = useNotes();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content cannot be empty');
      return;
    }
    try {
      const success = await handleUpdateNote(note, title, content);
      if (success) {
        Alert.alert('Success', 'Note updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          multiline
        />
        <Button title="Save Changes" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  contentInput: {
    height: 400,
    textAlignVertical: 'top',
  },
});

export default NoteEditingScreen;