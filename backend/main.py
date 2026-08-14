"""
Deployment entrypoint shim.

The real, single-source-of-truth FastAPI app lives in `app/main.py`
(package `app`, imported everywhere as `from app.xxx import yyy`). This
top-level `main.py` exists only so `uvicorn main:app` — what the
Dockerfile's CMD and some deploy configs expect — keeps working without
every one of them having to be changed to `uvicorn app.main:app`.

Do not add routes, models, config, or business logic here. Everything
lives under `app/`. This file was previously a large, independently
merged copy of the app (duplicate FastAPI instances, a second disconnected
SQLAlchemy `Base`, a hardcoded mock API) left over from the team merge —
that version could not start in any run context and has been replaced
with this shim. `models.py`, `config.py`, `database.py`, `auth/`,
`routers/`, and the top-level `services/*.py` next to this file are now
dead code superseded by their `app/` equivalents and are safe to delete.
"""
from app.main import app  # noqa: F401
