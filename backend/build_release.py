import os
import shutil
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist", "LiveCaptionServer")

def run_command(cmd, cwd=None):
    print(f"執行指令: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, shell=True)
    if result.returncode != 0:
        print(f"錯誤: 指令執行失敗 (代碼 {result.returncode})")
        sys.exit(result.returncode)

def main():
    print("=== Studio0808 LiveCaption 後端打包工具 ===")
    
    # 1. 切換工作目錄到 backend
    os.chdir(BASE_DIR)
    
    # 2. 確保虛擬環境的 pip 與 pyinstaller 存在
    exe_ext = ".exe" if sys.platform == "win32" else ""
    pip_path = os.path.join(BASE_DIR, ".venv", "Scripts", f"pip{exe_ext}")
    pyinstaller_path = os.path.join(BASE_DIR, ".venv", "Scripts", f"pyinstaller{exe_ext}")
    
    if not os.path.exists(pip_path):
        print(f"未找到虛擬環境的 pip (路徑: {pip_path})，請確認您已在 backend 目錄建立 .venv")
        sys.exit(1)
        
    print("正在檢查並安裝 PyInstaller...")
    run_command([pip_path, "install", "pyinstaller"])
    
    # 3. 執行 PyInstaller 打包 (onedir 模式，利於載入外部大型模型)
    # --collect-data opencc 用於確保簡繁轉換字典能被正確包入 exe
    print("正在使用 PyInstaller 編譯 Python 程式為 Windows 執行檔...")
    pyinstaller_cmd = [
        pyinstaller_path,
        "--name", "LiveCaptionServer",
        "--onedir",
        "--clean",
        "-y",
        "--collect-data", "opencc",
        "main.py"
    ]
    run_command(pyinstaller_cmd)
    
    # 4. 複製 AI 模型檔案到打包後的資料夾中
    print("正在複製 AI 模型至發布資料夾...")
    
    # VAD 模型
    vad_src = os.path.join(BASE_DIR, "silero_vad.onnx")
    vad_dst = os.path.join(DIST_DIR, "silero_vad.onnx")
    if os.path.exists(vad_src):
        print("複製 VAD 模型...")
        shutil.copy2(vad_src, vad_dst)
    else:
        print("警告: 找不到 silero_vad.onnx！請先執行 download_models.py")
        
    # SenseVoice ASR 模型
    asr_dir_name = "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17"
    asr_src = os.path.join(BASE_DIR, str(asr_dir_name))
    asr_dst = os.path.join(DIST_DIR, str(asr_dir_name))
    if os.path.exists(asr_src):
        print("複製 SenseVoice ASR 模型目錄 (檔案較大，請稍候)...")
        if os.path.exists(asr_dst):
            shutil.rmtree(asr_dst)
        shutil.copytree(asr_src, asr_dst)
    else:
        print("警告: 找不到 SenseVoice 模型目錄！請先執行 download_models.py")
        
    # 5. 建立便利的「啟動服務.bat」批次檔
    print("正在建立一鍵啟動批次檔...")
    bat_path = os.path.join(DIST_DIR, "點我啟動【即時字幕】後端服務.bat")
    bat_content = """@echo off
chcp 65001 > nul
title Studio0808 LiveCaption Server
echo ===================================================
echo   正在啟動 Studio0808 LiveCaption 語音翻譯後端伺服器...
echo ===================================================
echo.
LiveCaptionServer.exe
echo.
echo 伺服器已結束運行。
pause
"""
    with open(bat_path, "w", encoding="utf-8") as f:
        f.write(bat_content)
        
    print("\n=== [SUCCESS] 打包完成！ ===")
    print(f"打包成品路徑：{DIST_DIR}")
    print("您可以直接將該資料夾壓縮為 ZIP 檔分享給他人使用！")
    print("使用者只需解壓縮後，點選「點我啟動【即時字幕】後端服務.bat」即可啟動伺服器，無需安裝 Python 或執行指令！")

if __name__ == "__main__":
    main()
