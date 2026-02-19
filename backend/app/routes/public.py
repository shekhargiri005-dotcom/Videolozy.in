from flask import Blueprint, request, jsonify
from app import db
from app.models.project import Project
from app.models.inquiry import Inquiry
from app.models.setting import SiteSetting
from datetime import datetime
import re

public_bp = Blueprint("public", __name__)


def project_to_dict(p: Project, cloud_name: str, detail: bool = False) -> dict:
    base = {
        "id": p.id,
        "title": p.title,
        "category": p.category,
        "release_date": p.release_date.isoformat() if p.release_date else None,
        "is_featured": p.is_featured,
        "thumbnail_url": (
            f"https://res.cloudinary.com/{cloud_name}/image/upload/w_400,h_300,c_fill/{p.cloudinary_thumbnail_id}.jpg"
            if p.cloudinary_thumbnail_id
            else None
        ),
    }
    if detail:
        base.update(
            {
                "description": p.description,
                "video_url": (
                    f"https://res.cloudinary.com/{cloud_name}/video/upload/{p.cloudinary_video_id}.mp4"
                    if p.cloudinary_video_id
                    else None
                ),
                "cloudinary_video_id": p.cloudinary_video_id,
                "cloudinary_thumbnail_id": p.cloudinary_thumbnail_id,
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
        )
    return base


@public_bp.route("/projects", methods=["GET"])
def get_projects():
    from flask import current_app
    cloud_name = current_app.config.get("CLOUDINARY_CLOUD_NAME", "")
    category = request.args.get("category")
    query = Project.query.order_by(Project.release_date.desc())
    if category:
        query = query.filter(Project.category.ilike(f"%{category}%"))
    projects = query.all()
    return jsonify([project_to_dict(p, cloud_name) for p in projects]), 200


@public_bp.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    from flask import current_app
    cloud_name = current_app.config.get("CLOUDINARY_CLOUD_NAME", "")
    project = Project.query.get_or_404(project_id)
    return jsonify(project_to_dict(project, cloud_name, detail=True)), 200


@public_bp.route("/site-settings", methods=["GET"])
def get_site_settings():
    settings = SiteSetting.query.all()
    return jsonify({s.key: s.value for s in settings}), 200


@public_bp.route("/contact", methods=["POST"])
def submit_contact():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    budget = (data.get("budget") or "").strip() or None

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        errors["email"] = "Valid email is required."
    if not message:
        errors["message"] = "Message is required."
    if errors:
        return jsonify({"errors": errors}), 422

    inquiry = Inquiry(name=name, email=email, message=message, budget=budget)
    db.session.add(inquiry)
    db.session.commit()
    return jsonify({"message": "Inquiry submitted successfully."}), 201
