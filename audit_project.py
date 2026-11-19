#!/usr/bin/env python3
import os

base = r'd:\Linux-Transfer\Code\Cartoon Studio AI'

print('=== PROJECT STRUCTURE AUDIT ===')
print()

print('Top-level directories:')
for item in sorted(os.listdir(base)):
    full = os.path.join(base, item)
    if os.path.isdir(full) and not item.startswith('.'):
        print(f'  {item}/')

print()
print('Frontend check:')
frontend = os.path.join(base, 'frontend')
if os.path.exists(frontend):
    print(f'  frontend/ exists')
    print(f'  Contents: {os.listdir(frontend)}')
    package_json = os.path.join(frontend, 'package.json')
    print(f'  package.json exists: {os.path.exists(package_json)}')
else:
    print(f'  frontend/ DOES NOT EXIST')

print()
print('Root package.json:')
root_pkg = os.path.join(base, 'package.json')
if os.path.exists(root_pkg):
    print(f'  package.json exists')
    with open(root_pkg, 'r') as f:
        content = f.read()
        if 'scripts' in content:
            import re
            scripts = re.findall(r'"\w+":\s*"([^"]+)"', content)
            print(f'  Scripts found: {scripts}')
        else:
            print(f'  No scripts section')
else:
    print(f'  package.json DOES NOT EXIST')

print()
print('Frontend app directory:')
app_dir = os.path.join(frontend, 'app') if os.path.exists(frontend) else 'N/A'
print(f'  app/ exists: {os.path.exists(app_dir) if os.path.exists(frontend) else False}')

print()
print('Frontend styles directory:')
styles_dir = os.path.join(frontend, 'styles') if os.path.exists(frontend) else 'N/A'
print(f'  styles/ exists: {os.path.exists(styles_dir) if os.path.exists(frontend) else False}')

print()
print('Frontend components directory:')
components_dir = os.path.join(frontend, 'components') if os.path.exists(frontend) else 'N/A'
print(f'  components/ exists: {os.path.exists(components_dir) if os.path.exists(frontend) else False}')

print()
print('Frontend lib directory:')
lib_dir = os.path.join(frontend, 'lib') if os.path.exists(frontend) else 'N/A'
print(f'  lib/ exists: {os.path.exists(lib_dir) if os.path.exists(frontend) else False}')

print()
print('Frontend hooks directory:')
hooks_dir = os.path.join(frontend, 'hooks') if os.path.exists(frontend) else 'N/A'
print(f'  hooks/ exists: {os.path.exists(hooks_dir) if os.path.exists(frontend) else False}')

print()
print('Frontend store directory:')
store_dir = os.path.join(frontend, 'store') if os.path.exists(frontend) else 'N/A'
print(f'  store/ exists: {os.path.exists(store_dir) if os.path.exists(frontend) else False}')

print()
print('Backend directory:')
backend = os.path.join(base, 'backend')
if os.path.exists(backend):
    print(f'  backend/ exists')
    print(f'  main.py exists: {os.path.exists(os.path.join(backend, "main.py"))}')
    print(f'  api/ exists: {os.path.exists(os.path.join(backend, "api"))}')
else:
    print(f'  backend/ DOES NOT EXIST')

print()
print('Database directory:')
database = os.path.join(base, 'database')
if os.path.exists(database):
    print(f'  database/ exists')
    print(f'  Models.py exists: {os.path.exists(os.path.join(database, "Models.py"))}')
else:
    print(f'  database/ DOES NOT EXIST')