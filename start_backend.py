#!/usr/bin/env python3
"""Start backend server."""
import subprocess
import sys
import time

# Start the backend server
proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.main:app", "--reload", "--port", "8001"],
    cwd="d:\\Linux-Transfer\\Code\\Cartoon Studio AI",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Wait for server to start
time.sleep(3)

# Test the endpoints
import requests

print("Testing backend endpoints...")
try:
    # Test root
    resp = requests.get("http://127.0.0.1:8001/", timeout=5)
    print(f"1. Root: {resp.status_code} - {resp.json()}")
    
    # Test health
    resp = requests.get("http://127.0.0.1:8001/health", timeout=5)
    print(f"2. Health: {resp.status_code} - {resp.json()}")
    
    # Test projects get
    resp = requests.get("http://127.0.0.1:8001/api/v1/projects", timeout=5)
    print(f"3. Projects GET: {resp.status_code} - {len(resp.json()) if resp.status_code == 200 else 'errors'} projects")
    
    # Test projects create
    resp = requests.post("http://127.0.0.1:8001/api/v1/projects", json={"name": "Test Project", "description": "Test"})
    print(f"4. Projects CREATE: {resp.status_code} - {resp.json()}")
    
except Exception as e:
    print(f"Error: {e}")

# Kill the server
proc.terminate()
proc.wait()
print("\nBackend server stopped")