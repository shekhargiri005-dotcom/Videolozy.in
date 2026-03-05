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
    # Disable Flask's default static serving to manually handle the React SPA
    app = Flask(__name__, static_folder=None)

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

    # Serve React App for all other routes
    import os
    from flask import send_from_directory

    frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist'))

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        # If the requested path exists as a static file, serve it directly
        if path != "" and os.path.exists(os.path.join(frontend_folder, path)):
            return send_from_directory(frontend_folder, path)
        # Otherwise, fall back to index.html (React Router handles the rest)
        return send_from_directory(frontend_folder, "index.html")

    return app
