import os
import sys

# Add the project root to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.ai_service import analyze_ticket
print(
    analyze_ticket(
        "trying to contact the customer care but they hardly pick up the call"
    )
)