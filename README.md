# Studio0808 LiveCaption - 即時網頁影音雙語字幕系統（支援中／英／日／韓／粵語語音）

[English Version](README_EN.md) | [繁體中文](README.md)

👉 **線上多國語言手冊 (Live Manual)**: [https://begin0808.github.io/LiveCaption/](https://begin0808.github.io/LiveCaption/)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform: Windows | macOS](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-brightgreen.svg)](#)
[![ASR: SenseVoice](https://img.shields.io/badge/ASR-SenseVoice--Small-orange.svg)](#)

Studio0808 LiveCaption 是一套專為瀏覽器影片設計的即時語音識別與雙語字幕翻譯系統。完全在您的本機電腦執行，擁有 100% 的隱私保護與極低延遲的解碼速度。

> ⚠️ **語音辨識支援語系**：本系統採用阿里巴巴開源的 **SenseVoice-Small** 語音模型，目前僅支援 **中文（含粵語）、英語、日語、韓語** 的語音辨識。尚不支援西班牙語、法語、德語、俄語等歐語系語音辨識，敬請留意。

適合用於線上學習、聽障輔助、外語練習、全球直播觀看以及視訊會議記錄等多種多元應用場景。

---

## 💡 技術亮點與運作機制

本系統採用**即時句級串流偵測與翻譯技術**，並非簡單的「錄音後整檔上傳」或「靜態音軌轉譯」：

1. **分頁音訊無損獨佔擷取 (Tab Audio Loopback)**：
   - 透過 Chrome Extension 的 Offscreen Document 與 `tabCapture` 機制，直接擷取分頁播放的音訊數位輸出。
   - **優勢**：完全不佔用或干擾電腦麥克風/喇叭，不會收錄到環境雜音、打字聲或其他網頁分頁的音訊，確保辨識輸入純淨無雜質。
2. **即時流式斷句與語音辨識 (Near Real-time Stream Processing)**：
   - 播放影片時，瀏覽器會將音訊切片以 WebSocket 二進位串流即時傳送至 Python 後端。
   - 後端利用高效的 **Silero VAD (語音活動檢測)** 進行即時流式監聽與斷句（預設當說話停頓達 0.5 秒時自動切分句子），並在句子結束的瞬間交給 **SenseVoice-Small** 大模型進行高速本機解碼。
   - **效果**：幾乎是「隨說隨翻」的即時句級字幕顯示（在人說完話後約 100ms ~ 300ms 內完成辨識與翻譯），而不是整段影片播完才處理。
3. **100% 全本機離線隱私保障 (Privacy-First)**：
   - 可選全離線架構：語音辨識由 **Sherpa-ONNX** 處理，翻譯可搭配本機 **Ollama**（建議使用 Qwen 2.5 3B 語意對齊佳），所有音訊與文本皆不離機，保證絕對隱私。
4. **熱插拔多軌翻譯引擎**：
   - 整合 OpenCC 本地繁簡轉換、本機 Ollama 離線翻譯，亦支援 DeepSeek 雲端 API 及免費 Google Translate API 作為備用，讓低配備電腦也能享受高速翻譯。

---

## 🚀 離線整合發布包下載 (Windows 推薦)

如果您不想配置開發環境，可以直接下載一鍵執行的離線整合發布包：

*   **[下載一鍵運行離線整合包 (Google Drive)](https://drive.google.com/file/d/1mepxzOthPV2NeWjwenk8yNsSSB0vaJGF/view?usp=sharing)**
*   **版本檔案**：`LiveCaption_V20260621.ZIP` (含所有必備的 AI 語音模型與批次啟動檔)

---

## ✨ 系統功能與特色

*   **極低延遲分頁音訊擷取**：藉由 Chrome Extension 獨創的分頁音訊 Loopback 機制，精準擷取分頁播放的音軌（不影響電腦其他音訊與錄音設備）。
*   **本機離線 AI 語音辨識**：後端搭載 Sherpa-ONNX 架構與阿里巴巴開源的 **SenseVoice-Small** 語音大模型，支援中、英、日、韓、粵語等語音，離線解碼速度極快，準確度高。
*   **自由切換翻譯引擎**：支援本機 **Ollama** 推理框架（推薦搭配 Qwen 2.5 3B 模型）進行全離線翻譯；同時支援線上 **DeepSeek** 雲端 API，以極低成本取得高畫質雙語對照。
*   **高顏值字幕懸浮視窗**：精心設計的毛玻璃 (Glassmorphism) 半透明質感底框，支援字體大小、顏色自訂，具備滑鼠穿透（不影響影片操作）、手勢拖拽定位與雙擊位置重置。
*   **多行歷史字幕滾動**：可選擇保留 0 - 2 行歷史字幕，舊字幕會以半透明、縮小解碼在上方滾動，避免字幕跳過快而漏看。
*   **100% 離線隱私安全**：所有音訊擷取、語音辨識、模型翻譯與字幕繪製皆在本機完成，無需連網，資料絕不外洩。

---

## 📂 專案目錄結構

```text
LiveCaption/
├── backend/                  # Python 後端伺服器原始碼
│   ├── docs/                 # 說明網頁與多國語言翻譯檔
│   ├── main.py               # 後端 WebSocket 伺服器主程式
│   ├── requirements.txt      # Python 依賴包清單
│   ├── download_models.py    # AI 模型自動下載腳本
│   └── build_release.py      # 一鍵打包編譯腳本
├── extension/                # Chrome 瀏覽器外掛原始碼
│   ├── manifest.json         # 外掛設定檔
│   ├── popup.html/js/css     # 外掛控制面板
│   └── offscreen.html/js     # 分頁音訊擷取行程
└── README.md                 # 說明文件
```

---

## ⚡ 快速安裝與啟動步驟

### 步驟 1：啟動後端伺服器 (Backend Server)
如果您使用的是**離線整合發布包**：
1. 下載並解壓縮 `LiveCaption_V20260621.ZIP`。
2. 進入目錄並雙擊執行 **`點我啟動【即時字幕】後端服務.bat`**。
3. 當 CMD 視窗顯示 `INFO: Uvicorn running on http://127.0.0.1:8000` 即代表啟動成功，請保持該視窗開啟。

如果您使用的是**原始碼運行**（跨平台 Mac/Windows）：
1. 確保已安裝 Python 3.8+ 環境。
2. 進入 `backend` 資料夾安裝依賴包：
   ```bash
   pip install -r requirements.txt
   ```
3. 下載 AI 模型：
   ```bash
   python download_models.py
   ```
4. 啟動伺服器：
   ```bash
   python main.py
   ```

### 步驟 2：載入 Chrome 瀏覽器外掛 (Extension)
1. 在 Chrome 瀏覽器網址列輸入並前往 `chrome://extensions/`。
2. 在右上角開啟 **「開發者模式」 (Developer Mode)** 開關。
3. 點擊左上角的 **「載入已解壓縮擴充功能」 (Load unpacked)** 按鈕。
4. 選擇專案資料夾底下的 **`extension`** 資料夾載入。
5. 確認 Chrome 工具列已出現 **Studio0808 LiveCaption** 的圖示。

### 步驟 3：開啟影片，開始擷取與翻譯
1. 前往 YouTube 或任何影片網站播放影片。
2. 點擊擴充功能圖示開啟設定面板，點擊 **「啟動即時字幕」**。
3. 網頁底部將會彈出毛玻璃風格的字幕懸浮框，開始為您進行即時辨識與雙語翻譯！

---

## 🛠️ 開發者專用：打包與編譯

若需要自行修改 Python 後端程式並重新編譯為 `.exe` 執行檔，請使用內建的打包工具：

1. 在 `backend/` 目錄下建立 `.venv` 虛擬環境並安裝相應依賴。
2. 在專案根目錄下執行編譯指令：
   ```powershell
   backend\.venv\Scripts\python.exe backend\build_release.py
   ```
3. 編譯成品將會自動輸出至 `backend/dist/LiveCaptionServer/` 資料夾，該目錄已排除任何暫存快取，可直接壓縮發布。

---

## 💬 常見問題與障礙排除 (FAQ)

#### Q1：後端顯示 "Cannot capture a tab with an active stream" 錯誤？
*   **原因**：通常發生在播放影片時重新載入（Reload）外掛，導致前一個音軌連線未釋放。
*   **解法**：請按下 `F5` 重新整理影片網頁，並在外掛錯誤頁面點擊「全部清除」重新啟動即可。

#### Q2：中文影片每句開頭的第一個字常常漏掉？
*   **原因**：VAD 語音偵測模型在句子開頭需要少許時間反應（特別是輕發音字如「我」、「你」）。
*   **解法**：請在外掛的控制面板中，將 **「斷句靜音時間」調高至 `0.8` 秒**，並將 **「單句最長上限」調高至 `8.0` 秒以上**，可顯著提升首字保留率。最新版後端亦已在底層調降偵測門檻，提升開頭字的敏感度。

---

## ✉️ 聯絡與支援

若在使用上有任何問題或建議，歡迎透過 GITHUB 提出 Issue，或寫信至 [begin0808@gmail.com](mailto:begin0808@gmail.com)。

*Copyright &copy; 2026 Studio0808 智造實驗室. All rights reserved.*
