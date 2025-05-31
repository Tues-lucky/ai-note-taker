import styles from '../styles/styles';
import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNotes } from '../context/NotesContext';

const HomeScreen = ({ navigation }) => {
  const {
    allNotes,
    handleDeleteNote,
    recordingStatus,
    handleStartRecording,
    handleStopRecording,
    processAudioWithGoogle,
    summarizeContent
  } = useNotes();

  const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);
  const rotationAnim = useRef(new Animated.Value(0)).current;  // Rotation animation for the record button

  // Animation effect for recording button
  useEffect(() => {
    let rotationAnimation;
    if (recordingStatus === 'recording') {
      rotationAnimation = Animated.loop(Animated.timing(rotationAnim, { toValue: 1, duration: 500, useNativeDriver: true }));
      rotationAnimation.start();
    } else {
      rotationAnim.setValue(0);  // Reset rotation when not recording
    }
    return () => {
      if (rotationAnimation) {
        rotationAnimation.stop(); // Stop rotation animation on cleanup
      }
      rotationAnim.stopAnimation();
    };
  }, [recordingStatus, rotationAnim]);

  const handleRecordingPress = async () => {
    if (recordingStatus === 'idle') {
      const success = await handleStartRecording();
      if (!success) {
        Alert.alert('Failed to start recording');
      }
    } else {
      const uri = await handleStopRecording();
      if (uri) {
        rotationAnim.setValue(0); // Ensure rotation is reset
        Alert.alert('Recording stopped', 'Would you like to process this recording with speech-to-text?',
          [{ text: 'No', style: 'cancel' }, {
            text: 'Yes', onPress: async () => {
              const success = await processAudioWithGoogle(uri);
              if (!success) {
                Alert.alert('Transcription Error', 'No speech was recognized in the audio');
              }
            }
          }]
        );
      } else {
        Alert.alert('Failed to stop recording');
      }
    }
  };

  const handleSummarize = async (text) => {
    const success = await summarizeContent(text);
    if (success) {
      Alert.alert('Summary Created', 'A new note with the AI summary has been created');
    } else {
      Alert.alert('Error', 'Failed to generate summary');
    }
  };

  const handlePress = (index) => {
    setExpandedNoteIndex(expandedNoteIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('NoteWriting')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {allNotes.map((note, index) => (
          <TouchableOpacity
            key={index}
            style={styles.noteCard}
            onPress={() => handlePress(index)}
          >
            <View style={styles.noteHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.noteTitle}>{note.title}</Text>
              </View>
              <View style={styles.iconGroup}>
                <TouchableOpacity style={styles.iconButton}
                  onPress={() => {
                    console.log("ai summary button pressed");
                    handleSummarize(note.content);
                  }}>
                  <Text style={styles.iconText}>★</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('NoteEditing', { note })}
                >
                  <Text style={styles.iconText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDeleteNote(index)}
                >
                  <Text style={styles.iconText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
            {expandedNoteIndex === index && (
              <Text style={styles.noteContent}>{note.content}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.recordButtonContainer}>
        <View style={styles.buttonRow}>
          <Animated.View
            style={[
              styles.recordButton,
              {
                transform: [
                  {
                    rotate: recordingStatus === 'recording'
                      ? rotationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'] // Clockwise for recording
                      })
                      : '0deg' // No rotation when idle
                  }
                ]
              }
            ]}>
            <TouchableOpacity onPress={handleRecordingPress}>
              <Image
                source={require('../assets/sonic-record-button.png')}
                style={styles.recordButtonImage} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  )
};

export default HomeScreen;