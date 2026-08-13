from enum import Enum


class TargetRole(str, Enum):
    BACKEND_DEVELOPER = "backend_developer"
    FRONTEND_DEVELOPER = "frontend_developer"
    DATA_ANALYST = "data_analyst"
    ML_ENGINEER = "ml_engineer"
    DEVOPS = "devops"
    CYBERSECURITY = "cybersecurity"


TARGET_ROLE_LABELS: dict[str, str] = {
    TargetRole.BACKEND_DEVELOPER.value: "Backend Developer",
    TargetRole.FRONTEND_DEVELOPER.value: "Frontend Developer",
    TargetRole.DATA_ANALYST.value: "Data Analyst",
    TargetRole.ML_ENGINEER.value: "ML Engineer",
    TargetRole.DEVOPS.value: "DevOps Engineer",
    TargetRole.CYBERSECURITY.value: "Cybersecurity Analyst",
}


class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ImportanceLevel(str, Enum):
    CRITICAL = "critical"
    IMPORTANT = "important"
    NICE_TO_HAVE = "nice_to_have"


class ItemStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    DONE = "done"
