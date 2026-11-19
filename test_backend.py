#!/usr/bin/env python3
"""Test backend functionality - using already configured app."""
import sys
sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")

from backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

print("=" * 50)
print("BACKEND TESTS")
print("=" * 50)

# Test root endpoint
resp = client.get("/")
print(f"1. Root endpoint: {resp.status_code} - {resp.json()}")

# Test health endpoint
resp = client.get("/health")
print(f"2. Health endpoint: {resp.status_code} - {resp.json()}")

# Test API v1 projects (existing router)
resp = client.get("/api/v1/projects")
print(f"3. Projects API: {resp.status_code} - {len(resp.json()) if resp.status_code == 200 else 'errors'} projects")

# Test create project
resp = client.post("/api/v1/projects", json={"name": "Test Project", "description": "Test description"})
print(f"4. Create project: {resp.status_code} - {resp.json()}")

# Get the created project ID
if resp.status_code == 200:
    project_id = resp.json().get("id")
    
    # Test get project by ID
    if project_id:
        resp = client.get(f"/api/v1/projects/{project_id}")
        print(f"5. Get project by ID: {resp.status_code} - {resp.json()}")
    
    # List all projects
    resp = client.get("/api/v1/projects")
    print(f"6. List all projects: {resp.status_code} - {len(resp.json()) if resp.status_code == 200 else 'errors'} projects")

print("=" * 50)
print("ALL TESTS COMPLETED")
print("=" * 50)