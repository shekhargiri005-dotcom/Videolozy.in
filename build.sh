#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Building Public Frontend (React/Vite)..."
npm install --prefix frontend --legacy-peer-deps
npm run build --prefix frontend

echo "Building Admin Frontend (React/Vite)..."
npm install --prefix admin-frontend --legacy-peer-deps
npm run build --prefix admin-frontend

echo "Installing Backend Dependencies (Python/Flask)..."
pip install -r backend/requirements.txt

echo "Build complete."
