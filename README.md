# V3Trading

Monorepo for V3Trading application with Python backend and Vue 3 frontend.

## Project Structure

```
v3trading/
├── backend/          # Python FastAPI backend
│   ├── app/         # Application modules
│   ├── tests/       # Backend tests
│   ├── main.py      # Entry point
│   └── requirements.txt
└── frontend/        # Vue 3 frontend
    ├── src/
    │   ├── components/
    │   ├── views/
    │   ├── composables/
    │   └── router/
    └── package.json
```

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Development

- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:5173
