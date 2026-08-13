import json
import logging
from typing import List
from sqlalchemy.orm import Session
from backend.models import User, SkillGap, Recommendation
from backend.data.certifications import get_certifications_by_domain

logger = logging.getLogger(__name__)

# Template generator for high-quality fallback project ideas
PROJECT_TEMPLATES = {
    "backend": [
        {
            "title": "High-Throughput Rate Limiter & Token Bucket Service",
            "description": "Design and implement a distributed rate-limiting microservice using Redis and FastAPI. Benchmark latency under heavy concurrency.",
            "difficulty": "Intermediate",
            "skill_tag": "Redis & Caching",
            "tech_stack": ["Python", "FastAPI", "Redis", "Locust"],
            "deliverables": ["Token bucket algorithm", "Sliding window log", "Docker container"]
        },
        {
            "title": "Real-Time Distributed Messaging Bus with Kafka",
            "description": "Build an event-driven message queue processor handling log aggregation and metric broadcasting across microservices.",
            "difficulty": "Advanced",
            "skill_tag": "System Architecture",
            "tech_stack": ["Apache Kafka", "Go", "Docker", "Prometheus"],
            "deliverables": ["Producer/Consumer pipeline", "Partition rebalancing", "Monitoring dashboard"]
        },
        {
            "title": "Database Query Optimizer & Connection Pooler",
            "description": "Implement a custom connection pool manager for PostgreSQL with automatic query execution analysis and indexing suggestions.",
            "difficulty": "Intermediate",
            "skill_tag": "SQL Optimization",
            "tech_stack": ["PostgreSQL", "Python", "SQLAlchemy", "pg_stat_statements"],
            "deliverables": ["Connection pooling", "Query analyzer script", "Benchmark results"]
        }
    ],
    "frontend": [
        {
            "title": "Interactive Blueprint Terrain Cartography Canvas",
            "description": "Develop a customizable elevation contour map with HTML5 Canvas and dynamic WebGL shaders for visualizing complex data.",
            "difficulty": "Advanced",
            "skill_tag": "Canvas & WebGL",
            "tech_stack": ["React", "TypeScript", "Three.js", "TailwindCSS"],
            "deliverables": ["Custom shader material", "Pan/Zoom controls", "Data visualizer"]
        },
        {
            "title": "Real-time Collaborative Whiteboard with WebSockets",
            "description": "Build a multi-user digital canvas supporting concurrent drawing, cursor tracking, and state synchronization.",
            "difficulty": "Intermediate",
            "skill_tag": "WebSockets & State",
            "tech_stack": ["React", "Socket.io", "Zustand", "TailwindCSS"],
            "deliverables": ["Operational transformation sync", "Undo/Redo stack", "Room system"]
        }
    ],
    "data": [
        {
            "title": "Automated ETL Pipeline & Analytics Data Warehouse",
            "description": "Construct an end-to-end data pipeline harvesting web analytics logs, transforming schema, and populating a BigQuery warehouse.",
            "difficulty": "Intermediate",
            "skill_tag": "Data Pipelines",
            "tech_stack": ["Apache Airflow", "Python", "Pandas", "DuckDB"],
            "deliverables": ["DAG workflows", "Data quality validator", "Dashboard integration"]
        },
        {
            "title": "Customer Churn Prediction Model with MLflow Tracking",
            "description": "Build, evaluate, and deploy a machine learning classification pipeline with automated model tracking and API inference.",
            "difficulty": "Advanced",
            "skill_tag": "Machine Learning",
            "tech_stack": ["Scikit-learn", "XGBoost", "MLflow", "FastAPI"],
            "deliverables": ["Feature engineering pipeline", "Model metrics dashboard", "REST API"]
        }
    ]
}

INTERVIEW_Q_TEMPLATES = [
    {
        "title": "Explain how the Redis Token Bucket algorithm works under race conditions.",
        "description": "System Design & Concurrency question focusing on atomic execution using Lua scripts.",
        "difficulty": "Intermediate",
        "skill_tag": "Redis & Caching",
        "question": "How do you guarantee thread safety and prevent race conditions when updating token buckets in Redis across 10 concurrent application instances?",
        "sample_answer": "Use Redis EVAL to execute Lua scripts atomically on the server side, ensuring GET and SET operations occur within a single single-threaded Redis transaction context.",
        "key_concepts": ["Lua Scripting", "Atomicity", "Concurrency", "Sliding Window"]
    },
    {
        "title": "Compare B-Tree vs LSM-Tree storage engines in modern databases.",
        "description": "Database Internals question evaluating trade-offs between read-heavy vs write-heavy workloads.",
        "difficulty": "Advanced",
        "skill_tag": "Database Internals",
        "question": "When would you prefer an LSM-Tree based database (like Cassandra or RocksDB) over a traditional B-Tree database (like PostgreSQL)?",
        "sample_answer": "LSM-Trees append sequential writes to a MemTable and SSTables, making them optimal for write-intensive workloads. B-Trees provide faster random point reads but require in-place page updates causing write amplification.",
        "key_concepts": ["Write Amplification", "SSTable", "MemTable", "Index Structures"]
    },
    {
        "title": "How do WebSockets differ from HTTP/2 Server-Sent Events (SSE)?",
        "description": "Networking & Protocols question targeting real-time data streaming architectures.",
        "difficulty": "Intermediate",
        "skill_tag": "Networking Protocols",
        "question": "What are the key architectural differences between WebSockets and SSE, and when should you choose SSE?",
        "sample_answer": "WebSockets provide full-duplex bidirectional TCP communication, whereas SSE is unidirectional (server to client) over standard HTTP. SSE is ideal for simple live streaming updates (e.g. stock tickers or LLM output streaming) because it natively supports re-connection and works over standard HTTP/2 without custom firewall configuration.",
        "key_concepts": ["Full Duplex", "HTTP/2", "Server-Sent Events", "TCP Overhead"]
    }
]

def generate_recommendations_for_user(user: User, db: Session) -> List[Recommendation]:
    """
    Generates personalized project ideas and interview questions matched to the user's
    target role and current skill gaps.
    """
    gaps = db.query(SkillGap).filter(SkillGap.user_id == user.id, SkillGap.status == "gap").all()
    gap_names = [g.skill_name for g in gaps] if gaps else ["System Architecture", "Redis & Caching", "Database Optimization"]

    new_recommendations = []

    # 1. Generate Projects
    role_key = "backend"
    if "frontend" in user.target_role.lower():
        role_key = "frontend"
    elif "data" in user.target_role.lower() or "ml" in user.target_role.lower():
        role_key = "data"

    templates = PROJECT_TEMPLATES.get(role_key, PROJECT_TEMPLATES["backend"])
    
    for idx, tmpl in enumerate(templates):
        # Match skill tag to user's actual gaps if available
        matched_tag = gap_names[idx % len(gap_names)]
        rec = Recommendation(
            user_id=user.id,
            type="project",
            title=tmpl["title"],
            description=tmpl["description"],
            difficulty=tmpl["difficulty"],
            skill_tag=matched_tag,
            status="saved",
            extra_data={
                "tech_stack": tmpl["tech_stack"],
                "deliverables": tmpl["deliverables"],
                "target_role": user.target_role,
                "why_recommended": f"Tied directly to closing your skill gap in '{matched_tag}' for {user.target_role}."
            }
        )
        db.add(rec)
        new_recommendations.append(rec)

    # 2. Generate Interview Questions
    for idx, q_tmpl in enumerate(INTERVIEW_Q_TEMPLATES):
        matched_tag = gap_names[(idx + 1) % len(gap_names)]
        rec = Recommendation(
            user_id=user.id,
            type="interview_question",
            title=q_tmpl["title"],
            description=q_tmpl["description"],
            difficulty=q_tmpl["difficulty"],
            skill_tag=matched_tag,
            status="saved",
            extra_data={
                "question": q_tmpl["question"],
                "sample_answer": q_tmpl["sample_answer"],
                "key_concepts": q_tmpl["key_concepts"],
                "why_recommended": f"Essential technical interview question for candidates pursuing {user.target_role}."
            }
        )
        db.add(rec)
        new_recommendations.append(rec)

    # 3. Add Top Certification Recommendation
    certs = get_certifications_by_domain(user.target_role)
    if certs:
        top_cert = certs[0]
        rec = Recommendation(
            user_id=user.id,
            type="certification",
            title=top_cert["title"],
            description=top_cert["description"],
            difficulty=top_cert["difficulty"],
            skill_tag=top_cert["skill_tag"],
            status="saved",
            extra_data={
                "provider": top_cert["provider"],
                "cost": top_cert["cost"],
                "url": top_cert["url"],
                "estimated_duration": top_cert["estimated_duration"],
                "why_recommended": f"Industry-recognized credential for {user.target_role}."
            }
        )
        db.add(rec)
        new_recommendations.append(rec)

    db.commit()
    for r in new_recommendations:
        db.refresh(r)

    return new_recommendations
