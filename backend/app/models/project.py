from app import db
from datetime import datetime, timezone


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)
    release_date = db.Column(db.Date, nullable=True)
    cloudinary_video_id = db.Column(db.String(255), nullable=True)
    cloudinary_thumbnail_id = db.Column(db.String(255), nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    media = db.relationship(
        "ProjectMedia",
        backref="project",
        cascade="all, delete-orphan",
        order_by="ProjectMedia.order",
    )

    def __repr__(self):
        return f"<Project {self.title}>"


class ProjectMedia(db.Model):
    __tablename__ = "project_media"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    # media_type can be: 'standard_video' (16:9), 'short_reel' (9:16), 'image'
    media_type = db.Column(db.String(50), nullable=False, default="standard_video")
    cloudinary_id = db.Column(db.String(255), nullable=False)
    url = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<ProjectMedia {self.media_type} - {self.cloudinary_id}>"
