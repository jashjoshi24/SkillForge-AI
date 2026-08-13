"""
AI Service layer — clean architecture for LLM calls:

    Prompt -> LLMProvider.generate_json() -> raw text -> JSON parse ->
    (caller does Pydantic validation) -> application logic

Never called from the frontend. Every route that needs an LLM goes through
one of the `services/*_service.py` modules, which call this client.
"""
import abc
import json
import logging
import re
import time

from app.config import get_settings
from app.core.exceptions import LLMError

logger = logging.getLogger("skillforge.llm")

_JSON_BLOCK_RE = re.compile(r"\{.*\}", re.DOTALL)


class LLMProvider(abc.ABC):
    @abc.abstractmethod
    def generate_json(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        """Return raw text expected to be (or contain) a JSON object."""
        raise NotImplementedError


class AnthropicProvider(LLMProvider):
    def __init__(self, api_key: str, model: str):
        if not api_key:
            raise LLMError(
                "AI_API_KEY is not configured. Set it in backend/.env to enable resume extraction "
                "and roadmap generation (see .env.example)."
            )
        # Imported lazily so the module can be imported (e.g. for tests that
        # only exercise validation logic) without the `anthropic` package
        # needing a real key present.
        import anthropic

        self._client = anthropic.Anthropic(api_key=api_key)
        self._model = model

    def generate_json(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        last_exc: Exception | None = None
        for attempt in range(3):
            try:
                response = self._client.messages.create(
                    model=self._model,
                    max_tokens=max_tokens,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_prompt}],
                )
                text_parts = [
                    block.text for block in response.content if getattr(block, "type", None) == "text"
                ]
                return "".join(text_parts)
            except Exception as exc:  # noqa: BLE001 - normalize every provider error to LLMError
                last_exc = exc
                logger.warning("Anthropic API call failed (attempt %d/3): %s", attempt + 1, exc)
                if attempt < 2:
                    time.sleep(2**attempt)  # simple exponential backoff: 1s, 2s
        logger.error("Anthropic API call failed after 3 attempts: %s", last_exc)
        raise LLMError(f"The AI provider request failed after retries: {last_exc}") from last_exc


class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str, model: str):
        if not api_key:
            raise LLMError(
                "AI_API_KEY is not configured. Set it in backend/.env to enable resume extraction "
                "and roadmap generation (see .env.example)."
            )
        # Imported lazily so the module can be imported (e.g. for tests that
        # only exercise validation logic) without the `google-genai` package
        # needing a real key present.
        from google import genai
        from google.genai import types as genai_types

        self._client = genai.Client(api_key=api_key)
        self._types = genai_types
        self._model = model

    def generate_json(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        last_exc: Exception | None = None
        for attempt in range(3):
            try:
                response = self._client.models.generate_content(
                    model=self._model,
                    contents=user_prompt,
                    config=self._types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        response_mime_type="application/json",
                        max_output_tokens=max_tokens,
                    ),
                )
                return response.text or ""
            except Exception as exc:  # noqa: BLE001 - normalize every provider error to LLMError
                last_exc = exc
                logger.warning("Gemini API call failed (attempt %d/3): %s", attempt + 1, exc)
                if attempt < 2:
                    time.sleep(2**attempt)  # simple exponential backoff: 1s, 2s
        logger.error("Gemini API call failed after 3 attempts: %s", last_exc)
        raise LLMError(f"The AI provider request failed after retries: {last_exc}") from last_exc


def get_llm_provider() -> LLMProvider:
    settings = get_settings()
    if settings.AI_PROVIDER == "anthropic":
        return AnthropicProvider(api_key=settings.AI_API_KEY, model=settings.AI_MODEL)
    if settings.AI_PROVIDER == "gemini":
        return GeminiProvider(api_key=settings.AI_API_KEY, model=settings.AI_MODEL)
    raise LLMError(
        f"Unsupported AI_PROVIDER '{settings.AI_PROVIDER}'. Supported values: 'anthropic', 'gemini'."
    )


def extract_json_object(raw_text: str) -> dict:
    """
    Defensively parse a JSON object out of raw LLM text. Handles the common
    failure modes: markdown code fences, leading/trailing prose, or a bare
    JSON object with no wrapping.
    """
    text = raw_text.strip()
    # Strip ```json ... ``` or ``` ... ``` fences if present.
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
        text = re.sub(r"```$", "", text.strip())
        text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = _JSON_BLOCK_RE.search(text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    raise LLMError("The AI response was not valid JSON and could not be repaired.", detail={"raw_response": raw_text[:2000]})
