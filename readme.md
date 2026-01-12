# 🎬 StreamFlow Player

**StreamFlow Player** is a modern, web-based video streaming platform with a sleek **Glassmorphism UI**.
It supports **direct video files** and **adaptive streaming protocols (HLS & DASH)**, along with a **built-in proxy server** to bypass CORS restrictions — all in one lightweight setup.

> Think of it as a clean, developer-friendly alternative to bulky media players.

---

## ✨ Key Features

### 🎥 Universal Playback

* Supports:

  * **MP4**
  * **WebM**
  * **HLS (.m3u8)**
  * **DASH (.mpd)**

### 🌐 Built-in CORS Proxy

* Node.js proxy server for streaming videos from restrictive sources.
* No browser CORS issues while testing or streaming external URLs.

### 🧊 Glassmorphism UI

* Frosted glass effects
* Smooth animations
* Deep, modern backgrounds
* Clean and distraction-free layout

### 🧠 Smart History

* Automatically remembers recently played streams
* Quickly resume previous videos

### 🎛️ Advanced Player Controls

* Playback speed control (**0.5x – 2x**)
* Quality selection (**Auto / Manual for HLS & DASH**)
* Picture-in-Picture mode
* Fullscreen mode
* Video download support
* Caption / subtitle support (when available)

---

## 🚀 Getting Started

### 📦 Prerequisites

* **Node.js** (v16+ recommended)
* A modern browser (Chrome, Edge, Firefox)

---

### 📥 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/StreamFlow-Player.git
   ```

2. **Navigate into the project**

   ```bash
   cd StreamFlow-Player
   ```

3. **Install dependencies** (if added later)

   ```bash
   npm install
   ```

---

### ▶️ Running the Application

Start the local server:

```bash
npm start
```

Open your browser and visit:

```
http://localhost:4000
```

You’re ready to stream 🎉

---

## 🔀 Branching & Version Control

This project is stable and Git-friendly, making it easy to extend without breaking existing features.

---

### 🌿 Creating a New Feature Branch

Example: adding **Chat Support**

```bash
git checkout -b feature/chat-support
```

Work freely on new features.
If something breaks, return safely:

```bash
git checkout main
```

---

### 🍴 Forking the Project

Want your own version like **StreamFlow Pro** or **StreamFlow Lite**?

1. Copy the entire project folder
2. Rename it
3. Update the `name` field in `package.json`
4. Customize features independently

---

## 🛠️ Project Structure

```plaintext
StreamFlow-Player/
│
├── index.html     # Main UI layout
├── styles.css     # Glassmorphism styling & animations
├── player.js      # Frontend logic (video handling & controls)
├── server.js      # Backend server & CORS proxy
├── package.json   # Project configuration
└── README.md      # Documentation
```

---

## 🧪 Supported Use Cases

* Streaming public video URLs
* Testing HLS / DASH streams locally
* Learning video streaming protocols
* Building custom video platforms
* UI/UX inspiration for modern web apps

---

## 🔒 Security Note

The built-in proxy is intended for **development and educational purposes**.
For production use, apply proper validation, rate-limiting, and security hardening.

---

## 📜 License

This project is licensed under the **MIT License**.
You’re free to use, modify, and distribute it.

---

## ⭐ Show Some Love

If you found this project useful:

* ⭐ Star the repo
* 🍴 Fork it
* 🛠️ Build something awesome on top of it
