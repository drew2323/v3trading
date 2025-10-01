# V3Trading

A full-stack trading application with Python FastAPI backend and Vue 3 TypeScript frontend, featuring Google OAuth authentication and mock trading API.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **Trading API** - Mock trading endpoints for trades and positions
- **Real-time State Management** - Pinia stores with TypeScript
- **Protected Routes** - Authentication guards for secure pages
- **RESTful API** - FastAPI with automatic OpenAPI documentation
- **Type Safety** - Full TypeScript on frontend, Pydantic on backend

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation with Python type hints
- **AuthLib** - OAuth 2.0 client implementation
- **python-jose** - JWT token handling

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Next generation frontend tooling
- **Pinia** - State management with Composition API
- **Axios** - HTTP client with interceptors
- **Vue Router** - Client-side routing with guards

## 📁 Project Structure

```
v3trading/
├── backend/
│   ├── app/
│   │   ├── dependencies/    # Auth dependencies
│   │   ├── models/          # Pydantic models
│   │   ├── routers/         # API endpoints
│   │   └── utils/           # Utilities (auth, mock data)
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                 # Your secrets (not in git)
│
└── frontend/
    ├── src/
    │   ├── components/      # Vue components
    │   ├── composables/     # Composition functions
    │   ├── router/          # Vue Router with auth guards
    │   ├── services/        # API service layer
    │   ├── stores/          # Pinia stores
    │   ├── types/           # TypeScript types
    │   └── views/           # Page components
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

## 🔧 Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- Google Cloud Console project with OAuth credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized JavaScript origins:
   - `http://localhost:5174`
   - `http://localhost:8000`
4. Add authorized redirect URI:
   - `http://localhost:8000/api/auth/callback`
5. Copy Client ID and Client Secret

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your Google OAuth credentials

# Run server
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc

## 📚 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user

### Trading
- `GET /api/trades` - List trades (paginated)
- `GET /api/trades/{id}` - Get single trade
- `POST /api/trades` - Create new trade
- `PATCH /api/trades/{id}/cancel` - Cancel trade

### Positions
- `GET /api/positions` - List all positions
- `GET /api/positions/{symbol}` - Get position by symbol
- `POST /api/positions/{symbol}/close` - Close position

## 🔐 Environment Variables

### Backend (`.env`)
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
JWT_SECRET_KEY=your-secret-key-min-32-chars
JWT_ALGORITHM=HS256
FRONTEND_URL=http://localhost:5174
```

### Frontend (optional `.env`)
```env
VITE_API_BASE_URL=/api
```

## 🎯 Usage

1. Start both backend and frontend servers
2. Navigate to http://localhost:5174
3. Click "Sign in with Google"
4. Authorize the application
5. After login, access the "Test API Integration" page
6. View and interact with mock trades and positions

## 🧪 Development Notes

- **Mock Data**: All trading data is in-memory and resets on server restart
- **User Storage**: Users are stored in-memory (not persisted)
- **Authentication**: JWT tokens stored in httpOnly cookies (7-day expiration)
- **CORS**: Configured for localhost development
- **Auto-reload**: Both servers support hot-reloading during development

## 📖 Documentation

For detailed documentation including architecture decisions, API examples, and troubleshooting, see [CLAUDE.MD](./CLAUDE.MD).

## 🔨 Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
Update environment variables for production:
- Set `secure=True` for cookies (requires HTTPS)
- Update `FRONTEND_URL` to production domain
- Update CORS origins in `main.py`
- Generate a secure `JWT_SECRET_KEY`

## 🤝 Contributing

This is a development project. For major changes, please document your updates in CLAUDE.MD.

## 📝 License

Private project - All rights reserved

## 👤 Author

David P. Brazda - davidbrazda61@gmail.com
