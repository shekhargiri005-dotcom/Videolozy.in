from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import cloudinary

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(env="development"):
    app = Flask(__name__)

    # Load config
    from app.config import config_map
    app.config.from_object(config_map.get(env, "development"))

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})

    # Configure Cloudinary
    cloudinary.config(
        cloud_name=app.config["CLOUDINARY_CLOUD_NAME"],
        api_key=app.config["CLOUDINARY_API_KEY"],
        api_secret=app.config["CLOUDINARY_API_SECRET"],
        secure=True,
    )

    # Register models (so Flask-Migrate picks them up)
    from app.models import user, project, inquiry, setting  # noqa: F401

    # Register blueprints
    from app.routes.public import public_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(public_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    return app
