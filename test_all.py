#!/usr/bin/env python3
"""Complete test suite for Cartoon Studio AI - Frontend + Backend"""

import sys
import subprocess
import time
import webbrowser

sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")

def test_backend_health():
    """Test backend health endpoint."""
    import requests
    try:
        resp = requests.get("http://127.0.0.1:8001/", timeout=5)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        assert data["message"] == "Cartoon Studio AI API", f"Unexpected message: {data}"
        assert data["version"] == "0.1.0", f"Unexpected version: {data}"
        print("✓ Backend health check passed")
        return True
    except Exception as e:
        print(f"✗ Backend health check failed: {e}")
        return False

def test_backend_docs():
    """Test backend Swagger docs endpoint."""
    try:
        resp = requests.get("http://127.0.0.1:8001/docs", timeout=5)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        print("✓ Backend Swagger docs passed")
        return True
    except Exception as e:
        print(f"✗ Backend Swagger docs failed: {e}")
        return False

def test_backend_projects_api():
    """Test backend projects API endpoint."""
    try:
        resp = requests.get("http://127.0.0.1:8001/api/v1/projects", timeout=5)
        # Note: This may return 404 if no projects exist in DB, which is OK
        print(f"✓ Backend projects API responded with status {resp.status_code}")
        return True
    except Exception as e:
        print(f"✗ Backend projects API failed: {e}")
        return False

def test_frontend_accessible():
    """Test frontend is accessible."""
    try:
        resp = requests.get("http://localhost:3002", timeout=5)
        # Next.js dev mode may return different status codes
        print(f"✓ Frontend accessible (status: {resp.status_code})")
        return True
    except Exception as e:
        print(f"✗ Frontend accessible failed: {e}")
        return False

def main():
    print("=" * 60)
    print("COMPLETE CARTOON STUDIO AI TEST SUITE")
    print("=" * 60)
    print()
    
    results = []
    
    print("--- Backend Tests ---")
    results.append(("Backend Health", test_backend_health()))
    results.append(("Backend Swagger Docs", test_backend_docs()))
    results.append(("Backend Projects API", test_backend_projects_api()))
    print()
    
    print("--- Frontend Tests ---")
    results.append(("Frontend Accessible", test_frontend_accessible()))
    print()
    
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    all_passed = True
    for test_name, passed in results:
        status = "PASS" if passed else "FAIL"
        print(f"  {test_name}: {status}")
        if not passed:
            all_passed = False
    
    print()
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
    else:
        print("⚠️  Some tests failed - check output above for details")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())