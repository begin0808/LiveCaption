// Elements
const toggleBtn = document.getElementById('toggle-btn');
const connectionStatus = document.getElementById('connection-status');
const captureStatus = document.getElementById('capture-status');
const ollamaUrlInput = document.getElementById('ollama-url');
const modelNameInput = document.getElementById('model-name');
const deepseekKeyInput = document.getElementById('deepseek-key');
const minSilenceInput = document.getElementById('min-silence');
const minSilenceVal = document.getElementById('min-silence-val');
const maxSpeechInput = document.getElementById('max-speech');
const maxSpeechVal = document.getElementById('max-speech-val');
const showBilingualInput = document.getElementById('show-bilingual');
const sourceLangInput = document.getElementById('source-lang');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const fontSizeInput = document.getElementById('font-size');
const historyLinesInput = document.getElementById('history-lines');

let isCapturing = false;

// Load settings from storage
chrome.storage.local.get(['ollamaUrl', 'modelName', 'deepseekKey', 'minSilence', 'maxSpeech', 'showBilingual', 'sourceLang', 'bgColor', 'textColor', 'fontSize', 'historyLines'], (result) => {
  if (result.ollamaUrl) ollamaUrlInput.value = result.ollamaUrl;
  if (result.modelName) modelNameInput.value = result.modelName;
  if (result.deepseekKey) deepseekKeyInput.value = result.deepseekKey;
  if (result.minSilence !== undefined) {
    minSilenceInput.value = result.minSilence;
    minSilenceVal.textContent = result.minSilence;
  }
  if (result.maxSpeech !== undefined) {
    maxSpeechInput.value = result.maxSpeech;
    maxSpeechVal.textContent = result.maxSpeech;
  }
  showBilingualInput.checked = result.showBilingual !== false; // Default to true
  if (result.sourceLang) sourceLangInput.value = result.sourceLang;
  if (result.bgColor) bgColorInput.value = result.bgColor;
  if (result.textColor) textColorInput.value = result.textColor;
  if (result.fontSize) fontSizeInput.value = result.fontSize;
  if (result.historyLines !== undefined) historyLinesInput.value = result.historyLines;
});

// Update settings in storage on input
const saveSettings = () => {
  const settings = {
    ollamaUrl: ollamaUrlInput.value,
    modelName: modelNameInput.value,
    deepseekKey: deepseekKeyInput.value,
    minSilence: parseFloat(minSilenceInput.value),
    maxSpeech: parseFloat(maxSpeechInput.value),
    showBilingual: showBilingualInput.checked,
    sourceLang: sourceLangInput.value,
    bgColor: bgColorInput.value,
    textColor: textColorInput.value,
    fontSize: fontSizeInput.value,
    historyLines: parseInt(historyLinesInput.value)
  };
  chrome.storage.local.set(settings);
  
  // Also propagate config to backend if currently active
  chrome.runtime.sendMessage({
    type: 'update-config',
    config: settings
  });

  // Notify content script in the active tab to update colors, fonts, and history lines in real-time
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'update-styles',
        bgColor: settings.bgColor,
        textColor: settings.textColor,
        fontSize: settings.fontSize
      }).catch(() => {});

      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'update-history-lines',
        historyLines: settings.historyLines
      }).catch(() => {});
    }
  });
};

ollamaUrlInput.addEventListener('input', saveSettings);
modelNameInput.addEventListener('input', saveSettings);
deepseekKeyInput.addEventListener('input', saveSettings);
showBilingualInput.addEventListener('change', saveSettings);
sourceLangInput.addEventListener('change', saveSettings);
bgColorInput.addEventListener('input', saveSettings);
textColorInput.addEventListener('input', saveSettings);
fontSizeInput.addEventListener('change', saveSettings);
historyLinesInput.addEventListener('change', saveSettings);

minSilenceInput.addEventListener('input', () => {
  minSilenceVal.textContent = minSilenceInput.value;
  saveSettings();
});

maxSpeechInput.addEventListener('input', () => {
  maxSpeechVal.textContent = maxSpeechInput.value;
  saveSettings();
});

// Query status on popup open
const updateStatus = () => {
  chrome.runtime.sendMessage({ type: 'get-status' }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("Could not communicate with background script:", chrome.runtime.lastError.message);
      return;
    }
    if (response) {
      isCapturing = response.isCapturing;
      
      // Update toggle button
      if (isCapturing) {
        toggleBtn.textContent = '停止即時字幕';
        toggleBtn.className = 'btn btn-stop';
        captureStatus.textContent = '擷取中';
        captureStatus.className = 'status active';
      } else {
        toggleBtn.textContent = '啟動即時字幕';
        toggleBtn.className = 'btn btn-start';
        captureStatus.textContent = '未啟動';
        captureStatus.className = 'status inactive';
      }
      
      // Update connection status
      if (response.isConnected) {
        connectionStatus.textContent = '已連線';
        connectionStatus.className = 'status online';
      } else {
        connectionStatus.textContent = isCapturing ? '連線中...' : '未連線';
        connectionStatus.className = 'status offline';
      }
    }
  });
};

// Initial update and periodic polling while popup is open
updateStatus();
const intervalId = setInterval(updateStatus, 1000);
window.addEventListener('unload', () => clearInterval(intervalId));

// Button toggle
toggleBtn.addEventListener('click', async () => {
  if (isCapturing) {
    chrome.runtime.sendMessage({ type: 'stop-capture' }, () => {
      setTimeout(updateStatus, 200);
    });
  } else {
    saveSettings();
    try {
      // 1. 獲取當前活動頁面的 Tab ID
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) return;
      const tab = tabs[0];
      
      // 2. 直接在 Popup 手勢觸發的上下文獲取 Stream ID
      chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, (streamId) => {
        if (chrome.runtime.lastError) {
          console.error("無法取得音訊擷取 ID:", chrome.runtime.lastError.message);
          alert("無法取得音訊擷取權限，請確認頁面為可播放媒體的網頁。\n錯誤資訊: " + chrome.runtime.lastError.message);
          return;
        }
        
        // 3. 發送帶有 streamId 的訊息給 background.js
        chrome.runtime.sendMessage({
          type: 'start-capture',
          streamId: streamId,
          tabId: tab.id
        }, () => {
          setTimeout(updateStatus, 200);
        });
      });
    } catch (err) {
      console.error("啟動擷取失敗:", err);
    }
  }
});
