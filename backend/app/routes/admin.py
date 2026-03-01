from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import AdminUser
from app.models.project import Project, ProjectMedia
from app.models.inquiry import Inquiry
from app.models.setting import SiteSetting
from app.utils.cloudinary_helper import upload_video, upload_image, delete_resource
import cloudinary.api
from sqlalchemy import text
from datetime import datetime, date

admin_bp = Blueprint("admin", __name__)


# ─── AUTH ────────────────────────────────────────────────────────────────────

@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = AdminUser.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token}), 200


# ─── DASHBOARD ───────────────────────────────────────────────────────────────

@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    total_projects = Project.query.count()
    unread_inquiries = Inquiry.query.filter_by(status="unread").count()
    recent = (
        Inquiry.query.order_by(Inquiry.created_at.desc()).limit(5).all()
    )
    recent_list = [
        {
            "id": i.id,
            "name": i.name,
            "email": i.email,
            "status": i.status,
            "created_at": i.created_at.isoformat() if i.created_at else None,
        }
        for i in recent
    ]
    return jsonify(
        {
            "total_projects": total_projects,
            "unread_inquiries": unread_inquiries,
            "recent_inquiries": recent_list,
        }
    ), 200


# ─── STORAGE STATS ───────────────────────────────────────────────────────────

@admin_bp.route("/stats/storage", methods=["GET"])
@jwt_required()
def storage_stats():
    # 1. Get database size (NeonDB PostgreSQL)
    db_size_bytes = 0
    try:
        # PostgreSQL specific: get size of current database
        result = db.session.execute(text("SELECT pg_database_size(current_database())"))
        db_size_bytes = result.scalar() or 0
    except Exception as e:
        print("Error fetching DB size:", e)

    # 2. Get Cloudinary usage
    cloudinary_usage_bytes = 0
    try:
        # The admin API can fetch usage statistics. We'll try to get the bandwidth/storage usage.
        # Note: Depending on the Cloudinary plan, `usage()` might require specific permissions.
        # For a simple workaround if usage() fails, we might just return 0 or a placeholder,
        # but let's attempt the official API first.
        usage_res = cloudinary.api.usage()
        # usage_res usually contains 'storage' with 'usage' in bytes
        if "storage" in usage_res and "usage" in usage_res["storage"]:
            cloudinary_usage_bytes = usage_res["storage"]["usage"]
    except Exception as e:
        print("Error fetching Cloudinary usage:", e)

    return jsonify({
        "database_bytes": db_size_bytes,
        "cloudinary_bytes": cloudinary_usage_bytes,
        "database_limit_bytes": 536870912,    # e.g., 500 MB Free Tier
        "cloudinary_limit_bytes": 26843545600 # e.g., 25 GB Free Tier
    }), 200


# ─── PROJECTS ────────────────────────────────────────────────────────────────

def project_to_dict(p: Project, cloud_name: str) -> dict:
    media_list = []
    for m in p.media:
        media_list.append({
            "id": m.id,
            "media_type": m.media_type,
            "cloudinary_id": m.cloudinary_id,
            "url": m.url,
            "order": m.order
        })

    return {
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "category": p.category,
        "release_date": p.release_date.isoformat() if p.release_date else None,
        "is_featured": p.is_featured,
        "cloudinary_video_id": p.cloudinary_video_id,
        "cloudinary_thumbnail_id": p.cloudinary_thumbnail_id,
        "thumbnail_url": (
            f"https://res.cloudinary.com/{cloud_name}/image/upload/w_400,h_300,c_fill/{p.cloudinary_thumbnail_id}.jpg"
            if p.cloudinary_thumbnail_id
            else None
        ),
        "video_url": (
            f"https://res.cloudinary.com/{cloud_name}/video/upload/{p.cloudinary_video_id}.mp4"
            if p.cloudinary_video_id
            else None
        ),
        "media": media_list,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }


@admin_bp.route("/projects", methods=["GET"])
@jwt_required()
def list_projects():
    from flask import current_app
    cloud_name = current_app.config.get("CLOUDINARY_CLOUD_NAME", "")
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify([project_to_dict(p, cloud_name) for p in projects]), 200


@admin_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    from flask import current_app
    cloud_name = current_app.config.get("CLOUDINARY_CLOUD_NAME", "")
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 422

    release_date = None
    if data.get("release_date"):
        try:
            release_date = date.fromisoformat(data["release_date"])
        except ValueError:
            return jsonify({"error": "Invalid release_date format, use YYYY-MM-DD"}), 422

    project = Project(
        title=title,
        description=data.get("description", ""),
        category=data.get("category", ""),
        release_date=release_date,
        cloudinary_video_id=data.get("cloudinary_video_id", ""),
        cloudinary_thumbnail_id=data.get("cloudinary_thumbnail_id", ""),
        is_featured=bool(data.get("is_featured", False)),
    )
    
    # Process media array
    media_data = data.get("media", [])
    if isinstance(media_data, list):
        for index, item in enumerate(media_data):
            if item.get("cloudinary_id") and item.get("url"):
                pm = ProjectMedia(
                    media_type=item.get("media_type", "standard_video"),
                    cloudinary_id=item["cloudinary_id"],
                    url=item["url"],
                    order=index
                )
                project.media.append(pm)

    db.session.add(project)
    db.session.commit()
    return jsonify(project_to_dict(project, cloud_name)), 201


@admin_bp.route("/projects/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    from flask import current_app
    cloud_name = current_app.config.get("CLOUDINARY_CLOUD_NAME", "")
    project = Project.query.get_or_404(project_id)
    return jsonify(project_to_dict(project, cloud_name)), 200


@admin_bp.route("/projects/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    from flask import current_app
    cloud_name = current_app.config.get("CLOUDINARY_CLOUD_NAME", "")
    project = Project.query.get_or_404(project_id)
    data = request.get_json(silent=True) or {}

    if "title" in data:
        project.title = data["title"].strip()
    if "description" in data:
        project.description = data["description"]
    if "category" in data:
        project.category = data["category"]
    if "is_featured" in data:
        project.is_featured = bool(data["is_featured"])
    if "cloudinary_video_id" in data:
        project.cloudinary_video_id = data["cloudinary_video_id"]
    if "cloudinary_thumbnail_id" in data:
        project.cloudinary_thumbnail_id = data["cloudinary_thumbnail_id"]
    if "release_date" in data:
        try:
            project.release_date = date.fromisoformat(data["release_date"]) if data["release_date"] else None
        except ValueError:
            return jsonify({"error": "Invalid release_date format"}), 422

    if "media" in data and isinstance(data["media"], list):
        project.media.clear()  # Delete old media relationships
        for index, item in enumerate(data["media"]):
            if item.get("cloudinary_id") and item.get("url"):
                pm = ProjectMedia(
                    media_type=item.get("media_type", "standard_video"),
                    cloudinary_id=item["cloudinary_id"],
                    url=item["url"],
                    order=index
                )
                project.media.append(pm)

    project.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(project_to_dict(project, cloud_name)), 200


@admin_bp.route("/projects/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    # Optionally delete from Cloudinary
    if project.cloudinary_video_id:
        try:
            delete_resource(project.cloudinary_video_id, resource_type="video")
        except Exception:
            pass
    if project.cloudinary_thumbnail_id:
        try:
            delete_resource(project.cloudinary_thumbnail_id, resource_type="image")
        except Exception:
            pass
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted"}), 200


# ─── INQUIRIES ───────────────────────────────────────────────────────────────

def inquiry_to_dict(i: Inquiry) -> dict:
    return {
        "id": i.id,
        "name": i.name,
        "email": i.email,
        "message": i.message,
        "budget": i.budget,
        "status": i.status,
        "created_at": i.created_at.isoformat() if i.created_at else None,
    }


@admin_bp.route("/inquiries", methods=["GET"])
@jwt_required()
def list_inquiries():
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    return jsonify([inquiry_to_dict(i) for i in inquiries]), 200


@admin_bp.route("/inquiries/<int:inquiry_id>", methods=["PATCH"])
@jwt_required()
def update_inquiry(inquiry_id):
    inquiry = Inquiry.query.get_or_404(inquiry_id)
    data = request.get_json(silent=True) or {}
    status = data.get("status")
    if status not in ("unread", "read", "replied"):
        return jsonify({"error": "Invalid status. Use: unread, read, replied"}), 422
    inquiry.status = status
    db.session.commit()
    return jsonify(inquiry_to_dict(inquiry)), 200


@admin_bp.route("/inquiries/<int:inquiry_id>", methods=["DELETE"])
@jwt_required()
def delete_inquiry(inquiry_id):
    inquiry = Inquiry.query.get_or_404(inquiry_id)
    db.session.delete(inquiry)
    db.session.commit()
    return jsonify({"message": "Inquiry deleted"}), 200


# ─── SETTINGS ────────────────────────────────────────────────────────────────

@admin_bp.route("/settings", methods=["GET"])
@jwt_required()
def get_settings():
    settings = SiteSetting.query.all()
    return jsonify({s.key: s.value for s in settings}), 200


@admin_bp.route("/settings", methods=["PUT"])
@jwt_required()
def update_settings():
    data = request.get_json(silent=True) or {}
    for key, value in data.items():
        setting = SiteSetting.query.filter_by(key=key).first()
        if setting:
            setting.value = value
        else:
            db.session.add(SiteSetting(key=key, value=value))
    db.session.commit()
    settings = SiteSetting.query.all()
    return jsonify({s.key: s.value for s in settings}), 200


# ─── UPLOAD ──────────────────────────────────────────────────────────────────

@admin_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_file():
    resource_type = request.form.get("resource_type", "image")  # "image" or "video"
    folder = request.form.get("folder")
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "No file provided"}), 400

    try:
        if resource_type == "video":
            result = upload_video(file, folder_name=folder) if folder else upload_video(file)
        else:
            result = upload_image(file, folder_name=folder) if folder else upload_image(file)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500
