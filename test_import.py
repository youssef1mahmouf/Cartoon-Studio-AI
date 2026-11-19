#!/usr/bin/env python3
"""Test imports."""
import sys
sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")

# Test backend main import
from backend.main import app
print("✓ backend.main imported successfully")

# Test endpoints import
from backend.api.v1.endpoints import router
print("✓ backend.api.v1.endpoints imported successfully")

# Test database models import
from database.Models import Project, Episode
print("✓ database.Models imported successfully")

# Test config import
from backend.core.config import settings
print("✓ backend.core.config imported successfully")

print("\nAll imports successful!")