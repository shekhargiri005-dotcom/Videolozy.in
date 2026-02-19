"""
Seed script — creates admin user and default site settings.
Run once after database migrations:
  python seed.py
"""
import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app, db
from app.models.user import AdminUser
from app.models.setting import SiteSetting

app = create_app(os.environ.get("FLASK_ENV", "development"))

DEFAULT_SETTINGS = {
    "about_text": (
        "Hi, I'm a professional film editor passionate about storytelling through video. "
        "With years of experience in commercials, music videos, and narrative projects, "
        "I bring stories to life in the edit suite."
    ),
    "showreel_video_id": "",
    "instagram_url": "",
    "vimeo_url": "",
    "linkedin_url": "",
    "youtube_url": "",
    "contact_email": os.environ.get("ADMIN_EMAIL", "admin@videolozy.in"),
    "editor_name": "Videolozy",
    "editor_tagline": "Crafting Stories Frame by Frame",
}


def seed():
    with app.app_context():
        db.create_all()

        # Admin user
        username = os.environ.get("ADMIN_USERNAME", "admin")
        password = os.environ.get("ADMIN_PASSWORD", "changeme123")
        email = os.environ.get("ADMIN_EMAIL", "admin@videolozy.in")

        existing = AdminUser.query.filter_by(username=username).first()
        if not existing:
            user = AdminUser(username=username, email=email)
            user.set_password(password)
            db.session.add(user)
            print(f"[seed] Admin user '{username}' created.")
        else:
            print(f"[seed] Admin user '{username}' already exists, skipping.")

        # Site settings
        for key, value in DEFAULT_SETTINGS.items():
            existing_setting = SiteSetting.query.filter_by(key=key).first()
            if not existing_setting:
                db.session.add(SiteSetting(key=key, value=value))
                print(f"[seed] Setting '{key}' created.")
            else:
                print(f"[seed] Setting '{key}' already exists, skipping.")

        db.session.commit()
        print("[seed] Done!")


if __name__ == "__main__":
    seed()
