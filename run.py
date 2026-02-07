import subprocess
import sys
import time
import os
import platform

def clear_console():
    os.system('cls' if platform.system() == 'Windows' else 'clear')

def run_project():
    print("🚀 Starting PakPick AI...")
    
    # 1. Start Backend
    backend_cmd = [
        sys.executable if "venv" not in sys.executable else sys.executable,
        "-m", "uvicorn", "backend.main:app", 
        "--port", "8000", "--host", "127.0.0.1"
    ]
    
    # Check if we are in venv
    venv_python = os.path.join("venv", "Scripts", "python.exe")
    if os.path.exists(venv_python):
        backend_cmd[0] = venv_python

    print("📡 Starting Backend...")
    # Removing DEVNULL redirection so we can see errors if they occur
    backend_proc = subprocess.Popen(backend_cmd)

    # 2. Start Frontend
    print("🎨 Starting Frontend...")
    frontend_proc = subprocess.Popen(["npm", "run", "dev"], shell=True)

    # Give it a few seconds to boot
    time.sleep(5)
    
    import webbrowser
    webbrowser.open("http://localhost:5173")
    
    clear_console()
    
    print("="*60)
    print("🔥 PAKPICK AI IS RUNNING! 🔥")
    print("="*60)
    print(f"\n🌍 FRONTEND: http://localhost:5173")
    print(f"⚙️  BACKEND API: http://127.0.0.1:8000")
    print(f"📖 API DOCS: http://127.0.0.1:8000/docs")
    print("\n" + "="*60)
    print("Note: Keep this window open. Press Ctrl+C to stop.")
    print("="*60)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Stopping PakPick AI...")
        backend_proc.terminate()
        frontend_proc.terminate()
        sys.exit(0)

if __name__ == "__main__":
    run_project()
