"""
Module C — hardcoded target-role skill maps.

Per the project docs: "you can hardcode skill maps for ~5-6 common roles
... or generate the target skill map via LLM call too." We hardcode the
6 documented roles for speed/determinism/judge-repeatability, and leave a
clean seam (`get_skill_map` raising InvalidTargetRoleError) for the stretch
goal of LLM-generated maps for custom roles later.

Each entry: skill name -> {category, importance}. `importance` drives the
gap-analysis priority score, not just a plain yes/no match.
"""
from app.schemas.common import ImportanceLevel, TargetRole

SkillMapEntry = dict[str, str]

SKILL_MAPS: dict[str, dict[str, SkillMapEntry]] = {
    TargetRole.BACKEND_DEVELOPER.value: {
        "python": {"category": "language", "importance": ImportanceLevel.CRITICAL},
        "sql": {"category": "database", "importance": ImportanceLevel.CRITICAL},
        "rest api design": {"category": "architecture", "importance": ImportanceLevel.CRITICAL},
        "postgresql": {"category": "database", "importance": ImportanceLevel.IMPORTANT},
        "docker": {"category": "devops", "importance": ImportanceLevel.IMPORTANT},
        "git": {"category": "tool", "importance": ImportanceLevel.CRITICAL},
        "authentication & authorization": {"category": "security", "importance": ImportanceLevel.IMPORTANT},
        "caching": {"category": "architecture", "importance": ImportanceLevel.NICE_TO_HAVE},
        "message queues": {"category": "architecture", "importance": ImportanceLevel.NICE_TO_HAVE},
        "unit testing": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "system design": {"category": "architecture", "importance": ImportanceLevel.IMPORTANT},
        "ci/cd": {"category": "devops", "importance": ImportanceLevel.NICE_TO_HAVE},
        "node.js": {"category": "framework", "importance": ImportanceLevel.NICE_TO_HAVE},
        "java": {"category": "language", "importance": ImportanceLevel.NICE_TO_HAVE},
    },
    TargetRole.FRONTEND_DEVELOPER.value: {
        "javascript": {"category": "language", "importance": ImportanceLevel.CRITICAL},
        "typescript": {"category": "language", "importance": ImportanceLevel.IMPORTANT},
        "react": {"category": "framework", "importance": ImportanceLevel.CRITICAL},
        "html": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "css": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "responsive design": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "state management": {"category": "architecture", "importance": ImportanceLevel.IMPORTANT},
        "accessibility": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "rest / api integration": {"category": "architecture", "importance": ImportanceLevel.IMPORTANT},
        "testing (jest/rtl)": {"category": "practice", "importance": ImportanceLevel.NICE_TO_HAVE},
        "build tools (vite/webpack)": {"category": "tool", "importance": ImportanceLevel.NICE_TO_HAVE},
        "git": {"category": "tool", "importance": ImportanceLevel.CRITICAL},
        "performance optimization": {"category": "practice", "importance": ImportanceLevel.NICE_TO_HAVE},
    },
    TargetRole.DATA_ANALYST.value: {
        "sql": {"category": "database", "importance": ImportanceLevel.CRITICAL},
        "excel": {"category": "tool", "importance": ImportanceLevel.IMPORTANT},
        "python": {"category": "language", "importance": ImportanceLevel.IMPORTANT},
        "pandas": {"category": "library", "importance": ImportanceLevel.CRITICAL},
        "data visualization": {"category": "practice", "importance": ImportanceLevel.CRITICAL},
        "statistics": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "power bi / tableau": {"category": "tool", "importance": ImportanceLevel.IMPORTANT},
        "data cleaning": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "a/b testing": {"category": "practice", "importance": ImportanceLevel.NICE_TO_HAVE},
        "storytelling with data": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "etl basics": {"category": "architecture", "importance": ImportanceLevel.NICE_TO_HAVE},
    },
    TargetRole.ML_ENGINEER.value: {
        "python": {"category": "language", "importance": ImportanceLevel.CRITICAL},
        "numpy": {"category": "library", "importance": ImportanceLevel.CRITICAL},
        "pandas": {"category": "library", "importance": ImportanceLevel.CRITICAL},
        "machine learning fundamentals": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "scikit-learn": {"category": "library", "importance": ImportanceLevel.IMPORTANT},
        "deep learning (pytorch/tensorflow)": {"category": "library", "importance": ImportanceLevel.IMPORTANT},
        "linear algebra & statistics": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "model evaluation": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "data preprocessing": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "sql": {"category": "database", "importance": ImportanceLevel.IMPORTANT},
        "mlops basics": {"category": "devops", "importance": ImportanceLevel.NICE_TO_HAVE},
        "experiment tracking": {"category": "practice", "importance": ImportanceLevel.NICE_TO_HAVE},
    },
    TargetRole.DEVOPS.value: {
        "linux": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "docker": {"category": "tool", "importance": ImportanceLevel.CRITICAL},
        "kubernetes": {"category": "tool", "importance": ImportanceLevel.IMPORTANT},
        "ci/cd pipelines": {"category": "practice", "importance": ImportanceLevel.CRITICAL},
        "cloud (aws/gcp/azure)": {"category": "platform", "importance": ImportanceLevel.CRITICAL},
        "infrastructure as code (terraform)": {"category": "tool", "importance": ImportanceLevel.IMPORTANT},
        "networking fundamentals": {"category": "fundamentals", "importance": ImportanceLevel.IMPORTANT},
        "monitoring & logging": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "scripting (bash/python)": {"category": "language", "importance": ImportanceLevel.CRITICAL},
        "git": {"category": "tool", "importance": ImportanceLevel.CRITICAL},
        "security basics": {"category": "security", "importance": ImportanceLevel.NICE_TO_HAVE},
    },
    TargetRole.CYBERSECURITY.value: {
        "networking fundamentals": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "linux": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "security principles (cia triad)": {"category": "fundamentals", "importance": ImportanceLevel.CRITICAL},
        "threat modeling": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "penetration testing basics": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "cryptography basics": {"category": "fundamentals", "importance": ImportanceLevel.IMPORTANT},
        "siem tools": {"category": "tool", "importance": ImportanceLevel.NICE_TO_HAVE},
        "incident response": {"category": "practice", "importance": ImportanceLevel.IMPORTANT},
        "scripting (python/bash)": {"category": "language", "importance": ImportanceLevel.IMPORTANT},
        "web app security (owasp top 10)": {"category": "practice", "importance": ImportanceLevel.CRITICAL},
        "compliance basics (gdpr/iso 27001)": {"category": "fundamentals", "importance": ImportanceLevel.NICE_TO_HAVE},
    },
}

# Common aliases so a user typing "JS" or "Postgres" still matches the map.
SKILL_ALIASES: dict[str, str] = {
    "js": "javascript",
    "ts": "typescript",
    "postgres": "postgresql",
    "psql": "postgresql",
    "k8s": "kubernetes",
    "reactjs": "react",
    "react.js": "react",
    "nodejs": "node.js",
    "node": "node.js",
    "ml": "machine learning fundamentals",
    "aws": "cloud (aws/gcp/azure)",
    "gcp": "cloud (aws/gcp/azure)",
    "azure": "cloud (aws/gcp/azure)",
    "tf": "terraform",
    "terraform": "infrastructure as code (terraform)",
    "pytorch": "deep learning (pytorch/tensorflow)",
    "tensorflow": "deep learning (pytorch/tensorflow)",
    "sklearn": "scikit-learn",
    "tableau": "power bi / tableau",
    "power bi": "power bi / tableau",
    "bash": "scripting (bash/python)",
    "shell scripting": "scripting (bash/python)",
    "owasp": "web app security (owasp top 10)",
}


def normalize_skill_name(name: str) -> str:
    key = name.strip().lower()
    return SKILL_ALIASES.get(key, key)


def get_skill_map(target_role: TargetRole) -> dict[str, SkillMapEntry]:
    from app.core.exceptions import InvalidTargetRoleError

    skill_map = SKILL_MAPS.get(target_role.value)
    if skill_map is None:
        raise InvalidTargetRoleError(
            f"'{target_role}' is not a supported target role.",
            detail={"supported_roles": list(SKILL_MAPS.keys())},
        )
    return skill_map
