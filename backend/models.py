import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from backend.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    target_role = Column(String, default="Backend Developer")
    education_level = Column(String, default="Bachelor's Student")
    interests = Column(JSON, default=list)  # e.g. ["Distributed Systems", "Cloud Computing"]
    goals = Column(JSON, default=list)      # e.g. ["Land a senior backend engineering role"]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    skill_profile = relationship("SkillProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    roadmap_items = relationship("RoadmapItem", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")
    progress_logs = relationship("ProgressLog", back_populates="user", cascade="all, delete-orphan")
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    target_role = Column(String, default="Backend Developer")
    education_level = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profiles = relationship("SkillProfile", back_populates="user")
    roadmaps = relationship("Roadmap", back_populates="user")
    progress_records = relationship("Progress", back_populates="user")

class SkillProfile(Base):
    __tablename__ = "skill_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    skills = Column(JSON, default=list)       # List of extracted/confirmed skills
    projects = Column(JSON, default=list)     # List of extracted projects
    experience = Column(JSON, default=list)   # List of work experiences
    education = Column(JSON, default=list)    # List of education entries
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="skill_profile")

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    category = Column(String, default="Core")
    user_proficiency = Column(Float, default=0.0)      # 0.0 to 1.0 scale
    required_proficiency = Column(Float, default=0.8)  # 0.0 to 1.0 scale
    priority_score = Column(String, default="High")   # High, Medium, Low
    status = Column(String, default="gap")              # gap, in_progress, closed

    user = relationship("User", back_populates="skill_gaps")
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    skills = Column(JSON, nullable=False)  # [{ id, name, proficiency, category, score }]
    experience = Column(JSON, nullable=True)
    projects = Column(JSON, nullable=True)
    education = Column(JSON, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profiles")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, nullable=False)
    title = Column(String, default="Personalized Career Roadmap")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    raw_json = Column(JSON, default=dict)

    user = relationship("User", back_populates="roadmaps")
    items = relationship("RoadmapItem", back_populates="roadmap", cascade="all, delete-orphan")

class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    phase = Column(String, nullable=False)           # e.g. "PHASE 01: Foundations"
    phase_number = Column(Integer, default=1)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    resource_url = Column(String, nullable=True)
    gap_skill_tag = Column(String, nullable=True)     # Associated skill gap
    status = Column(String, default="not_started")   # not_started, in_progress, completed
    completed_at = Column(DateTime, nullable=True)

    roadmap = relationship("Roadmap", back_populates="items")
    user = relationship("User", back_populates="roadmap_items")
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, nullable=False)
    phases = Column(JSON, nullable=False)  # Multi-phase roadmap array
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)              # project, certification, interview_question
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, default="Intermediate") # Beginner, Intermediate, Advanced
    skill_tag = Column(String, nullable=False)         # Skill gap this addresses
    status = Column(String, default="saved")            # saved, in_progress, completed, ignored
    extra_data = Column(JSON, default=dict)            # Additional metadata (e.g. provider, sample answer, tech stack)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="recommendations")

class ProgressLog(Base):
    __tablename__ = "progress_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_id = Column(Integer, nullable=False)
    item_type = Column(String, nullable=False)        # roadmap_item, recommendation
    action = Column(String, default="status_change")
    previous_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress_logs")
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    target_role = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "project", "certification", "interview"
    content = Column(JSON, nullable=False)

class Progress(Base):
    __tablename__ = "progress"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    item_id = Column(String, nullable=False)
    status = Column(String, default="completed")  # "not-started", "in-progress", "completed"
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress_records")
