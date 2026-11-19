#!/usr/bin/env python3
"""Test database connection and tables for Cartoon Studio AI."""
import sys
sys.path.insert(0, "d:\\Linux-Transfer\\Code\\Cartoon Studio AI")

from database.base import Base
from database.Models import *
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

print("=" * 60)
print("DATABASE TEST - Cartoon Studio AI")
print("=" * 60)

# Test 1: Create engine
print("\n1. Creating database engine...")
try:
    engine = create_engine('postgresql://postgres:postgres@localhost:5432/cartoon_studio')
    print("   ✅ Engine created successfully")
except Exception as e:
    print(f"   ❌ Engine creation failed: {e}")
    print("   💡 Make sure PostgreSQL is running and accessible")
    sys.exit(1)

# Test 2: Create all tables
print("\n2. Creating database tables...")
try:
    Base.metadata.create_all(engine)
    print("   ✅ Tables created successfully!")
    print("   Tables: Project, Episode, Scene, Character, Background, Voice, Asset, Render, Script, PipelineStep, PipelineJob")
except Exception as e:
    print(f"   ❌ Table creation failed: {e}")
    sys.exit(1)

# Test 3: Create session
print("\n3. Creating database session...")
try:
    Session = sessionmaker(bind=engine)
    session = Session()
    print("   ✅ Session created successfully")
except Exception as e:
    print(f"   ❌ Session creation failed: {e}")
    sys.exit(1)

# Test 4: Create a project and verify
print("\n4. Testing CRUD operations...")
try:
    from database.Models import Project
    project = Project(name="Test Project", description="Test description")
    session.add(project)
    session.commit()
    print(f"   ✅ Created project: {project.name} (ID: {project.id})")
except Exception as e:
    print(f"   ❌ CRUD operation failed: {e}")
    session.rollback()
    sys.exit(1)

# Test 5: Query projects
print("\n5. Querying projects...")
try:
    projects = session.query(Project).all()
    print(f"   ✅ Found {len(projects)} project(s) in database")
    for p in projects:
        print(f"      - {p.name} (ID: {p.id})")
except Exception as e:
    print(f"   ❌ Query failed: {e}")
    sys.exit(1)

# Test 6: Create an episode
print("\n6. Testing Episode creation...")
try:
    from database.Models import Episode
    episode = Episode(project_id=project.id, title="Test Episode", script="test script")
    session.add(episode)
    session.commit()
    print(f"   ✅ Created episode: {episode.title} (ID: {episode.id})")
except Exception as e:
    print(f"   ❌ Episode creation failed: {e}")
    session.rollback()
    sys.exit(1)

# Test 7: Query episodes
print("\n7. Querying episodes...")
try:
    episodes = session.query(Episode).all()
    print(f"   ✅ Found {len(episodes)} episode(s) in database")
except Exception as e:
    print(f"   ❌ Query failed: {e}")
    sys.exit(1)

# Test 8: Close session
print("\n8. Closing session...")
try:
    session.close()
    print("   ✅ Session closed successfully")
except Exception as e:
    print(f"   ❌ Session close failed: {e}")

print("\n" + "=" * 60)
print("🎉 ALL DATABASE TESTS PASSED!")
print("=" * 60)
print("\nYour Cartoon Studio AI database is working correctly!")
print("\nTables created:")
for table in Base.metadata.sorted_tables:
    print(f"  - {table.name}")
print("\nRun 'npm start' to start frontend + backend!")