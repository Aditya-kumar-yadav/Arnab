import os
import sys

# Ensure backend directory is in Python path and is the active working directory
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.chdir(backend_dir)

from seed import seed_database

if __name__ == "__main__":
    seed_database()
