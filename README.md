# Screen Recorder with Face Bubble

A client-side React application that records your screen with a picture-in-picture camera overlay.

## Features
-   **Screen Recording:** Capture your entire screen or specific window.
-   **Camera Overlay:** Adds your face in a circular bubble.
-   **Audio Mixing:** Combines system audio and microphone.
-   **Client-Side:** No server required, processing happens in the browser.
-   **Downloadable:** Exports to `.webm` format.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run dev
    ```

3.  Open the browser at the provided URL (usually `http://localhost:5173`).

## Usage
1.  Click **Enable Camera** to start your webcam.
2.  Click **Share Screen** to select the screen/window to record. *Note: Ensure you check "Share system audio" if you want to capture computer sound.*
3.  Click **Start Recording** to begin.
4.  Click **Stop Recording** when finished.
5.  Click **Download Recording** to save the file.

## Tech Stack
-   React + Vite
-   TypeScript
-   Tailwind CSS
-   MediaStream Recording API
-   Web Audio API


By Matt Burton
