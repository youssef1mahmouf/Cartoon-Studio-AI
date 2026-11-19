import sys
sys.path.insert(0, ".")


from backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
routes = client.routes
print(f"Total routes: {len(routes)}")
print("All registered routes:")
for r in routes:
    methods = getattr(r, "methods", set())
    path = r.path
    meth_str = ",".join(sorted(methods))
    print(f"  {path}  [{meth_str}]")
