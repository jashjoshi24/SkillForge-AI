import logging
from backend.database import SessionLocal, engine, Base
from backend.models import User, SkillProfile, SkillGap, Roadmap, RoadmapItem, Recommendation, ProgressLog
from backend.auth.security import get_password_hash
from backend.services.recommendations_service import generate_recommendations_for_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if test user exists
        user = db.query(User).filter(User.email == "alex@skillforge.ai").first()
        if not user:
            logger.info("Creating demo user alex@skillforge.ai...")
            user = User(
                email="alex@skillforge.ai",
                password_hash=get_password_hash("password123"),
                name="Alex Mercer",
                target_role="Backend Developer",
                education_level="B.Tech Computer Science (3rd Year)",
                interests=["Distributed Systems", "Cloud Native", "Database Optimization"],
                goals=["Land a Backend Software Engineering Role at a High-Growth Tech Company"]
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # 1. Add Skill Profile
            profile = SkillProfile(
                user_id=user.id,
                skills=["Python", "FastAPI", "SQL / PostgreSQL", "Git & GitHub", "REST APIs"],
                projects=[
                    {"name": "Taskflow API", "description": "Asynchronous REST API built with FastAPI and PostgreSQL."}
                ],
                experience=[
                    {"role": "Software Engineering Intern", "company": "TechLab", "duration": "3 months"}
                ],
                education=[
                    {"degree": "B.Tech Computer Science", "institution": "State Tech University"}
                ]
            )
            db.add(profile)

            # 2. Add Skill Gaps
            gaps = [
                SkillGap(user_id=user.id, skill_name="Redis & Caching", category="Backend", user_proficiency=0.2, required_proficiency=0.8, priority_score="High", status="gap"),
                SkillGap(user_id=user.id, skill_name="System Architecture", category="System Design", user_proficiency=0.3, required_proficiency=0.85, priority_score="High", status="gap"),
                SkillGap(user_id=user.id, skill_name="Docker & Kubernetes", category="DevOps", user_proficiency=0.4, required_proficiency=0.8, priority_score="Medium", status="gap"),
                SkillGap(user_id=user.id, skill_name="Message Queues (Kafka/RabbitMQ)", category="Distributed Systems", user_proficiency=0.1, required_proficiency=0.75, priority_score="High", status="gap")
            ]
            db.add_all(gaps)
            db.commit()

            # 3. Add Sample Roadmap & Roadmap Items
            roadmap = Roadmap(
                user_id=user.id,
                target_role="Backend Developer",
                title="Personalized Backend Architect Roadmap"
            )
            db.add(roadmap)
            db.commit()
            db.refresh(roadmap)

            roadmap_items = [
                RoadmapItem(
                    roadmap_id=roadmap.id,
                    user_id=user.id,
                    phase="PHASE 01: Advanced Backend & Caching",
                    phase_number=1,
                    title="Master Redis Data Structures & Token Bucket Rate Limiting",
                    description="Learn Redis strings, hashes, sorted sets, and implement sliding window rate limiting.",
                    resource_url="https://redis.io/docs/manual/patterns/",
                    gap_skill_tag="Redis & Caching",
                    status="in_progress"
                ),
                RoadmapItem(
                    roadmap_id=roadmap.id,
                    user_id=user.id,
                    phase="PHASE 01: Advanced Backend & Caching",
                    phase_number=1,
                    title="PostgreSQL Indexing & Execution Plan Analysis",
                    description="Study EXPLAIN ANALYZE, B-Tree vs Hash indexes, and connection pooling with PgBouncer.",
                    resource_url="https://www.postgresql.org/docs/current/using-explain.html",
                    gap_skill_tag="System Architecture",
                    status="completed"
                ),
                RoadmapItem(
                    roadmap_id=roadmap.id,
                    user_id=user.id,
                    phase="PHASE 02: Microservices & Event Streaming",
                    phase_number=2,
                    title="Event-Driven Architecture with Apache Kafka",
                    description="Understand topic partitioning, consumer group rebalancing, and event sourcing patterns.",
                    resource_url="https://kafka.apache.org/documentation/",
                    gap_skill_tag="Message Queues (Kafka/RabbitMQ)",
                    status="not_started"
                ),
                RoadmapItem(
                    roadmap_id=roadmap.id,
                    user_id=user.id,
                    phase="PHASE 03: Containerization & Cloud Deployments",
                    phase_number=3,
                    title="Dockerizing Microservices & Multi-Stage Builds",
                    description="Write production-grade Dockerfiles with multi-stage builds and compose configurations.",
                    resource_url="https://docs.docker.com/develop/develop-images/multistage-build/",
                    gap_skill_tag="Docker & Kubernetes",
                    status="not_started"
                )
            ]
            db.add_all(roadmap_items)
            db.commit()

            # 4. Generate Initial Recommendations
            recs = generate_recommendations_for_user(user, db)

            # 5. Add Progress Logs
            logs = [
                ProgressLog(user_id=user.id, item_id=roadmap_items[1].id, item_type="roadmap_item", action="status_change", previous_status="in_progress", new_status="completed"),
                ProgressLog(user_id=user.id, item_id=roadmap_items[0].id, item_type="roadmap_item", action="status_change", previous_status="not_started", new_status="in_progress")
            ]
            db.add_all(logs)
            db.commit()

            logger.info("Successfully seeded database with demo user and sample roadmap/recommendations!")

        else:
            logger.info("Demo user alex@skillforge.ai already exists.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
