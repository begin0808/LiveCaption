let isCapturing = false;
let isConnected = false;
let activeTabId = null;

// Sync variables from storage on startup to maintain consistency
chrome.storage.local.get(['isCapturing', 'isConnected', 'activeTabId'], (result) => {
  isCapturing = result.isCapturing || false;
  isConnected = result.isConnected || false;
  activeTabId = result.activeTabId || null;
  
  // Double check with actual offscreen document presence
  chrome.offscreen.hasDocument().then(hasDoc => {
    if (!hasDoc && isCapturing) {
      isCapturing = false;
      isConnected = false;
      activeTabId = null;
      chrome.storage.local.set({ isCapturing: false, isConnected: false, activeTabId: null });
    }
  });
});

// Listen to messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'get-status') {
    chrome.offscreen.hasDocument().then(hasDoc => {
      if (!hasDoc) {
        isCapturing = false;
        isConnected = false;
        activeTabId = null;
        chrome.storage.local.set({ isCapturing: false, isConnected: false, activeTabId: null });
      }
      sendResponse({ isCapturing, isConnected });
    });
    return true;
  }
  
  if (message.type === 'start-capture') {
    startCapture(message.streamId, message.tabId).then(() => sendResponse({ success: true }));
    return true;
  }
  
  if (message.type === 'stop-capture') {
    stopCapture().then(() => sendResponse({ success: true }));
    return true;
  }
  
  if (message.type === 'update-config') {
    // Forward config updates to offscreen if active
    chrome.offscreen.hasDocument().then(hasDoc => {
      if (hasDoc) {
        chrome.runtime.sendMessage({
          type: 'update-config',
          target: 'offscreen',
          config: message.config
        });
        
        const tabId = activeTabId;
        if (tabId) {
          chrome.tabs.sendMessage(tabId, {
            type: 'update-subtitle-mode',
            subtitleMode: message.config.subtitleMode
          }).catch(() => {});
        }
      }
    });
    sendResponse({ success: true });
    return true;
  }
  
  // Messages from Offscreen
  if (message.target === 'background') {
    if (message.type === 'websocket-connected') {
      isConnected = true;
      chrome.storage.local.set({ isConnected: true });
    }
    
    if (message.type === 'websocket-disconnected') {
      isConnected = false;
      chrome.storage.local.set({ isConnected: false });
    }
    
    if (message.type === 'subtitle-data') {
      // Forward subtitle translation to content script in the active tab
      const tabId = activeTabId;
      if (tabId) {
        chrome.storage.local.get(['subtitleMode', 'showBilingual'], (result) => {
          let subtitleMode = result.subtitleMode;
          if (!subtitleMode) {
            subtitleMode = result.showBilingual !== false ? 'bilingual' : 'translation';
          }
          chrome.tabs.sendMessage(tabId, {
            type: 'render-subtitle',
            data: message.data,
            subtitleMode: subtitleMode
          }).catch(err => {
            console.warn("Failed to send subtitle to content script (tab might have been closed or reloaded):", err);
          });
        });
      }
    }
    
    if (message.type === 'offscreen-error') {
      console.error("Offscreen capture error:", message.error);
      stopCapture();
    }
  }
});

async function startCapture(streamId, tabId) {
  const hasDoc = await chrome.offscreen.hasDocument();
  if (hasDoc) {
    console.log("Offscreen document already exists. Stopping before restarting...");
    await stopCapture();
  }
  
  try {
    activeTabId = tabId;
    isCapturing = true;
    await chrome.storage.local.set({ isCapturing: true, activeTabId: tabId });
    
    // 3. Load config from storage
    const storage = await chrome.storage.local.get(['ollamaUrl', 'modelName', 'deepseekKey', 'minSilence', 'maxSpeech', 'showBilingual', 'sourceLang']);
    const config = {
      ollamaUrl: storage.ollamaUrl || 'http://localhost:11434',
      modelName: storage.modelName || 'qwen2.5:3b-instruct',
      deepseekKey: storage.deepseekKey || '',
      minSilence: storage.minSilence !== undefined ? storage.minSilence : 0.5,
      maxSpeech: storage.maxSpeech !== undefined ? storage.maxSpeech : 6.0,
      sourceLang: storage.sourceLang || 'auto'
    };
    const showBilingual = storage.showBilingual !== false;
    
    // 4. Create Offscreen Document if it doesn't exist
    const hasDocument = await chrome.offscreen.hasDocument();
    if (!hasDocument) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'Capture tab audio for real-time speech transcription'
      });
    }
    
    // 5. Tell Content Script to show/reset subtitles overlay
    chrome.storage.local.get(['subtitleMode', 'showBilingual'], (res) => {
      let subtitleMode = res.subtitleMode;
      if (!subtitleMode) {
        subtitleMode = res.showBilingual !== false ? 'bilingual' : 'translation';
      }
      chrome.tabs.sendMessage(activeTabId, { 
        type: 'show-subtitles',
        subtitleMode: subtitleMode
      }).catch(() => {
        // Content script might not be loaded yet, ignoring
      });
    });
    
    // 6. Tell Offscreen Document to start recording and connect WebSocket
    // We add a tiny delay to ensure the offscreen document is ready to listen
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'init-recording',
        target: 'offscreen',
        streamId: streamId,
        config: config
      });
    }, 300);
    
    console.log(`Started tab audio capture on tab: ${activeTabId}`);
    
  } catch (err) {
    console.error("Failed to start capture:", err);
    isCapturing = false;
    isConnected = false;
    activeTabId = null;
    await chrome.storage.local.set({ isCapturing: false, isConnected: false, activeTabId: null });
  }
}

async function stopCapture() {
  try {
    // 1. Close Offscreen Document
    const hasDocument = await chrome.offscreen.hasDocument();
    if (hasDocument) {
      await chrome.offscreen.closeDocument();
    }
    
    // 2. Tell Content Script to hide subtitles
    const tabId = activeTabId;
    if (tabId) {
      chrome.tabs.sendMessage(tabId, { type: 'hide-subtitles' }).catch(() => {});
    }
    
  } catch (err) {
    console.error("Failed to stop capture safely:", err);
  } finally {
    isCapturing = false;
    isConnected = false;
    activeTabId = null;
    await chrome.storage.local.set({ isCapturing: false, isConnected: false, activeTabId: null });
    console.log("Stopped tab audio capture");
  }
}
