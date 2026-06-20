let subtitleContainer = null;
let clearTimer = null;
let subtitleHistory = [];
let maxHistoryLines = 0; // 0 = only show latest, 1 = latest + 1 history, 2 = latest + 2 history

// Initialize subtitle overlay
function initSubtitleOverlay() {
  if (document.getElementById('studio0808-subtitle-container')) return;
  
  subtitleContainer = document.createElement('div');
  subtitleContainer.id = 'studio0808-subtitle-container';
  
  // Inject styling directly into the DOM
  const style = document.createElement('style');
  style.textContent = `
    #studio0808-subtitle-container {
      position: fixed;
      bottom: 8%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      width: 85%;
      max-width: 750px;
      padding: 12px 18px;
      background: var(--subtitle-bg, rgba(10, 15, 25, 0.82));
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      text-align: center;
      pointer-events: auto;
      cursor: grab;
      user-select: none;
      display: none;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    #studio0808-subtitle-container:active {
      cursor: grabbing;
    }
    
    #studio0808-subtitle-container.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    
    .studio0808-subtitle-line {
      margin-bottom: 12px;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    
    .studio0808-subtitle-line:last-child {
      margin-bottom: 0;
    }
    
    /* Faded style for history lines */
    .studio0808-subtitle-line.history-line {
      opacity: 0.45;
      transform: scale(0.94);
      margin-bottom: 8px;
    }
    
    .studio0808-subtitle-raw-item {
      font-size: calc(var(--subtitle-font-size-raw, 14px) * 0.95);
      color: rgba(220, 225, 235, 0.75);
      margin-bottom: 3px;
      line-height: 1.4;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
      font-weight: 400;
    }
    
    .studio0808-subtitle-zh-item {
      font-size: var(--subtitle-font-size-zh, 19px);
      color: var(--subtitle-color, #ffffff);
      line-height: 1.4;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
      font-weight: 700;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(subtitleContainer);
  
  // Load initial appearance settings from storage
  chrome.storage.local.get(['bgColor', 'textColor', 'fontSize', 'historyLines'], (result) => {
    const bg = result.bgColor || '#0a0f19';
    const text = result.textColor || '#ffffff';
    const size = result.fontSize || 'medium';
    maxHistoryLines = result.historyLines !== undefined ? parseInt(result.historyLines) : 0;
    applySubtitleStyles(bg, text, size);
  });
  
  // Drag and drop logic
  let isDragging = false;
  let startX, startY;
  let initialX, initialY;
  
  subtitleContainer.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Left click only
    isDragging = true;
    const rect = subtitleContainer.getBoundingClientRect();
    subtitleContainer.style.transform = 'none';
    subtitleContainer.style.left = rect.left + 'px';
    subtitleContainer.style.top = rect.top + 'px';
    subtitleContainer.style.bottom = 'auto';
    startX = e.clientX;
    startY = e.clientY;
    initialX = rect.left;
    initialY = rect.top;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    subtitleContainer.style.left = (initialX + dx) + 'px';
    subtitleContainer.style.top = (initialY + dy) + 'px';
  });
  
  document.addEventListener('mouseup', () => { isDragging = false; });
  
  // Double click to reset to default position
  subtitleContainer.addEventListener('dblclick', () => {
    subtitleContainer.style.transform = 'translateX(-50%)';
    subtitleContainer.style.left = '50%';
    subtitleContainer.style.top = 'auto';
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenElement) {
      subtitleContainer.style.position = 'absolute';
      subtitleContainer.style.bottom = '10%';
    } else {
      subtitleContainer.style.position = 'fixed';
      subtitleContainer.style.bottom = '8%';
    }
  });
  
  // Listen to Fullscreen Change Event
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
}

function handleFullscreenChange() {
  if (!subtitleContainer) return;
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (fullscreenElement) {
    fullscreenElement.appendChild(subtitleContainer);
    subtitleContainer.style.position = 'absolute';
    subtitleContainer.style.bottom = '10%';
  } else {
    document.body.appendChild(subtitleContainer);
    subtitleContainer.style.position = 'fixed';
    subtitleContainer.style.bottom = '8%';
  }
}

// Render history subtitles based on configurations
function renderHistorySubtitles(subtitleMode) {
  if (!subtitleContainer) return;
  
  subtitleContainer.innerHTML = ''; // Clear previous elements
  
  subtitleHistory.forEach((item, index) => {
    const isLatest = (index === subtitleHistory.length - 1);
    
    const lineWrapper = document.createElement('div');
    lineWrapper.className = 'studio0808-subtitle-line';
    if (!isLatest) {
      lineWrapper.classList.add('history-line');
    }
    
    if (subtitleMode === 'bilingual') {
      // Raw text (English/Japanese) - hidden if equal to zh text
      if (item.text_raw && item.text_raw !== item.text_zh) {
        const rawEl = document.createElement('div');
        rawEl.className = 'studio0808-subtitle-raw-item';
        rawEl.textContent = item.text_raw;
        lineWrapper.appendChild(rawEl);
      }
      
      // Translated text (Chinese)
      const zhEl = document.createElement('div');
      zhEl.className = 'studio0808-subtitle-zh-item';
      zhEl.textContent = item.text_zh;
      lineWrapper.appendChild(zhEl);
    } else if (subtitleMode === 'raw') {
      // Show only raw text with primary styling (larger and bolder)
      const rawEl = document.createElement('div');
      rawEl.className = 'studio0808-subtitle-zh-item';
      rawEl.textContent = item.text_raw || item.text_zh;
      lineWrapper.appendChild(rawEl);
    } else { // 'translation' (Chinese only)
      const zhEl = document.createElement('div');
      zhEl.className = 'studio0808-subtitle-zh-item';
      zhEl.textContent = item.text_zh;
      lineWrapper.appendChild(zhEl);
    }
    
    subtitleContainer.appendChild(lineWrapper);
  });
  
  subtitleContainer.style.display = 'block';
  subtitleContainer.classList.add('visible');
}

// Listen to runtime messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'show-subtitles') {
    initSubtitleOverlay();
    subtitleHistory = []; // Reset history queue
    subtitleContainer.innerHTML = '';
    
    const subtitleMode = message.subtitleMode || 'bilingual';
    
    // Push initial status placeholder
    subtitleHistory.push({
      text_raw: subtitleMode !== 'translation' ? '語音系統已連線，準備辨識中...' : '',
      text_zh: '語音系統已連線，準備辨識中...'
    });
    
    renderHistorySubtitles(subtitleMode);
    
    if (clearTimer) clearTimeout(clearTimer);
    clearTimer = setTimeout(clearSubtitle, 4000);
  }
  
  if (message.type === 'hide-subtitles') {
    clearSubtitle();
  }
  
  if (message.type === 'render-subtitle') {
    console.log("LiveCaption: Received subtitle to render:", message.data);
    initSubtitleOverlay();
    
    const data = message.data;
    const subtitleMode = message.subtitleMode || 'bilingual';
    
    // Clear initial status placeholders if any
    subtitleHistory = subtitleHistory.filter(item => item.text_zh !== '語音系統已連線，準備辨識中...');
    
    // Check for duplicate segment updates (same start time)
    const duplicateIndex = subtitleHistory.findIndex(item => item.start === data.start);
    if (duplicateIndex !== -1) {
      subtitleHistory[duplicateIndex] = {
        text_raw: data.text_raw,
        text_zh: data.text_zh,
        duration: data.duration,
        start: data.start
      };
    } else {
      subtitleHistory.push({
        text_raw: data.text_raw,
        text_zh: data.text_zh,
        duration: data.duration,
        start: data.start
      });
    }
    
    // Slice queue to match history lines length + 1 (current latest line)
    if (subtitleHistory.length > maxHistoryLines + 1) {
      subtitleHistory = subtitleHistory.slice(subtitleHistory.length - (maxHistoryLines + 1));
    }
    
    renderHistorySubtitles(subtitleMode);
    
    // Set auto-fade timer
    if (clearTimer) clearTimeout(clearTimer);
    const duration = Math.max(3000, (data.duration || 3) * 1000 + 1500);
    clearTimer = setTimeout(clearSubtitle, duration);
  }
  
  if (message.type === 'toggle-bilingual' || message.type === 'update-subtitle-mode') {
    initSubtitleOverlay();
    const subtitleMode = message.subtitleMode || (message.showBilingual !== false ? 'bilingual' : 'translation');
    renderHistorySubtitles(subtitleMode);
  }
  
  if (message.type === 'update-styles') {
    initSubtitleOverlay();
    applySubtitleStyles(message.bgColor, message.textColor, message.fontSize);
  }
  
  if (message.type === 'update-history-lines') {
    maxHistoryLines = message.historyLines !== undefined ? parseInt(message.historyLines) : 0;
    // Prune queue immediately if new limit is smaller
    if (subtitleHistory.length > maxHistoryLines + 1) {
      subtitleHistory = subtitleHistory.slice(subtitleHistory.length - (maxHistoryLines + 1));
    }
    chrome.storage.local.get(['subtitleMode', 'showBilingual'], (result) => {
      let subtitleMode = result.subtitleMode;
      if (!subtitleMode) {
        subtitleMode = result.showBilingual !== false ? 'bilingual' : 'translation';
      }
      renderHistorySubtitles(subtitleMode);
    });
  }
});

function applySubtitleStyles(bg, text, fontSize) {
  if (!subtitleContainer) return;
  
  // Appends 'd1' (Hex for 82% opacity) to 6-digit hex colors to make it semi-transparent
  let finalBg = bg;
  if (bg.startsWith('#') && bg.length === 7) {
    finalBg = bg + 'd1';
  }
  
  subtitleContainer.style.setProperty('--subtitle-bg', finalBg);
  subtitleContainer.style.setProperty('--subtitle-color', text);
  subtitleContainer.style.setProperty('--subtitle-color-fade', text); 
  
  // Map selectors to specific font size scales
  let rawSize = '14px';
  let zhSize = '19px';
  
  if (fontSize === 'small') {
    rawSize = '12px';
    zhSize = '16px';
  } else if (fontSize === 'medium') {
    rawSize = '14px';
    zhSize = '19px';
  } else if (fontSize === 'large') {
    rawSize = '18px';
    zhSize = '24px';
  } else if (fontSize === 'xlarge') {
    rawSize = '22px';
    zhSize = '28px';
  }
  
  subtitleContainer.style.setProperty('--subtitle-font-size-raw', rawSize);
  subtitleContainer.style.setProperty('--subtitle-font-size-zh', zhSize);
}

function clearSubtitle() {
  subtitleHistory = [];
  if (subtitleContainer) {
    subtitleContainer.classList.remove('visible');
    setTimeout(() => {
      // Check if another segment hasn't triggered visibility before hiding
      if (!subtitleContainer.classList.contains('visible')) {
        subtitleContainer.style.display = 'none';
        subtitleContainer.innerHTML = '';
      }
    }, 250);
  }
}
