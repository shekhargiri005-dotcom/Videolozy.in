import cloudinary.uploader
from flask import current_app


ALLOWED_VIDEO_EXT = {"mp4", "mov", "avi", "mkv", "webm"}
ALLOWED_IMAGE_EXT = {"jpg", "jpeg", "png", "webp", "gif"}


def _extension(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def upload_video(file_storage) -> dict:
    """Upload a video file to Cloudinary. Returns {public_id, url}."""
    ext = _extension(file_storage.filename)
    if ext not in ALLOWED_VIDEO_EXT:
        raise ValueError(f"Unsupported video format: .{ext}")

    file_storage.seek(0, 2)
    size = file_storage.tell()
    file_storage.seek(0)
    if size > current_app.config["MAX_VIDEO_SIZE"]:
        raise ValueError("Video file exceeds 100 MB limit.")

    result = cloudinary.uploader.upload_large(
        file_storage,
        resource_type="video",
        folder="videolozy/videos",
    )
    return {"public_id": result["public_id"], "url": result["secure_url"]}


def upload_image(file_storage) -> dict:
    """Upload an image file to Cloudinary. Returns {public_id, url}."""
    ext = _extension(file_storage.filename)
    if ext not in ALLOWED_IMAGE_EXT:
        raise ValueError(f"Unsupported image format: .{ext}")

    file_storage.seek(0, 2)
    size = file_storage.tell()
    file_storage.seek(0)
    if size > current_app.config["MAX_IMAGE_SIZE"]:
        raise ValueError("Image file exceeds 5 MB limit.")

    result = cloudinary.uploader.upload(
        file_storage,
        resource_type="image",
        folder="videolozy/thumbnails",
    )
    return {"public_id": result["public_id"], "url": result["secure_url"]}


def delete_resource(public_id: str, resource_type: str = "image"):
    """Delete a resource from Cloudinary."""
    cloudinary.uploader.destroy(public_id, resource_type=resource_type)


def build_video_url(public_id: str, cloud_name: str) -> str:
    return f"https://res.cloudinary.com/{cloud_name}/video/upload/{public_id}.mp4"


def build_thumbnail_url(public_id: str, cloud_name: str, w=400, h=300) -> str:
    return (
        f"https://res.cloudinary.com/{cloud_name}/image/upload"
        f"/w_{w},h_{h},c_fill/{public_id}.jpg"
    )
