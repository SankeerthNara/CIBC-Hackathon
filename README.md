# Collections Hackathon: Collections 360 + Ask + Next Best Action

Educational prototype on fully synthetic data. Not endorsed by, or a system of, the industry partner.

## Overview
TODO: one-paragraph summary (C360 golden record, natural-language Ask, Next Best Action with governance).

## Architecture
TODO: link `docs/architecture.svg` and `docs/ARCHITECTURE.md`.

## Setup
TODO: Python 3.11, then:
```bash
make setup
cp .env.example .env   # fill LLM_API_KEY, LLM_MODEL
```
TODO: frontend install (`cd frontend && npm install`).

## Run
TODO:
```bash
make pipeline   # build data/collections.duckdb from data/raw
make api        # FastAPI backend on :8000
# frontend: cd frontend && npm run dev   (:5173)
make test
```

## Repo layout and ownership
See `CLAUDE.md` and `docs/AI_WORKFLOW.md`.

## Deliverables
TODO: architecture diagram, data contract (`contracts/data_contract.yaml`), 5-min demo video, 10-slide deck.
