import { Audio } from 'expo-av';

/**
 * Request microphone permissions
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestMicrophonePermission = async () => {
    try {
        const { status } = await Audio.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Error requesting microphone permission:', error);
        throw error;
    }
};

/**
 * Configure audio mode for recording
 */
export const configureAudioMode = async () => {
    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
    } catch (error) {
        console.error('Error configuring audio mode:', error);
        throw error;
    }
};

/**
 * Start a new audio recording
 * @returns {Promise<Object>} - Object containing recording instance
 */
export const startRecording = async () => {
    try {
        // Request permissions first
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            throw new Error('Microphone permission not granted');
        }
        // Configure audio mode
        await configureAudioMode();

        // Create and start recording
        const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        return { recording };
    } catch (error) {
        console.error('Failed to start recording:', error);
        throw error;
    }
};

/**
 * Stop the current audio recording
 * @param {Object} recording - The recording instance to stop
 * @returns {Promise<string>} - URI of the recorded audio
 */
export const stopRecording = async (recording) => {
    try {
        if (!recording) {
            throw new Error('No active recording to stop');
        }

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        return uri;
    } catch (error) {
        console.error('Failed to stop recording:', error);
        throw error;
    }
};

/**
 * Play an audio file
 * @param {string} uri - URI of the audio file to play
 * @param {Function} onPlaybackStatusUpdate - Callback for playback status updates
 * @returns {Promise<Object>} - Sound object
 */
export const playAudio = async (uri, onPlaybackStatusUpdate) => {
    try {
        console.log('Playing audio from:', uri);

        // Load the sound file
        const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true }
        );

        // Set status update callback if provided
        if (onPlaybackStatusUpdate) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }

        // Play the sound
        await sound.playAsync();

        return sound;
    } catch (error) {
        console.error('Error playing audio:', error);
        throw error;
    }
};

/**
 * Stop and unload a sound object
 * @param {Object} sound - The sound object to unload
 */
export const stopAudio = async (sound) => {
    try {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }
    } catch (error) {
        console.error('Error stopping audio:', error);
        throw error;
    }
}; 