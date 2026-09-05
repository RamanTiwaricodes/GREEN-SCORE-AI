import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# Check if running in Firebase Cloud Functions environment
try:
    from firebase_functions import https_fn
    from firebase_admin import initialize_app

    try:
        initialize_app()
    except Exception:
        pass

    # Expose Firebase Cloud Function HTTP handler
    @https_fn.on_request(cors=True)
    def api(req: https_fn.Request) -> https_fn.Response:
        return https_fn.Response.from_app(app, req)
except ImportError:
    # Graceful local fallback when running without firebase-functions package
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
