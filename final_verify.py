import sys
sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")
from backend.main import app
print("=== Final Verification: Cartoon Studio AI ===")
print(f"Total routes: {len(app.routes)}")
print("\nAll route paths:")
for r in sorted(app.routes, key=lambda x: x.path):
    print(f"  {r.path}")

# Check v1 routes specifically
v1_routes = [r for r in app.routes if r.path.startswith("/api/v1")]
print(f"\n/api/v1 routes registered: {len(v1_routes)}")
for r in v1_routes:
    print(f"  {r.path}")

print("\n=== Verification Complete ===")