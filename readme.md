StreamFlow Player 🎬

StreamFlow is a modern, web-based video player featuring a "Glassmorphism" UI design. It supports direct file links (MP4, WebM) as well as adaptive streaming protocols (HLS, DASH) and includes a built-in proxy server to bypass CORS restrictions.

✨ Features

Universal Playback: Supports .mp4, .webm, .m3u8 (HLS), and .mpd (DASH).

CORS Proxy: Built-in Node.js server to stream content from restrictive sources.

Glassmorphism UI: Frosted glass aesthetics with deep animated backgrounds.

Smart History: Remembers your recently watched streams.

Advanced Controls:

Playback Speed (0.5x - 2x)

Quality Selection (Auto/Manual for HLS/DASH)

Picture-in-Picture & Fullscreen

Download & Caption support

🚀 Getting Started

Prerequisites

Node.js installed on your machine.

Installation

Download or Clone this repository.

Open the folder in your terminal.

(Optional) If you add external packages later, run:

npm install


Running the App

Start the local server:

npm start


Open your browser and navigate to:
http://localhost:4000

🌿 Branching & Forking

Since this project is now in a stable state, you can use Git to manage future versions.

Creating a New Branch

If you want to add a new feature (e.g., "Chat Support") without breaking the current player:

Initialize Git (if you haven't):

git init
git add .
git commit -m "Initial commit of StreamFlow V1"


Create and switch to a new branch:

git checkout -b feature/chat-support


Make your changes. If you break something, you can always go back to the main version:

git checkout main


Forking

If you want to create a completely separate copy (e.g., "StreamFlow Pro" vs "StreamFlow Lite"):

Simply copy the entire folder to a new location.

Rename the folder.

Update the "name" field in package.json.

🛠️ Project Structure

index.html: The main interface structure.

styles.css: All visual styling (Glassmorphism, animations).

player.js: Frontend logic (Video handling, UI events).

server.js: Backend logic (Static file serving, Proxy).

📝 License

This project is open-source and available under the MIT License.