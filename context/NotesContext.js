import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchNotes, createNote, deleteNote, updateNote } from '../services/firebase/noteService';
import { transcribeAudio } from '../services/api/googleSpeechService';
import { generateSummary } from '../services/api/openaiService';
import { startRecording, stopRecording } from '../services/audio/recordingService';

// Create the context
const NotesContext = createContext();

// Custom hook to use the notes context
export const useNotes = () => useContext(NotesContext);

// Provider component
export const NotesProvider = ({ children }) => {
    const [allNotes, setAllNotes] = useState([]);
    const [recording, setRecording] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('idle');
    const [audioUri, setAudioUri] = useState(null);

    // Load notes from database
    useEffect(() => {
        loadNotes();
    }, []);

    // Load all notes
    const loadNotes = async () => {
        try {
            const notes = await fetchNotes();
            if (notes.length > 0) {
                setAllNotes(notes);
                console.log("Notes fetched:", notes.length);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    // Add a new note
    const addNoteToDatabase = async (title, content) => {
        try {
            const noteWithId = await createNote('manual', title, content);
            setAllNotes(prevNotes => [noteWithId, ...prevNotes]);
            return true;
        } catch (error) {
            console.error('Error adding note:', error);
            return false;
        }
    };

    // Create note from audio summary
    const createNoteFromSummary = async (summaryText) => {
        try {
            const title = `Audio Note ${new Date().toLocaleString()}`;
            const noteWithId = await createNote('audio', title, summaryText);
            setAllNotes(prevNotes => [noteWithId, ...prevNotes]);
            console.log('Note created and saved successfully');
            return noteWithId;
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    };

    // Create summary note
    const createSummaryNote = async (originalContent, summaryText) => {
        try {
            const originalNote = allNotes.find(note => note.content === originalContent);
            const originalTitle = originalNote ? originalNote.title : "Unknown Note";
            const title = `AI summary - ${originalTitle}`;
            const noteWithId = await createNote('summary', title, summaryText);
            setAllNotes(prevNotes => [noteWithId, ...prevNotes]);
            return noteWithId;
        } catch (error) {
            console.error('Error creating summary note:', error);
            throw error;
        }
    };

    // Handle note update
    const handleUpdateNote = async (originalNote, title, content) => {
        try {
            const updatedNote = {
                ...originalNote,
                title,
                content,
                updatedAt: new Date().toISOString()
            };

            const success = await updateNote(updatedNote);

            if (success) {
                // Update the note in the local state
                setAllNotes(prevNotes =>
                    prevNotes.map(note =>
                        note.id === updatedNote.id ? updatedNote : note
                    )
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating note:', error);
            return false;
        }
    };

    // Delete a note
    const handleDeleteNote = async (index) => {
        try {
            const noteToDelete = allNotes[index];
            const success = await deleteNote(noteToDelete);

            if (success) {
                const updatedNotes = [...allNotes];
                updatedNotes.splice(index, 1);
                setAllNotes(updatedNotes);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to delete note:', error);
            throw error;
        }
    };

    // Audio recording methods
    const handleStartRecording = async () => {
        try {
            const { recording: newRecording } = await startRecording();
            setRecording(newRecording);
            setRecordingStatus('recording');
            return true;
        } catch (error) {
            console.error('Failed to start recording', error);
            return false;
        }
    };

    const handleStopRecording = async () => {
        try {
            if (!recording) return false;

            const uri = await stopRecording(recording);
            setAudioUri(uri);
            setRecording(null);
            setRecordingStatus('idle');
            return uri;
        } catch (error) {
            console.error('Failed to stop recording', error);
            return false;
        }
    };

    // Process audio with Google Speech-to-Text
    const processAudioWithGoogle = async (uri) => {
        try {
            const transcription = await transcribeAudio(uri || audioUri);

            if (transcription) {
                await createNoteFromSummary(transcription);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error processing audio:', error);
            return false;
        }
    };

    // Generate summary with OpenAI
    const summarizeContent = async (content) => {
        try {
            const summaryText = await generateSummary(content);
            if (summaryText) {
                await createSummaryNote(content, summaryText);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error summarizing text:', error);
            return false;
        }
    };

    // The value that will be provided to consumers of this context
    const value = {
        allNotes,
        loadNotes,
        addNoteToDatabase,
        createNoteFromSummary,
        createSummaryNote,
        handleUpdateNote,
        handleDeleteNote,
        // Audio and processing methods
        recording,
        recordingStatus,
        handleStartRecording,
        handleStopRecording,
        processAudioWithGoogle,
        summarizeContent
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};

export default NotesContext; 