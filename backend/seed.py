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
    "editor_name": "Videolozy",
    "editor_tagline": "Crafting Stories Frame by Frame",
    "home_text": "Professional film editor crafting compelling visual narratives. Explore our collection of cinematic masterpieces.",
    "portfolio_text": "Welcome to the showcase. Here is a curated selection of recent film editing, commercial work, and documentary projects.",
    "about_text": "I am a passionate film editor with years of experience bringing stories to life through rhythm, pacing, and visual storytelling.",
    "contact_text": "Ready to collaborate? Reach out to discuss your next big project and let's craft something amazing together.",
    "showreel_video_id": "",
    "instagram_url": "https://instagram.com/",
    "twitter_url": "https://x.com/",
    "vimeo_url": "https://vimeo.com/",
    "linkedin_url": "https://linkedin.com/",
    "contact_email": os.environ.get("ADMIN_EMAIL", "admin@videolozy.in"),
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
