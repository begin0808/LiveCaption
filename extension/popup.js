// Elements
const toggleBtn = document.getElementById('toggle-btn');
const connectionStatus = document.getElementById('connection-status');
const captureStatus = document.getElementById('capture-status');
const ollamaUrlInput = document.getElementById('ollama-url');
const modelNameInput = document.getElementById('model-name');
const deepseekKeyInput = document.getElementById('deepseek-key');
const minSilenceInput = document.getElementById('min-silence');
const maxSpeechInput = document.getElementById('max-speech');
const uiLangInput = document.getElementById('ui-lang');
const sourceLangInput = document.getElementById('source-lang');
const targetLangInput = document.getElementById('target-lang');
const showBilingualInput = document.getElementById('show-bilingual');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const fontSizeInput = document.getElementById('font-size');
const historyLinesInput = document.getElementById('history-lines');

let isCapturing = false;

// UI Localization dictionary
const i18n = {
  'zh-TW': {
    subtitleDesc: '即時影片語音翻譯字幕',
    langNotice: '⚠️ 語音辨識僅支援：中文（含粵語）、英語、日語、韓語',
    labelConnection: '連線狀態:',
    labelCapture: '擷取狀態:',
    statusDisconnected: '未連線',
    statusConnected: '已連線',
    statusConnecting: '連線中...',
    statusInactive: '未啟動',
    statusCapturing: '擷取中',
    labelUiLang: '介面語言 (UI Language)',
    titleControlPanel: '控制面板',
    btnStart: '啟動即時字幕',
    btnStop: '停止即時字幕',
    labelSourceLang: '影片來源語言',
    optSourceAuto: '自動偵測 (Auto)',
    labelTargetLang: '字幕翻譯語言',
    optTargetNone: '僅顯示原文',
    labelShowBilingual: '雙語對照模式 (Bilingual Mode)',
    titleOllama: '本機翻譯設定 (Ollama)',
    labelOllamaUrl: 'Ollama 伺服器網址',
    labelModelName: '翻譯模型名稱',
    titleDeepseek: '雲端翻譯備用 (選填)',
    labelDeepseekKey: 'DeepSeek API 金鑰',
    titleAppearance: '字幕外觀設定',
    labelBgColor: '底框顏色',
    labelTextColor: '文字顏色',
    labelFontSize: '字幕文字大小',
    optSizeSmall: '小 (Small)',
    optSizeMedium: '中 (Medium)',
    optSizeLarge: '大 (Large)',
    optSizeXlarge: '特大 (X-Large)',
    labelHistoryLines: '歷史字幕保留行數',
    optHistory0: '僅顯示最新單行 (0 行歷史)',
    optHistory1: '顯示最新 + 前 1 句 (1 行歷史)',
    optHistory2: '顯示最新 + 前 2 句 (2 行歷史)',
    titleVad: '進階語音切分設定 (VAD)',
    labelMinSilence: '斷句靜音時間:',
    labelMaxSpeech: '單句最長上限:',
    footerText: '100% 離線隱私保護 • Studio0808',
    second: '秒',
    alertPermission: '無法取得音訊擷取權限，請確認頁面為可播放媒體的網頁。\n錯誤資訊: '
  },
  'zh-CN': {
    subtitleDesc: '实时影片语音翻译字幕',
    langNotice: '⚠️ 语音识别仅支持：中文（含粤语）、英语、日语、韩语',
    labelConnection: '连接状态:',
    labelCapture: '捕获状态:',
    statusDisconnected: '未连接',
    statusConnected: '已连接',
    statusConnecting: '连接中...',
    statusInactive: '未启动',
    statusCapturing: '捕获中',
    labelUiLang: '界面语言 (UI Language)',
    titleControlPanel: '控制面板',
    btnStart: '启动实时字幕',
    btnStop: '停止实时字幕',
    labelSourceLang: '视频来源语言',
    optSourceAuto: '自动侦测 (Auto)',
    labelTargetLang: '字幕翻译语言',
    optTargetNone: '仅显示原文',
    labelShowBilingual: '双语对照模式 (Bilingual Mode)',
    titleOllama: '本地翻译设置 (Ollama)',
    labelOllamaUrl: 'Ollama 服务器网址',
    labelModelName: '翻译模型名称',
    titleDeepseek: '云端翻译备用 (选填)',
    labelDeepseekKey: 'DeepSeek API 密钥',
    titleAppearance: '字幕外观设置',
    labelBgColor: '底框颜色',
    labelTextColor: '文字颜色',
    labelFontSize: '字幕文字大小',
    optSizeSmall: '小 (Small)',
    optSizeMedium: '中 (Medium)',
    optSizeLarge: '大 (Large)',
    optSizeXlarge: '特大 (X-Large)',
    labelHistoryLines: '历史字幕保留行数',
    optHistory0: '仅显示最新单行 (0 行历史)',
    optHistory1: '显示最新 + 前 1 句 (1 行历史)',
    optHistory2: '显示最新 + 前 2 句 (2 行历史)',
    titleVad: '高级语音切分设置 (VAD)',
    labelMinSilence: '断句静音时间:',
    labelMaxSpeech: '单句最长上限:',
    footerText: '100% 离线隐私保护 • Studio0808',
    second: '秒',
    alertPermission: '无法获取音频捕获权限，请确认页面为可播放媒体的网页。\n错误信息: '
  },
  'en': {
    subtitleDesc: 'Real-time Video Speech Translation Subtitles',
    langNotice: '⚠️ Speech recognition supports: Chinese (incl. Cantonese), English, Japanese, Korean only',
    labelConnection: 'Connection:',
    labelCapture: 'Capture:',
    statusDisconnected: 'Disconnected',
    statusConnected: 'Connected',
    statusConnecting: 'Connecting...',
    statusInactive: 'Inactive',
    statusCapturing: 'Capturing',
    labelUiLang: 'UI Language',
    titleControlPanel: 'Control Panel',
    btnStart: 'Start Live Caption',
    btnStop: 'Stop Live Caption',
    labelSourceLang: 'Video Source Language',
    optSourceAuto: 'Auto Detect (Auto)',
    labelTargetLang: 'Subtitle Translation Language',
    optTargetNone: 'Original Only',
    labelShowBilingual: 'Bilingual Mode',
    titleOllama: 'Local Translation (Ollama)',
    labelOllamaUrl: 'Ollama Server URL',
    labelModelName: 'Translation Model Name',
    titleDeepseek: 'Cloud Translation Backup (Optional)',
    labelDeepseekKey: 'DeepSeek API Key',
    titleAppearance: 'Subtitle Appearance',
    labelBgColor: 'Background Color',
    labelTextColor: 'Text Color',
    labelFontSize: 'Subtitle Font Size',
    optSizeSmall: 'Small',
    optSizeMedium: 'Medium',
    optSizeLarge: 'Large',
    optSizeXlarge: 'X-Large',
    labelHistoryLines: 'Subtitle History Lines',
    optHistory0: 'Show latest only (0 history lines)',
    optHistory1: 'Show latest + 1 line (1 history line)',
    optHistory2: 'Show latest + 2 lines (2 history lines)',
    titleVad: 'Advanced Speech Segmentation (VAD)',
    labelMinSilence: 'Silence Threshold:',
    labelMaxSpeech: 'Max Speech Duration:',
    footerText: '100% Offline Privacy Protection • Studio0808',
    second: 's',
    alertPermission: 'Failed to acquire audio capture permission. Please ensure the page contains playable media.\nError: '
  },
  'ja': {
    subtitleDesc: 'リアルタイムのビデオ音声翻訳字幕',
    langNotice: '⚠️ 音声認識対応言語：中国語（広東語含む）、英語、日本語、韓国語のみ',
    labelConnection: '接続状態:',
    labelCapture: 'キャプチャ状態:',
    statusDisconnected: '未接続',
    statusConnected: '接続済み',
    statusConnecting: '接続中...',
    statusInactive: '未起動',
    statusCapturing: 'キャプチャ中',
    labelUiLang: '画面言語 (UI Language)',
    titleControlPanel: 'コントロールパネル',
    btnStart: 'リアルタイム字幕を開始',
    btnStop: 'リアルタイム字幕を停止',
    labelSourceLang: 'ビデオのソース言語',
    optSourceAuto: '自動検出 (Auto)',
    labelTargetLang: '字幕翻訳言語',
    optTargetNone: '原文のみ表示',
    labelShowBilingual: '二言語表示モード',
    titleOllama: 'ローカル翻訳設定 (Ollama)',
    labelOllamaUrl: 'Ollama サーバー URL',
    labelModelName: '翻訳モデル名',
    titleDeepseek: 'クラウド翻訳バックアップ (任意)',
    labelDeepseekKey: 'DeepSeek API キー',
    titleAppearance: '字幕外観設定',
    labelBgColor: '背景色',
    labelTextColor: '文字色',
    labelFontSize: '字幕文字サイズ',
    optSizeSmall: '小 (Small)',
    optSizeMedium: '中 (Medium)',
    optSizeLarge: '大 (Large)',
    optSizeXlarge: '特大 (X-Large)',
    labelHistoryLines: '履歴字幕表示行수',
    optHistory0: '最新の1行のみ (履歴なし)',
    optHistory1: '最新 + 前の1行 (履歴1行)',
    optHistory2: '最新 + 前의2行 (履歴2行)',
    titleVad: '高度な音声セグメンテーション (VAD)',
    labelMinSilence: '無音判定時間:',
    labelMaxSpeech: '単句最大時間:',
    footerText: '100% オフラインプライバシー保護 • Studio0808',
    second: '秒',
    alertPermission: '音声キャプチャ権限を取得できませんでした。メディア再生可能なページであることを確認してください。\nエラー情報: '
  },
  'ko': {
    subtitleDesc: '실시간 비디오 음성 번역 자막',
    langNotice: '⚠️ 음성 인식 지원: 중국어(광동어 포함), 영어, 일본어, 한국어만 지원',
    labelConnection: '연결 상태:',
    labelCapture: '캡처 상태:',
    statusDisconnected: '미연결',
    statusConnected: '연결됨',
    statusConnecting: '연결 중...',
    statusInactive: '미실행',
    statusCapturing: '캡처 중',
    labelUiLang: '인터페이스 언어 (UI Language)',
    titleControlPanel: '제어판',
    btnStart: '실시간 자막 시작',
    btnStop: '실시간 자막 중지',
    labelSourceLang: '비디오 원본 언어',
    optSourceAuto: '자동 감지 (Auto)',
    labelTargetLang: '자막 번역 언어',
    optTargetNone: '원본만 표시',
    labelShowBilingual: '이중 언어 대조 모드',
    titleOllama: '로컬 번역 설정 (Ollama)',
    labelOllamaUrl: 'Ollama 서버 주소',
    labelModelName: '번역 모델 이름',
    titleDeepseek: '클라우드 번역 백업 (선택)',
    labelDeepseekKey: 'DeepSeek API 키',
    titleAppearance: '자막 모양 설정',
    labelBgColor: '배경 색상',
    labelTextColor: '텍스트 색상',
    labelFontSize: '자막 텍스트 크기',
    optSizeSmall: '작게 (Small)',
    optSizeMedium: '중간 (Medium)',
    optSizeLarge: '크게 (Large)',
    optSizeXlarge: '아주 크게 (X-Large)',
    labelHistoryLines: '이전 자막 표시 줄 수',
    optHistory0: '최신 한 줄만 표시 (0개 기록)',
    optHistory1: '최신 + 이전 1줄 표시 (1개 기록)',
    optHistory2: '최신 + 이전 2줄 표시 (2개 기록)',
    titleVad: '고급 음성 분할 설정 (VAD)',
    labelMinSilence: '음절 무음 시간:',
    labelMaxSpeech: '한 줄 최대 시간:',
    footerText: '100% 오프라인 개인 정보 보호 • Studio0808',
    second: '초',
    alertPermission: '오디오 캡처 권한을 가져오지 못했습니다. 미디어가 재생 가능한 페이지인지 확인하십시오.\n오류 정보: '
  }
};

function getTranslation(lang, key) {
  const dict = i18n[lang] || i18n['en'];
  return dict[key] || i18n['en'][key] || '';
}

function updateVadLabels(lang) {
  const minVal = minSilenceInput.value;
  const maxVal = maxSpeechInput.value;
  const minLabel = getTranslation(lang, 'labelMinSilence');
  const maxLabel = getTranslation(lang, 'labelMaxSpeech');
  const secUnit = getTranslation(lang, 'second');
  
  const minSilenceLabel = document.querySelector('label[for="min-silence"]');
  minSilenceLabel.innerHTML = `${minLabel} <span id="min-silence-val">${minVal}</span> ${secUnit}`;
  
  const maxSpeechLabel = document.querySelector('label[for="max-speech"]');
  maxSpeechLabel.innerHTML = `${maxLabel} <span id="max-speech-val">${maxVal}</span> ${secUnit}`;
}

function applyLanguage(lang) {
  document.getElementById('subtitle-desc').textContent = getTranslation(lang, 'subtitleDesc');
  document.getElementById('lang-notice').textContent = getTranslation(lang, 'langNotice');
  
  const labels = document.querySelectorAll('.status-item .label');
  if (labels.length >= 2) {
    labels[0].textContent = getTranslation(lang, 'labelConnection');
    labels[1].textContent = getTranslation(lang, 'labelCapture');
  }
  
  document.getElementById('label-ui-lang').textContent = getTranslation(lang, 'labelUiLang');
  document.getElementById('title-control-panel').textContent = getTranslation(lang, 'titleControlPanel');
  
  document.getElementById('label-source-lang').textContent = getTranslation(lang, 'labelSourceLang');
  document.getElementById('opt-source-auto').textContent = getTranslation(lang, 'optSourceAuto');
  document.getElementById('label-target-lang').textContent = getTranslation(lang, 'labelTargetLang');
  document.getElementById('opt-target-none').textContent = getTranslation(lang, 'optTargetNone');
  document.getElementById('label-show-bilingual').textContent = getTranslation(lang, 'labelShowBilingual');
  
  document.getElementById('title-ollama').textContent = getTranslation(lang, 'titleOllama');
  document.querySelector('label[for="ollama-url"]').textContent = getTranslation(lang, 'labelOllamaUrl');
  document.querySelector('label[for="model-name"]').textContent = getTranslation(lang, 'labelModelName');
  
  document.getElementById('title-deepseek').textContent = getTranslation(lang, 'titleDeepseek');
  document.querySelector('label[for="deepseek-key"]').textContent = getTranslation(lang, 'labelDeepseekKey');
  
  document.getElementById('title-appearance').textContent = getTranslation(lang, 'titleAppearance');
  document.querySelector('label[for="bg-color"]').textContent = getTranslation(lang, 'labelBgColor');
  document.querySelector('label[for="text-color"]').textContent = getTranslation(lang, 'labelTextColor');
  document.querySelector('label[for="font-size"]').textContent = getTranslation(lang, 'labelFontSize');
  
  const fontOptions = document.getElementById('font-size').options;
  fontOptions[0].textContent = getTranslation(lang, 'optSizeSmall');
  fontOptions[1].textContent = getTranslation(lang, 'optSizeMedium');
  fontOptions[2].textContent = getTranslation(lang, 'optSizeLarge');
  fontOptions[3].textContent = getTranslation(lang, 'optSizeXlarge');
  
  document.querySelector('label[for="history-lines"]').textContent = getTranslation(lang, 'labelHistoryLines');
  const historyOptions = document.getElementById('history-lines').options;
  historyOptions[0].textContent = getTranslation(lang, 'optHistory0');
  historyOptions[1].textContent = getTranslation(lang, 'optHistory1');
  historyOptions[2].textContent = getTranslation(lang, 'optHistory2');
  
  document.getElementById('title-vad').textContent = getTranslation(lang, 'titleVad');
  updateVadLabels(lang);
  
  document.getElementById('footer-text').textContent = getTranslation(lang, 'footerText');
}

// Load settings from storage
chrome.storage.local.get([
  'ollamaUrl', 'modelName', 'deepseekKey', 'minSilence', 'maxSpeech',
  'uiLang', 'sourceLang', 'targetLang', 'showBilingual',
  'bgColor', 'textColor', 'fontSize', 'historyLines'
], (result) => {
  if (result.ollamaUrl) ollamaUrlInput.value = result.ollamaUrl;
  if (result.modelName) modelNameInput.value = result.modelName;
  if (result.deepseekKey) deepseekKeyInput.value = result.deepseekKey;
  if (result.minSilence !== undefined) {
    minSilenceInput.value = result.minSilence;
  }
  if (result.maxSpeech !== undefined) {
    maxSpeechInput.value = result.maxSpeech;
  }
  if (result.uiLang) {
    uiLangInput.value = result.uiLang;
  } else {
    uiLangInput.value = 'zh-TW';
  }
  if (result.sourceLang) sourceLangInput.value = result.sourceLang;
  if (result.targetLang) targetLangInput.value = result.targetLang;
  if (result.showBilingual !== undefined) {
    showBilingualInput.checked = result.showBilingual;
  } else {
    showBilingualInput.checked = true;
  }
  if (result.bgColor) bgColorInput.value = result.bgColor;
  if (result.textColor) textColorInput.value = result.textColor;
  if (result.fontSize) fontSizeInput.value = result.fontSize;
  if (result.historyLines !== undefined) historyLinesInput.value = result.historyLines;

  // Apply localization initially
  applyLanguage(uiLangInput.value);
  updateStatus();
});

// Update settings in storage on input
const saveSettings = () => {
  const settings = {
    ollamaUrl: ollamaUrlInput.value,
    modelName: modelNameInput.value,
    deepseekKey: deepseekKeyInput.value,
    minSilence: parseFloat(minSilenceInput.value),
    maxSpeech: parseFloat(maxSpeechInput.value),
    uiLang: uiLangInput.value,
    sourceLang: sourceLangInput.value,
    targetLang: targetLangInput.value,
    showBilingual: showBilingualInput.checked,
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

  // Notify content script in the active tab to update styles, lines, and mode in real-time
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

      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'update-subtitle-mode',
        targetLang: settings.targetLang,
        showBilingual: settings.showBilingual
      }).catch(() => {});
    }
  });
};

ollamaUrlInput.addEventListener('input', saveSettings);
modelNameInput.addEventListener('input', saveSettings);
deepseekKeyInput.addEventListener('input', saveSettings);

uiLangInput.addEventListener('change', () => {
  applyLanguage(uiLangInput.value);
  saveSettings();
  updateStatus();
});
sourceLangInput.addEventListener('change', saveSettings);
targetLangInput.addEventListener('change', saveSettings);
showBilingualInput.addEventListener('change', saveSettings);

bgColorInput.addEventListener('input', saveSettings);
textColorInput.addEventListener('input', saveSettings);
fontSizeInput.addEventListener('change', saveSettings);
historyLinesInput.addEventListener('change', saveSettings);

minSilenceInput.addEventListener('input', () => {
  updateVadLabels(uiLangInput.value);
  saveSettings();
});

maxSpeechInput.addEventListener('input', () => {
  updateVadLabels(uiLangInput.value);
  saveSettings();
});

// Query status on popup open
const updateStatus = () => {
  const lang = uiLangInput.value;
  chrome.runtime.sendMessage({ type: 'get-status' }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("Could not communicate with background script:", chrome.runtime.lastError.message);
      return;
    }
    if (response) {
      isCapturing = response.isCapturing;
      
      // Update toggle button
      if (isCapturing) {
        toggleBtn.textContent = getTranslation(lang, 'btnStop');
        toggleBtn.className = 'btn btn-stop';
        captureStatus.textContent = getTranslation(lang, 'statusCapturing');
        captureStatus.className = 'status active';
      } else {
        toggleBtn.textContent = getTranslation(lang, 'btnStart');
        toggleBtn.className = 'btn btn-start';
        captureStatus.textContent = getTranslation(lang, 'statusInactive');
        captureStatus.className = 'status inactive';
      }
      
      // Update connection status
      if (response.isConnected) {
        connectionStatus.textContent = getTranslation(lang, 'statusConnected');
        connectionStatus.className = 'status online';
      } else {
        connectionStatus.textContent = isCapturing ? getTranslation(lang, 'statusConnecting') : getTranslation(lang, 'statusDisconnected');
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
      // 1. Get active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) return;
      const tab = tabs[0];
      
      // 2. Request stream ID under user gesture
      chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, (streamId) => {
        if (chrome.runtime.lastError) {
          console.error("無法取得音訊擷取 ID:", chrome.runtime.lastError.message);
          const alertText = getTranslation(uiLangInput.value, 'alertPermission');
          alert(alertText + chrome.runtime.lastError.message);
          return;
        }
        
        // 3. Send message to background
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
