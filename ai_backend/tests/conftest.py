"""
Pytest configuration and pythonpath fixture setup.
"""

import sys
from pathlib import Path

# Add ai_backend root directory to Python path
ai_backend_root = Path(__file__).resolve().parents[1]
if str(ai_backend_root) not in sys.path:
    sys.path.insert(0, str(ai_backend_root))
