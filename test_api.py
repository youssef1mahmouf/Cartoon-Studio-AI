import sys
sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")

from backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
resp = client.get("/api/v1/projects")
print(f"Status: {resp.status_code}")
print(f"Body: {resp.json()}")