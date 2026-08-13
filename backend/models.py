from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

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

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, nullable=False)
    phases = Column(JSON, nullable=False)  # Multi-phase roadmap array
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")

class Recommendation(Base):
    __tablename__ = "recommendations"

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
