#!/usr/bin/env python3
"""Test frontend API client configuration."""
import sys
sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")

from frontend.lib.api.client import apiClient, API_BASE_URL

print("=" * 50)
print("FRONTEND API CLIENT TEST")
print("=" * 50)

print(f"\nAPI Base URL: {API_BASE_URL}")

# Test that apiClient can make requests
print(f"\napiClient baseURL: {apiClient.base_url}")

# Test getting projects (will fail without DB, but should not have config issues)
try:
    import requests
    resp = requests.get(f"{API_BASE_URL}/v1/projects", timeout=5)
    print(f"\nProjects endpoint response: {resp.status_code}")
except Exception as e:
    print(f"\nProjects endpoint error (expected without DB): {e}")

print("\n" + "=" * 50)
print("FRONTEND API CLIENT TEST COMPLETE")
print("=" * 50)