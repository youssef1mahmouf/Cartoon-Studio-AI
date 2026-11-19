#!/usr/bin/env python3
import subprocess
import os

base = r"d:\Linux-Transfer\Code\Cartoon Studio AI"
frontend_dir = os.path.join(base, "frontend")

print(f"Running npm install in {frontend_dir}...")
result = subprocess.run(
    ["npm", "install"],
    cwd=frontend_dir,
    capture_output=True,
    text=True,
    timeout=300
)

print("STDOUT:", result.stdout[:2000] if result.stdout else "empty")
print("STDERR:", result.stderr[:2000] if result.stderr else "empty")
print("Return code:", result.returncode)

if result.returncode == 0:
    print("npm install SUCCESS")
else:
    print("npm install FAILED")