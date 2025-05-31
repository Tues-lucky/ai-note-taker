# DoneWithIt

A React Native note-taking app with audio recording and AI summarization capabilities.

## Features

- Create and manage text notes
- Record audio and convert to text notes
- Generate AI summaries of notes
- Clean, intuitive user interface
- Firebase backend for data storage

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account
- Google Cloud account (for Speech-to-Text API)
- OpenAI API key (for AI summaries)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Tues-lucky/ai-note-taker.git
   cd DoneWithIt
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Environment Variables Setup

1. Create a `.env` file in the root directory based on the `env.example` file:
   ```
   cp env.example .env
   ```

2. Fill in your actual API keys and configuration values in the `.env` file:

   - **Firebase Configuration**: Create a project in the [Firebase Console](https://console.firebase.google.com/) and get your configuration values.
   
   - **Google Cloud Speech-to-Text**: 
     - Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
     - Enable the Speech-to-Text API
     - Get your API key and add it to `GOOGLE_CLOUD_API_KEY`
   
   - **OpenAI API**: Get your API key from the [OpenAI Dashboard](https://platform.openai.com/api-keys)

3. Firebase Configuration:
   - Create a `firebase.js` file in the `config` directory based on the `firebase.example.js` file:
     ```
     cp config/firebase.example.js config/firebase.js
     ```
   - Update the configuration with your Firebase project details

### Running the App

Start the development server:
```
npm start
```
or
```
yarn start
```

Then follow the instructions in the terminal to open the app on your device or emulator.

## Project Structure

- `screens/`: Contains the main screen components
- `components/`: Reusable UI components
- `context/`: React Context for state management
- `services/`: API and service integrations
- `styles/`: Styling configurations
- `config/`: Application configuration files
- `assets/`: Images and other static assets

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `FIREBASE_API_KEY` | Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_MEASUREMENT_ID` | Firebase measurement ID |
| `GOOGLE_CLOUD_API_KEY` | Google Cloud API key for Speech-to-Text |
| `OPENAI_API_KEY` | OpenAI API key for AI summaries |
