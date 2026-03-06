"""
One-time script to update admin user email.
Run from backend/ directory:  python update_admin_email.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models.user import AdminUser

app = create_app(os.environ.get("FLASK_ENV", "development"))

with app.app_context():
    user = AdminUser.query.first()
    if user:
        old_email = user.email
        user.email = "shekhargiri005@gmail.com"
        db.session.commit()
        print(f"[ok] Email updated: {old_email} → {user.email}")
    else:
        print("[error] No admin user found. Run seed.py first.")
