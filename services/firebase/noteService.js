import { collection, addDoc, deleteDoc, doc, query, where, getDocs, orderBy, updateDoc } from "firebase/firestore";
import { db } from '../../config';

/**
 * Fetch all notes from Firestore, ordered by creation date
 */
export const fetchNotes = async () => {
    try {
        console.log('Loading notes...');
        const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const firestoreNotes = [];
        querySnapshot.forEach((doc) => {
            firestoreNotes.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return firestoreNotes;
    } catch (error) {
        console.error('Error loading notes:', error);
        throw error;
    }
};

/**
 * Add a new note to Firestore
 * @param {Object} noteData - Full note data object
 * @returns {Promise<Object>} - Note with ID
 */
export const addNote = async (noteData) => {
    try {
        const docRef = await addDoc(collection(db, "notes"), noteData);
        console.log("Note added to Firestore with ID: ", docRef.id);

        // Return the note with its ID
        return {
            id: docRef.id,
            ...noteData
        };
    } catch (error) {
        console.error('Error adding note to Firestore:', error);
        throw error;
    }
};

/**
 * Create and add a new note with basic information
 * @param {string} type - Type of note ('audio', 'manual', 'summary', etc.)
 * @param {string} title - Note title
 * @param {string} content - Note content
 * @returns {Promise<Object>} - Created note with ID
 */
export const createNote = async (type, title, content) => {
    try {
        // Create the note object with standard fields
        const noteData = {
            title,
            content,
            createdAt: new Date().toISOString(),
            type
        };
        // Use the existing addNote function to add it to Firestore
        return await addNote(noteData);
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
};

/**
 * Update an existing note in Firestore
 */
export const updateNote = async (updatedNote) => {
    try {
        if (!updatedNote || !updatedNote.id) {
            console.error('Cannot update note: Note or note ID is missing');
            return false;
        }

        const noteRef = doc(db, 'notes', updatedNote.id);

        // Remove the id from the data to be updated (Firestore doesn't need it in the document data)
        const { id, ...noteData } = updatedNote;

        await updateDoc(noteRef, noteData);
        console.log('Note updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating note in Firestore:', error);
        return false;
    }
};

/**
 * Delete a note from Firestore by ID or content
 */
export const deleteNote = async (noteToDelete) => {
    try {
        if (noteToDelete.id) {
            // If we have the document ID, delete directly
            await deleteDoc(doc(db, "notes", noteToDelete.id));
            console.log("Note deleted from Firestore with ID: ", noteToDelete.id);
            return true;
        } else {
            // Fallback to query if ID is not available
            const q = query(collection(db, "notes"), where("content", "==", noteToDelete.content));
            const querySnapshot = await getDocs(q);

            let deleted = false;
            querySnapshot.forEach(async (document) => {
                await deleteDoc(doc(db, "notes", document.id));
                console.log("Note deleted from Firestore with ID: ", document.id);
                deleted = true;
            });

            return deleted;
        }
    } catch (error) {
        console.error("Error deleting note from Firestore: ", error);
        throw error;
    }
}; 