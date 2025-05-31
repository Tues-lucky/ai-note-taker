import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { GOOGLE_CLOUD_API_KEY } from '@env';

/**
 * Process audio file with Google Speech-to-Text API
 * @param {string} uri - URI of the audio file
 * @returns {Promise<string>} - Transcribed text
 */
export const transcribeAudio = async (uri) => {
    try {
        console.log('Processing audio from:', uri);

        const audioData = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64 // Read the audio file as base64
        });

        console.log('Audio data length:', audioData.length);

        const requestBody = { // Prepare the request body for Google Speech API
            config: {
                encoding: 'MP3',
                sampleRateHertz: 44100,
                languageCode: 'en-US',
                enableAutomaticPunctuation: true,
                model: 'default',
                useEnhanced: true
            },
            audio: {
                content: audioData
            }
        };
        console.log('Sending audio to Google Speech-to-Text API...');

        const url = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`;
        const response = await axios.post(url, requestBody, { headers: { 'Content-Type': 'application/json' } }); // Make the REST API request

        console.log('Response received:', JSON.stringify(response.data));

        let transcription = '';
        if (response.data && response.data.results && response.data.results.length > 0) { // Extract the transcription
            transcription = response.data.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

            console.log('Transcription:', transcription);
            return transcription;
        } else {
            console.log('No transcription results found in response');
            return '';
        }
    } catch (error) {
        console.error('Error processing audio with Google Speech:', error);
        console.error('Error details:', error.response ? error.response.data : error.message);
        throw error;
    }
}; 