import os
from app import create_app
import cloudinary.uploader

app = create_app()

with app.app_context():
    try:
        # Create a dummy text file to test the upload
        with open("test.txt", "w") as f:
            f.write("test video content")
        
        with open("test.txt", "rb") as f:
            print("Beginning upload test...")
            result = cloudinary.uploader.upload(
                f,
                resource_type="video",
                folder="videolozy/videos",
            )
            print("Upload successful!")
            print(result)
    except Exception as e:
        print(f"Upload failed: {e}")
    finally:
        if os.path.exists("test.txt"):
            os.remove("test.txt")
