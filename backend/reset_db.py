from app import create_app, db
from sqlalchemy import text

app = create_app()
with app.app_context():
    db.reflect()
    db.drop_all()
    with db.engine.connect() as connection:
        connection.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE;"))
        connection.commit()
    print("All tables and Alembic versions dropped successfully.")
    print("All tables dropped successfully.")
