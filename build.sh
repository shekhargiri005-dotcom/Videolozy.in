#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Building Frontend (React/Vite)..."
npm install --prefix frontend
npm run build --prefix frontend

echo "Installing Backend Dependencies (Python/Flask)..."
pip install -r backend/requirements.txt

echo "Build complete."
