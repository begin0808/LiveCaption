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
   - **⚠️ 請注意**：發布包內建的 AI 模型（SenseVoice-Small、Silero VAD）僅負責**語音辨識**。翻譯引擎中的 **Ollama 需另行安裝**、**DeepSeek 需自行申請付費金鑰**；兩者皆未設定時，系統會自動使用免費的 Google Translate，字幕仍可正常運作（詳見下方「翻譯引擎設定」）。

---

## 🚀 離線整合發布包下載 (Windows 推薦)

如果您不想配置開發環境，可以直接下載一鍵執行的離線整合發布包：

*   **[下載一鍵運行離線整合包 (Google Drive)](https://drive.google.com/file/d/1mepxzOthPV2NeWjwenk8yNsSSB0vaJGF/view?usp=sharing)**
*   **版本檔案**：`LiveCaption_V20260621.ZIP` (含所有必備的 AI 語音模型與批次啟動檔)

---

## ✨ 系統功能與特色

*   **極低延遲分頁音訊擷取**：藉由 Chrome Extension 獨創的分頁音訊 Loopback 機制，精準擷取分頁播放的音軌（不影響電腦其他音訊與錄音設備）。
*   **本機離線 AI 語音辨識**：後端搭載 Sherpa-ONNX 架構與阿里巴巴開源的 **SenseVoice-Small** 語音大模型，支援中、英、日、韓、粵語等語音，離線解碼速度極快，準確度高。
*   **自由切換翻譯引擎**：內建免費 Google Translate 備援，開箱即用；亦可自行安裝本機 **Ollama** 推理框架（推薦搭配 Qwen 2.5 3B 模型）進行全離線翻譯，或填入 **DeepSeek** 雲端金鑰，以極低成本取得高品質雙語對照。（Ollama 與 DeepSeek 皆需另行安裝或申請）
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

## 🌐 翻譯引擎設定（選用）

**完成上述三個步驟後，字幕就已經可以正常運作了。**後端會依序嘗試 DeepSeek → Ollama → Google Translate，取第一個可用的引擎；若前兩者都未設定，會自動使用免費的 Google Translate，無須任何額外安裝。

以下兩種引擎**皆未包含在發布包中**，僅在您有進階需求時才需自行安裝：

### 選項 A：安裝 Ollama，取得全離線翻譯（不連網、隱私最佳）

> **📌 重要：Ollama 程式與 `qwen2.5:3b-instruct` 模型並未包含在本專案或發布包中，必須另行安裝下載。**
> 發布包內建的 `sherpa-onnx-sense-voice`（約 228MB）與 `silero_vad.onnx` 只負責「語音辨識」，不負責翻譯。

1. 前往 **[Ollama 官方下載頁](https://ollama.com/download)**，依您的作業系統下載並安裝 Windows / macOS / Linux 版本。
   安裝後 Ollama 會常駐系統列（工作列出現羊駝圖示），並自動在 `http://localhost:11434` 提供服務。
2. 開啟命令提示字元（Windows 按 `Win + R` 輸入 `cmd`；Mac 開啟「終端機」），下載翻譯模型（約 **2GB**，依網速約需 3~15 分鐘）：
   ```bash
   ollama pull qwen2.5:3b-instruct
   ```
3. 驗證安裝是否成功：
   ```bash
   ollama list
   ```
   若清單中出現 `qwen2.5:3b-instruct` 即代表完成。也可在瀏覽器開啟 `http://localhost:11434`，看到 `Ollama is running` 即表示服務正常。
4. 點擊外掛圖示，確認「Ollama 伺服器網址」為 `http://localhost:11434`、「翻譯模型名稱」為 `qwen2.5:3b-instruct`（皆為預設值，通常無須修改）。

**硬體建議**：3B 模型約需 4GB 以上記憶體，一般文書筆電即可流暢執行。若您有獨立顯卡（8GB VRAM 以上），可改用 `ollama pull qwen2.5:7b-instruct` 取得更佳語意品質，並將外掛的「翻譯模型名稱」改填 `qwen2.5:7b-instruct`。

**注意**：使用時請保持 Ollama 在背景執行。若後端偵測到 Ollama 未啟動，會自動跳過並改用備援翻譯，以避免每句字幕都等待連線逾時。

### 選項 B：申請 DeepSeek 雲端金鑰，取得最高語意品質（付費）

1. 前往 **[DeepSeek 開放平台](https://platform.deepseek.com/)** 註冊登入。
2. 點擊左側選單 **"Top up"** 儲值（採先儲值後扣款制，最低儲值 1~5 美元即可使用極長時間）。
3. 點擊 **"API Keys" → "Create new API key"** 建立金鑰，複製以 `sk-` 開頭的字串（**只會顯示一次**）。
4. 點擊外掛圖示，貼到「DeepSeek API 金鑰」欄位即可啟用。

**費用說明**：DeepSeek 無月費或訂閱制，完全依實際使用的 Token 量計費。本系統預設使用 `deepseek-v4-flash` 模型，官方牌價為每百萬 Token：輸入 $0.14（快取命中 $0.0028）、輸出 $0.28 美元。實務上觀看 1 小時影片約僅消耗 **0.01~0.03 美元**，儲值 2 美元大約可翻譯 100 小時以上的影片。尖峰時段（北京時間每日 09:00–12:00、14:00–18:00）費率為 2 倍。最新價格請以 **[DeepSeek 官方定價頁](https://api-docs.deepseek.com/quick_start/pricing)** 為準。

> **⚠️ 模型代號異動**：舊有的 `deepseek-chat` 與 `deepseek-reasoner` 代號已於 **2026 年 7 月 24 日停用**，現行代號為 `deepseek-v4-flash` 與 `deepseek-v4-pro`。若您使用的是舊版後端，請更新至最新版本，否則雲端翻譯會失敗並自動退回 Google Translate。

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
