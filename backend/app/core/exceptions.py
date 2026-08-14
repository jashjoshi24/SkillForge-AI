"""
Application-level exceptions and their FastAPI handlers.

Every error surfaced to the frontend follows one structured shape:

    {"error": {"code": "SOME_CODE", "message": "human readable", "detail": {...}}}

so the UI can render consistent, non-generic error states.

Note: the exception *classes* below intentionally have zero dependency on
FastAPI (plain int status codes, not `fastapi.status`), so every
service/business-logic module can raise them without requiring FastAPI to
be installed — only `register_exception_handlers`, which wires them into
the actual app, imports FastAPI, and it does so lazily inside the
function. This keeps the extraction/gap-analysis/roadmap services unit
testable in any minimal Python environment.
"""
import logging

logger = logging.getLogger("skillforge.errors")


class SkillForgeError(Exception):
    """Base class for all application errors."""

    status_code = 500
    code = "INTERNAL_ERROR"

    def __init__(self, message: str, detail: dict | None = None):
        self.message = message
        self.detail = detail or {}
        super().__init__(message)


class ConfigurationError(SkillForgeError):
    status_code = 503
    code = "CONFIGURATION_ERROR"


class FileValidationError(SkillForgeError):
    status_code = 400
    code = "FILE_VALIDATION_ERROR"


class ExtractionError(SkillForgeError):
    """Resume text extraction or LLM structured-extraction failed."""

    status_code = 422
    code = "EXTRACTION_ERROR"


class LLMError(SkillForgeError):
    """Upstream LLM call failed or returned something we can't use."""

    status_code = 502
    code = "LLM_ERROR"


class NotFoundError(SkillForgeError):
    status_code = 404
    code = "NOT_FOUND"


class InvalidTargetRoleError(SkillForgeError):
    status_code = 400
    code = "INVALID_TARGET_ROLE"


class AuthError(SkillForgeError):
    """Missing, invalid, or expired authentication credentials."""

    status_code = 401
    code = "AUTH_ERROR"


class ConflictError(SkillForgeError):
    """The request conflicts with existing state (e.g. duplicate email)."""

    status_code = 409
    code = "CONFLICT"


def register_exception_handlers(app) -> None:
    """`app` is a `fastapi.FastAPI` instance. Imported lazily (see module docstring)."""
    from fastapi import Request
    from fastapi.responses import JSONResponse

    @app.exception_handler(SkillForgeError)
    async def handle_skillforge_error(request: Request, exc: SkillForgeError):
        logger.warning("%s: %s (path=%s)", exc.code, exc.message, request.url.path)
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": exc.code, "message": exc.message, "detail": exc.detail}},
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s", request.url.path)
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "Something went wrong processing your request. Please try again; "
                    "if it keeps happening, the server logs have the details.",
                    "detail": {},
                }
            },
        )
