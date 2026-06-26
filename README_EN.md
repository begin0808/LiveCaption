# Studio0808 LiveCaption - Real-Time Web Video Speech Translation & Bilingual Subtitles (Chinese / English / Japanese / Korean / Cantonese)

[English](README_EN.md) | [繁體中文版](README.md)

👉 **Live Documentation & Manual**: [https://begin0808.github.io/LiveCaption/](https://begin0808.github.io/LiveCaption/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform: Windows | macOS](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-brightgreen.svg)](#)
[![ASR: SenseVoice](https://img.shields.io/badge/ASR-SenseVoice--Small-orange.svg)](#)

Studio0808 LiveCaption is a real-time speech recognition and bilingual subtitle translation system designed specifically for browser videos. Running entirely on your local machine, it offers 100% privacy protection and ultra-low latency.

> ⚠️ **Supported Speech Languages**: This system uses Alibaba's open-source **SenseVoice-Small** speech model, which currently supports speech recognition for **Chinese (including Cantonese), English, Japanese, and Korean** only. European languages such as Spanish, French, German, and Russian are **not** supported for speech recognition at this time.

Ideal for online learning, accessibility/hearing-assist, foreign language listening training, global live streams, and video conference transcripts.

---

## 💡 Technical Highlights & Architecture

This system uses **real-time sentence-level streaming detection & translation technology**, rather than simple post-processed file transcribing or static track extraction:

1. **Tab Audio Loopback (Lossless & Exclusive Capture)**:
   - Uses Chrome Extension's Offscreen Document and `tabCapture` APIs to capture the digital audio output of the specific active tab directly.
   - **Advantage**: Does not occupy or interfere with system microphone or speakers. It will not record ambient room noise, typing sounds, or audio from other tabs, ensuring pristine audio input for the ASR engine.
2. **Near Real-time Stream Processing (Dynamic ASR & VAD)**:
   - While playing a video, the browser slices audio and streams it to the Python backend in real-time using binary WebSockets.
   - The backend runs an optimized local **Silero VAD (Voice Activity Detection)** model on the stream to dynamically chunk sentences (detecting short pauses, e.g., 0.5s silence). As soon as a sentence ends, it is immediately dispatched to the local **SenseVoice-Small** engine.
   - **Experience**: Near-real-time sentence-level captions and translation (showing up about 100ms - 300ms after speech ends) instead of processing the video after it finishes.
3. **100% Offline & Privacy-First**:
   - Supports a fully offline stack: ASR powered by local **Sherpa-ONNX**, and translation powered by local **Ollama** (Qwen 2.5 3B recommended). All audio processing and text generation remain strictly on your local machine.
4. **Hot-Swappable Translation Engines**:
   - Supports OpenCC for local Traditional/Simplified Chinese conversion, local Ollama offline translation, online DeepSeek API, and a free Google Translate API fallback.

---

## 🚀 Pre-Packaged Offline Bundle Download (Recommended for Windows)

If you do not want to configure the Python development environment, you can download the pre-compiled, one-click execution offline bundle:

*   **[Download One-Click Offline Bundle (Google Drive)](https://drive.google.com/file/d/1mepxzOthPV2NeWjwenk8yNsSSB0vaJGF/view?usp=sharing)**
*   **Version File**: `LiveCaption_V20260621.ZIP` (Includes all necessary AI speech models and batch startup files)

---

## ✨ Features

*   **Ultra-Low Latency Tab Audio Capture**: Uses a unique Chrome Extension tab audio loopback mechanism to precisely capture audio tracks playing in the active tab without affecting other system audio or recording devices.
*   **Offline Local AI Speech Recognition**: Powered by the Sherpa-ONNX architecture and Alibaba's open-source **SenseVoice-Small** speech model. Supports Chinese, English, Japanese, Korean, and Cantonese with extremely fast local decoding.
*   **Flexible Translation Engines**: Supports the local **Ollama** framework (Qwen 2.5 3B recommended) for fully offline translation, as well as the online **DeepSeek** Cloud API for near-human quality translation.
*   **Premium Glassmorphism Subtitle Window**: An elegant semi-transparent floating window overlay supporting custom font sizes and colors, mouse click-through, drag-and-drop repositioning, and double-click to reset.
*   **Multi-Line History Subtitle Scrolling**: Retains 0 to 2 lines of historical subtitles, fading and shrinking older lines upward to ensure you don't miss fast-paced speech.
*   **100% Offline Privacy & Security**: All audio capture, speech recognition, translation, and rendering are done locally. No internet access is required, ensuring absolute privacy.

---

## 📂 Project Structure

```text
LiveCaption/
├── backend/                  # Python backend server source code
│   ├── docs/                 # Documentation website and localization files
│   ├── main.py               # Main backend WebSocket server
│   ├── requirements.txt      # Python dependencies
│   ├── download_models.py    # AI models automatic downloader
│   └── build_release.py      # Build and compile release package script
├── extension/                # Chrome browser extension source code
│   ├── manifest.json         # Extension manifest file
│   ├── popup.html/js/css     # Extension popup controller panel
│   └── offscreen.html/js     # Tab audio capture worker context
└── README.md                 # Project README (Traditional Chinese)
```

---

## ⚡ Quick Start Guide

### Step 1: Start the Backend Server
If using the **Pre-Packaged Offline Bundle**:
1. Download and extract `LiveCaption_V20260621.ZIP`.
2. Enter the directory and double-click to run **`點我啟動【即時字幕】後端服務.bat`**.
3. Once the CMD window displays `INFO: Uvicorn running on http://127.0.0.1:8000`, the server is running. Keep this window open.

If running from **Source Code** (Cross-platform Mac/Windows):
1. Ensure Python 3.8+ is installed.
2. Enter the `backend` folder and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Download AI models:
   ```bash
   python download_models.py
   ```
4. Launch the server:
   ```bash
   python main.py
   ```

### Step 2: Load the Chrome Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle on the **"Developer mode"** in the top-right corner.
3. Click the **"Load unpacked"** button in the top-left corner.
4. Select the **`extension`** folder under this project directory to load.
5. Confirm that the **Studio0808 LiveCaption** icon appears in your extension toolbar.

### Step 3: Open Video & Start Capturing
1. Go to YouTube or any video hosting site and play a video.
2. Click the extension icon in your toolbar, and click **「啟動即時字幕」** (Start Subtitles).
3. A Glassmorphism style floating subtitle window will pop up at the bottom of the page, showing real-time transcripts and translations.

---

## 🛠️ Developer Guide: Compiling and Packaging

To modify the Python backend and package it into a `.exe` executable for Windows distribution:

1. Create a `.venv` virtual environment in the `backend/` directory and install dependencies.
2. Under the project root directory, run the compile script:
   ```powershell
   backend\.venv\Scripts\python.exe backend\build_release.py
   ```
3. The packaged folder will be exported to `backend/dist/LiveCaptionServer/`. It is clean of caches and ready to be zipped.

---

## 💬 FAQ & Troubleshooting

#### Q1: Backend shows "Cannot capture a tab with an active stream" error?
*   **Reason**: Usually happens when reloading the extension while a video is playing, leaving the previous stream unreleased.
*   **Solution**: Press `F5` to refresh the video tab, click "Clear all" on the extension error page, and start the subtitle service again.

#### Q2: The first word of a sentence is frequently truncated or missing?
*   **Reason**: The Voice Activity Detection (VAD) model needs a transient delay (around 100ms) to detect active speech. Quiet or short start words (like "我", "你") can get clipped.
*   **Solution**: In the extension settings under "VAD Settings", increase **"Segment Silence Duration" to `0.8` seconds** and **"Max Sentence Duration" to `8.0` seconds or longer**. The latest backend has also lowered the VAD trigger threshold to `0.4` and minimum speech duration to `0.15s` for higher sensitivity.

---

## ✉️ Contact & Support

If you have any questions, bug reports, or feature requests, feel free to open an Issue on GitHub or email us at [begin0808@gmail.com](mailto:begin0808@gmail.com).

*Copyright &copy; 2026 Studio0808 Maker Lab. All rights reserved.*
