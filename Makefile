.PHONY: setup pipeline api test

setup:
	python -m venv .venv
	.venv/bin/pip install -r backend/requirements.txt || .venv/Scripts/pip install -r backend/requirements.txt

pipeline:
	cd backend && python -m pipeline.run

api:
	cd backend && uvicorn api.main:app --reload --port 8000

test:
	cd backend && pytest
