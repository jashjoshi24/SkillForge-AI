import logging
import sys

from app.config import get_settings


def configure_logging() -> None:
    settings = get_settings()
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    root = logging.getLogger()
    root.setLevel(level)

    # Avoid duplicate handlers on reload
    if root.handlers:
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
    )
    root.addHandler(handler)

    # Never log secrets: silence noisy libs that sometimes echo connection info
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
