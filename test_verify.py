import sys
sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")
from backend.main import app
print("Router included routes:")
for r in app.routes:
    print(r.path)