import logging
from typing import List
from sqlalchemy.orm import Session
from backend.models import User, SkillGap, Roadmap, RoadmapItem

logger = logging.getLogger(__name__)

def generate_roadmap_for_user(user: User, db: Session) -> Roadmap:
    """
    Generates a multi-phase personalized roadmap from user skill gaps
    and persists Roadmap + RoadmapItem records into Neon PostgreSQL database.
    """
    gaps = db.query(SkillGap).filter(SkillGap.user_id == user.id, SkillGap.status == "gap").all()
    gap_names = [g.skill_name for g in gaps] if gaps else ["System Architecture", "Redis & Caching", "Docker & Kubernetes"]

    # Clear existing roadmap items and roadmap for user if present
    db.query(RoadmapItem).filter(RoadmapItem.user_id == user.id).delete()
    db.query(Roadmap).filter(Roadmap.user_id == user.id).delete()
    db.commit()

    roadmap = Roadmap(
        user_id=user.id,
        target_role=user.target_role,
        title=f"Personalized {user.target_role} Skill Route Map"
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    phases_template = [
        {
            "phase": "PHASE 01: Core Foundations & Caching",
            "phase_number": 1,
            "items": [
                {
                    "title": "Master Redis Data Structures & Caching Patterns",
                    "description": "Implement sliding window rate limiters and cache invalidation strategies.",
                    "resource_url": "https://redis.io/docs/manual/patterns/",
                    "gap_skill_tag": gap_names[0] if len(gap_names) > 0 else "Redis & Caching"
                },
                {
                    "title": "Database Query Profiling & Connection Management",
                    "description": "Analyze query execution plans, indexes, and connection pool behavior.",
                    "resource_url": "https://www.postgresql.org/docs/current/using-explain.html",
                    "gap_skill_tag": gap_names[1] if len(gap_names) > 1 else "SQL & Database Design"
                }
            ]
        },
        {
            "phase": "PHASE 02: System Architecture & Distributed Systems",
            "phase_number": 2,
            "items": [
                {
                    "title": "Event-Driven Microservices with Kafka",
                    "description": "Build high-throughput event buses with topic partitioning and rebalancing.",
                    "resource_url": "https://kafka.apache.org/documentation/",
                    "gap_skill_tag": gap_names[2] if len(gap_names) > 2 else "Message Queues"
                },
                {
                    "title": "High Availability & Load Balancing Architecture",
                    "description": "Design resilient multi-node deployments with health checks and circuit breakers.",
                    "resource_url": "https://microservices.io/patterns/index.html",
                    "gap_skill_tag": "System Architecture"
                }
            ]
        },
        {
            "phase": "PHASE 03: Cloud Containerization & Interview Prep",
            "phase_number": 3,
            "items": [
                {
                    "title": "Docker Multi-Stage Builds & Kubernetes Orchestration",
                    "description": "Containerize microservices with optimized layers and deployment manifests.",
                    "resource_url": "https://kubernetes.io/docs/tutorials/",
                    "gap_skill_tag": "Docker & Kubernetes"
                }
            ]
        }
    ]

    for phase_info in phases_template:
        for item_data in phase_info["items"]:
            item = RoadmapItem(
                roadmap_id=roadmap.id,
                user_id=user.id,
                phase=phase_info["phase"],
                phase_number=phase_info["phase_number"],
                title=item_data["title"],
                description=item_data["description"],
                resource_url=item_data["resource_url"],
                gap_skill_tag=item_data["gap_skill_tag"],
                status="not_started"
            )
            db.add(item)

    db.commit()
    db.refresh(roadmap)
    return roadmap
