import datetime
from sqlalchemy.orm import Session
from backend.models import User, SkillGap, RoadmapItem, Recommendation, ProgressLog

def calculate_user_progress_summary(user: User, db: Session) -> dict:
    """
    Computes overall completion %, phase progress, acquired skills count,
    and recent activity log for the user dashboard.
    """
    roadmap_items = db.query(RoadmapItem).filter(RoadmapItem.user_id == user.id).all()
    recommendations = db.query(Recommendation).filter(Recommendation.user_id == user.id).all()
    skill_gaps = db.query(SkillGap).filter(SkillGap.user_id == user.id).all()

    # Roadmap Metrics
    total_roadmap_items = len(roadmap_items)
    completed_roadmap_items = sum(1 for item in roadmap_items if item.status == "completed")
    in_progress_roadmap_items = sum(1 for item in roadmap_items if item.status == "in_progress")
    roadmap_completion_pct = round((completed_roadmap_items / total_roadmap_items * 100), 1) if total_roadmap_items > 0 else 0.0

    # Phase Breakdown
    phases_dict = {}
    for item in roadmap_items:
        p_name = item.phase or "Phase 1"
        if p_name not in phases_dict:
            phases_dict[p_name] = {"total": 0, "completed": 0, "in_progress": 0}
        phases_dict[p_name]["total"] += 1
        if item.status == "completed":
            phases_dict[p_name]["completed"] += 1
        elif item.status == "in_progress":
            phases_dict[p_name]["in_progress"] += 1

    phases_summary = [
        {
            "phase": p_name,
            "total": stats["total"],
            "completed": stats["completed"],
            "in_progress": stats["in_progress"],
            "completion_pct": round((stats["completed"] / stats["total"] * 100), 1) if stats["total"] > 0 else 0.0
        }
        for p_name, stats in phases_dict.items()
    ]

    # Recommendation Metrics
    total_recs = len(recommendations)
    completed_recs = sum(1 for r in recommendations if r.status == "completed")
    in_progress_recs = sum(1 for r in recommendations if r.status == "in_progress")

    # Skill Gap Metrics
    total_gaps = len(skill_gaps)
    closed_gaps = sum(1 for g in skill_gaps if g.status == "closed")
    gap_closure_pct = round((closed_gaps / total_gaps * 100), 1) if total_gaps > 0 else 0.0

    # Combined Overall Progress Pct
    all_tasks_count = total_roadmap_items + total_recs
    all_completed = completed_roadmap_items + completed_recs
    overall_completion_pct = round((all_completed / all_tasks_count * 100), 1) if all_tasks_count > 0 else roadmap_completion_pct

    # Recent Activity Logs
    recent_logs = db.query(ProgressLog).filter(
        ProgressLog.user_id == user.id
    ).order_by(ProgressLog.timestamp.desc()).limit(5).all()

    activity_log = [
        {
            "id": log.id,
            "item_id": log.item_id,
            "item_type": log.item_type,
            "new_status": log.new_status,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M")
        }
        for log in recent_logs
    ]

    return {
        "user_id": user.id,
        "target_role": user.target_role,
        "overall_completion_pct": overall_completion_pct,
        "roadmap_completion_pct": roadmap_completion_pct,
        "gap_closure_pct": gap_closure_pct,
        "metrics": {
            "total_roadmap_items": total_roadmap_items,
            "completed_roadmap_items": completed_roadmap_items,
            "in_progress_roadmap_items": in_progress_roadmap_items,
            "total_recommendations": total_recs,
            "completed_recommendations": completed_recs,
            "in_progress_recommendations": in_progress_recs,
            "total_skill_gaps": total_gaps,
            "closed_skill_gaps": closed_gaps
        },
        "phases": phases_summary,
        "recent_activity": activity_log
    }

def get_skills_timeline_data(user: User, db: Session) -> dict:
    """
    Generates time-series data tailored for Chart.js skill growth charts.
    """
    # Sample 6-week progression baseline merged with real completed logs
    weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]
    
    # Calculate baseline skill acquisition curve
    acquired_skills_count = [2, 4, 7, 10, 14, 18]
    skill_gap_reduction = [12, 10, 8, 6, 4, 2]

    # Adjust current week based on completed user tasks
    completed_count = db.query(ProgressLog).filter(
        ProgressLog.user_id == user.id,
        ProgressLog.new_status == "completed"
    ).count()

    if completed_count > 0:
        acquired_skills_count[-1] += completed_count * 2
        skill_gap_reduction[-1] = max(0, skill_gap_reduction[-1] - completed_count)

    return {
        "labels": weeks,
        "datasets": [
            {
                "label": "Acquired Skills (Contour Peaks)",
                "data": acquired_skills_count,
                "borderColor": "#C89B3C",  # Brass Signal
                "backgroundColor": "rgba(200, 155, 60, 0.15)",
                "fill": True,
                "tension": 0.4
            },
            {
                "label": "Skill Gaps Remaining (Uncharted Plain)",
                "data": skill_gap_reduction,
                "borderColor": "#B5563C",  # Rust Flag
                "backgroundColor": "rgba(181, 86, 60, 0.15)",
                "fill": True,
                "tension": 0.4
            }
        ]
    }

def get_skill_terrain_map_state(user: User, db: Session) -> dict:
    """
    Computes dynamic state for the signature 'Skill Terrain Map'.
    Contour lines represent depth of mastery per skill cluster; labeled peaks are strengths;
    flat plains are gaps. As items are completed, the terrain visibly 'grows'.
    """
    gaps = db.query(SkillGap).filter(SkillGap.user_id == user.id).all()
    user_profile = user.skill_profile

    skills_list = user_profile.skills if (user_profile and user_profile.skills) else [
        "Python / FastAPI", "SQL & Database Design", "Git & CI/CD", "RESTful API Design"
    ]

    completed_items_count = db.query(ProgressLog).filter(
        ProgressLog.user_id == user.id,
        ProgressLog.new_status == "completed"
    ).count()

    base_elevation = 35 + (completed_items_count * 12)
    base_elevation = min(base_elevation, 100)

    # Active Peaks (Mastered skills)
    peaks = [
        {"skill": skill, "elevation": min(95, 60 + idx * 10 + completed_items_count * 5), "type": "peak", "color": "#C89B3C"}
        for idx, skill in enumerate(skills_list[:4])
    ]

    # Gap Plains (Target gap skills)
    gap_nodes = [
        {"skill": g.skill_name, "elevation": max(10, 25 - idx * 5), "type": "plain", "color": "#B5563C", "priority": g.priority_score}
        for idx, g in enumerate(gaps[:4])
    ] if gaps else [
        {"skill": "Distributed Systems", "elevation": 20, "type": "plain", "color": "#B5563C", "priority": "High"},
        {"skill": "Redis & Caching", "elevation": 25, "type": "plain", "color": "#B5563C", "priority": "High"},
        {"skill": "Kafka Streaming", "elevation": 15, "type": "plain", "color": "#B5563C", "priority": "Medium"}
    ]

    return {
        "user_id": user.id,
        "target_role": user.target_role,
        "terrain_title": f"{user.target_role} Cartography",
        "overall_elevation_pct": base_elevation,
        "contour_lines_count": max(4, int(base_elevation / 15)),
        "peaks": peaks,
        "gaps": gap_nodes,
        "palette": {
            "blueprint_ink": "#10243E",
            "blueprint_line": "#16324F",
            "chalk": "#EDEDE3",
            "brass_signal": "#C89B3C",
            "contour_sage": "#6B9080",
            "rust_flag": "#B5563C"
        }
    }
