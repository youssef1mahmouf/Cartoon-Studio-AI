#!/usr/bin/env python3
import os

base = r'd:\Linux-Transfer\Code\Cartoon Studio AI'

print('=== COMPLETE PROJECT STRUCTURE AUDIT ===')
print()

# Top-level items
print('TOP-LEVEL DIRECTORIES AND FILES:')
print('-' * 60)
for item in sorted(os.listdir(base)):
    full = os.path.join(base, item)
    isdir = os.path.isdir(full)
    if isdir:
        print(f'  [DIR]  {item}/')
    else:
        size = os.path.getsize(full)
        print(f'  [FILE] {item} ({size} bytes)')

print()
print('FRONTEND DETAILS:')
frontend = os.path.join(base, 'frontend')
if os.path.exists(frontend):
    print(f'  frontend/ EXISTS')
    print(f'  Contents: {os.listdir(frontend)}')
    # Check for package.json
    pkg = os.path.exists(os.path.join(frontend, 'package.json'))
    print(f'  package.json: {pkg}')
    # Check for next.config.js
    nc = os.path.exists(os.path.join(frontend, 'next.config.js'))
    print(f'  next.config.js: {nc}')
    # Check for app directory
    app = os.path.exists(os.path.join(frontend, 'app'))
    print(f'  app/: {app}')
else:
    print('  frontend/ DOES NOT EXIST')

print()
print('ROOT DIRECTORY:')
root_pkg = os.path.exists(os.path.join(base, 'package.json'))
print(f'  root package.json: {pkg if "pkg" in dir() else os.path.exists(os.path.join(base, "package.json"))}')

# Check what's in root package.json
if os.path.exists(os.path.join(base, 'package.json')):
    with open(os.path.join(base, 'package.json'), 'r') as f:
        content = f.read()
    print(f'  root package.json contents:')
    # Check for React dependencies
    deps = ['react', 'next', 'typescript']
    for d in deps:
        print(f'  Contains {d}: {d in content.lower()}')

print()
print('BACKEND DETAILS:')
backend = os.path.join(base, 'backend')
if os.path.exists(backend):
    print(f'  backend/ EXISTS')
    print(f'  main.py: {os.path.exists(os.path.join(backend, "main.py"))}')
    print(f'  api/: {os.path.exists(os.path.join(backend, "api"))}')
    print(f'  core/: {os.path.exists(os.path.join(backend, "core"))}')
else:
    print('  backend/ DOES NOT EXIST')

print()
print('ROOT FOLDER SHOULD CONTAIN:')
print('  - backend/')
print('  - frontend/')
print('  - docs/')
print('  - assets/')
print('  - storage/')
print('  - exports/')
print('  - package.json (orchestration only)')

print()
print('INCORRECT FILES TO REMOVE (frontend files from root):')
print('  - node_modules/')
print('  - package-lock.json')
print('  - package.json (root, if it has React/Next deps)')
print('  - app/ (if frontend)')
print('  - components/ (if frontend)')
print('  - hooks/ (if frontend)')
print('  - lib/ (if frontend)')
print('  - store/ (if frontend)')
print('  - styles/ (if frontend)')