.PHONY: help setup dev dev-backend dev-frontend worker test build db-setup clean

help:
	@echo "====================================================================="
	@echo "                      DocForge / BookForge CLI                       "
	@echo "====================================================================="
	@echo "Available commands:"
	@echo "  make setup        - Install backend requirements and frontend packages"
	@echo "  make dev          - Start both backend and frontend development servers"
	@echo "  make dev-backend  - Start FastAPI backend dev server [uvicorn]"
	@echo "  make dev-frontend - Start Next.js frontend dev server [next]"
	@echo "  make worker       - Start Celery worker for workflow orchestration"
	@echo "  make test         - Run backend tests and frontend type checks"
	@echo "  make build        - Build production bundle for frontend"
	@echo "  make docker-up    - Start multi-container production stack with docker-compose"
	@echo "  make docker-down  - Stop multi-container production stack"
	@echo "  make db-setup     - Initialize PostgreSQL database and user"
	@echo "  make clean        - Remove cache, temp files, and build artifacts"
	@echo "====================================================================="

setup:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev: dev-backend

dev-backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

worker:
	cd backend && celery -A app.workers.celery_app worker --loglevel=info --queues=priority,publisher,gpu,cpu,worker,large_doc

test:
	@echo "Running backend pytest suite..."
	cd backend && pytest
	@echo "Running frontend type check..."
	cd frontend && npx tsc --noEmit

build:
	cd frontend && npm run build

docker-up:
	docker-compose up -d --build

docker-down:
	docker-compose down

db-setup:
	cd backend && python setup_db.py

clean:
	@echo "Cleaning Python cache files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "Clean completed."
