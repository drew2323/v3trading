# V3Trading Project - Development Documentation

## Project Overview
V3Trading is a full-stack trading application with a Vue 3 frontend and FastAPI backend, featuring Google OAuth authentication and a mock trading API.

## Technology Stack

### Frontend
- **Framework**: Vue 3 with TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia (Composition API style)
- **Router**: Vue Router 4
- **HTTP Client**: Axios
- **Port**: 5174

### Backend
- **Framework**: FastAPI
- **Language**: Python
- **Authentication**: OAuth2 (Google) with JWT
- **Session Management**: Starlette SessionMiddleware
- **Dependencies**:
  - `fastapi==0.115.0`
  - `uvicorn[standard]==0.30.6`
  - `pydantic==2.9.0`
  - `python-dotenv==1.0.1`
  - `authlib==1.3.0`
  - `itsdangerous==2.1.2`
  - `python-jose[cryptography]==3.3.0`
  - `httpx==0.27.0`
  - `email-validator`
- **Port**: 8000

## Project Structure

```
v3trading/
├── backend/
│   ├── app/
│   │   ├── dependencies/
│   │   │   └── auth.py              # Auth dependencies for route protection
│   │   ├── models/
│   │   │   ├── trade.py             # Trade Pydantic models
│   │   │   ├── position.py          # Position Pydantic models
│   │   │   └── user.py              # User Pydantic models
│   │   ├── routers/
│   │   │   ├── auth.py              # OAuth & authentication routes
│   │   │   ├── trades.py            # Trading endpoints
│   │   │   └── positions.py         # Position endpoints
│   │   └── utils/
│   │       ├── auth.py              # JWT token utilities
│   │       ├── mock_data.py         # Mock trading data generators
│   │       └── mock_users.py        # Mock user storage (in-memory)
│   ├── main.py                      # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env                         # Environment variables (not in git)
│   └── .env.example                 # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/              # Vue components
    │   ├── composables/             # Composition functions
    │   ├── router/
    │   │   └── index.ts             # Router with auth guards
    │   ├── services/
    │   │   ├── api.ts               # Axios instance with interceptors
    │   │   ├── authService.ts       # Auth API calls
    │   │   └── tradingService.ts    # Trading API calls
    │   ├── stores/
    │   │   ├── authStore.ts         # Auth state management (Pinia)
    │   │   └── tradingStore.ts      # Trading state management (Pinia)
    │   ├── types/
    │   │   ├── index.ts             # Common types (Trade, Position, etc.)
    │   │   └── auth.ts              # Auth types (User)
    │   ├── views/
    │   │   ├── HomeView.vue         # Landing page with login/user info
    │   │   └── ApiTest.vue          # Protected API testing page
    │   ├── App.vue
    │   └── main.ts
    ├── vite.config.ts               # Vite config with proxy
    ├── tsconfig.json                # TypeScript config
    ├── package.json
    └── .env.example
```

## Features Implemented

### 1. Authentication System

#### Google OAuth Flow
- **Login Endpoint**: `/api/auth/google`
  - Redirects to Google OAuth consent screen

- **Callback Endpoint**: `/api/auth/callback`
  - Handles Google OAuth callback
  - Creates or updates user in mock storage
  - Generates JWT token
  - Sets httpOnly cookie
  - Redirects to frontend

- **Current User Endpoint**: `/api/auth/me`
  - Returns authenticated user info
  - Requires valid JWT cookie

- **Logout Endpoint**: `/api/auth/logout`
  - Clears authentication cookie

#### Security Features
- JWT tokens stored in httpOnly cookies (XSS protection)
- Token expiration: 7 days
- CORS configured for localhost:5174
- Session middleware for OAuth state management

#### Frontend Auth Integration
- **Auth Store** (`stores/authStore.ts`):
  - `user`: Current user state
  - `isAuthenticated`: Computed boolean
  - `fetchUser()`: Get current user from backend
  - `login()`: Redirect to Google OAuth
  - `logout()`: Clear session and redirect

- **Route Guards** (`router/index.ts`):
  - Protected routes use `meta: { requiresAuth: true }`
  - Automatically fetch user if not loaded
  - Redirect to home if not authenticated

- **HomeView**:
  - Shows "Sign in with Google" button when not authenticated
  - Displays user profile (picture, name, email) when authenticated
  - Shows logout button and navigation to protected pages

### 2. Trading API (Mock Data)

#### Data Models

**Trade**:
```typescript
{
  id: string
  symbol: string
  side: "buy" | "sell"
  price: number
  quantity: number
  status: "pending" | "executed" | "cancelled"
  timestamp: string (ISO format)
}
```

**Position**:
```typescript
{
  id: string
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  unrealizedPnL: number
  realizedPnL: number
}
```

#### API Endpoints

**Trades** (`/api/trades`):
- `GET /api/trades` - List trades with pagination
  - Query params: `page`, `limit`, `sortBy`, `sortOrder`
  - Returns: `PaginatedResponse<Trade>`

- `GET /api/trades/{id}` - Get single trade
- `POST /api/trades` - Create new trade
- `PATCH /api/trades/{id}/cancel` - Cancel trade

**Positions** (`/api/positions`):
- `GET /api/positions` - List all positions
- `GET /api/positions/{symbol}` - Get single position
- `POST /api/positions/{symbol}/close` - Close position

#### Mock Data
- **Storage**: In-memory (resets on server restart)
- **Trades**: 20 pre-generated mock trades
- **Positions**: 5 pre-generated positions
- **Symbols**: AAPL, GOOGL, MSFT, TSLA, AMZN, NVDA, META, BTC, ETH, SPY

### 3. Frontend Architecture

#### Service Layer
- **API Client** (`services/api.ts`):
  - Axios instance with base URL `/api`
  - Request interceptor: Adds auth token if available
  - Response interceptor: Handles common errors (401, 403, 404, 500)
  - Helper methods: `get`, `post`, `put`, `patch`, `delete`

- **Service Pattern**:
  - `authService.ts`: Authentication operations
  - `tradingService.ts`: Trading operations
  - All services use typed responses

#### State Management (Pinia)
- **Trading Store** (`stores/tradingStore.ts`):
  - State: trades, positions, currentTrade, loading, error
  - Pagination: currentPage, pageSize, totalTrades
  - Actions: fetchTrades, createTrade, cancelTrade, fetchPositions, closePosition
  - Computed: totalPages, hasPositions, totalUnrealizedPnL

- **Auth Store** (`stores/authStore.ts`):
  - State: user, loading, error
  - Computed: isAuthenticated
  - Actions: fetchUser, login, logout

#### API Test Page (`views/ApiTest.vue`)
- Protected route (requires authentication)
- Tests all trading endpoints
- Features:
  - Trades list with pagination
  - Create sample trade button
  - Cancel pending trades
  - Positions list with P&L
  - Close positions
  - Real-time total unrealized P&L
  - Error and loading states

## Configuration

### Backend Environment Variables (`.env`)
```env
GOOGLE_CLIENT_ID=client-id
GOOGLE_CLIENT_SECRET=secret-id
JWT_SECRET_KEY=your-secret-key-change-this-in-production-min-32-chars
JWT_ALGORITHM=HS256
FRONTEND_URL=http://localhost:5174
```

### Google Cloud Console OAuth Setup
**Authorized JavaScript origins**:
- `http://localhost:5174`
- `http://localhost:8000`

**Authorized redirect URIs**:
- `http://localhost:8000/api/auth/callback`

### Vite Proxy Configuration
Frontend proxies `/api` requests to `http://localhost:8000`

## Running the Application

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- Frontend: http://localhost:5174
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## User Flow

1. User visits http://localhost:5174/
2. Sees "Sign in with Google" button if not authenticated
3. Clicks button → redirects to Google OAuth
4. Authenticates with Google account
5. Redirects back to frontend with httpOnly cookie containing JWT
6. Frontend fetches user info and displays profile
7. User can access "Test API Integration" button
8. Clicking button navigates to `/api-test` (protected route)
9. API test page shows trades and positions with full CRUD operations
10. User can logout, which clears cookie and returns to login screen

## Development Notes

### Authentication
- User storage is in-memory (mock) - resets on backend restart
- New users are automatically created on first Google login
- JWT tokens expire after 7 days
- httpOnly cookies used for security (cannot be accessed by JavaScript)

### Mock Data
- Trading data is in-memory and regenerates on server restart
- Users can create/cancel trades and close positions
- Changes persist during runtime but are lost on restart

### TypeScript
- Frontend is fully typed with TypeScript
- Type definitions in `src/types/`
- Backend uses Pydantic for type validation

### CORS
- Currently configured for localhost development
- Origin: `http://localhost:5174`
- Credentials enabled for cookie support

## Future Enhancements (Not Yet Implemented)
- Database integration (PostgreSQL/MongoDB)
- Real trading API integration
- WebSocket for real-time price updates
- Order book visualization
- Portfolio analytics
- Trade history charts
- Multi-factor authentication
- API rate limiting
- Production deployment configuration
- Environment-specific builds
- User settings/preferences
- Email notifications
- Trading strategies/bots

## API Response Examples

### GET /api/trades
```json
{
  "items": [
    {
      "id": "uuid",
      "symbol": "AAPL",
      "side": "buy",
      "price": 175.50,
      "quantity": 10,
      "status": "executed",
      "timestamp": "2025-10-01T12:00:00"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

### GET /api/auth/me
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "google_id": "113705771254809700048"
}
```

## Troubleshooting

### Backend won't start
- Check if port 8000 is in use: `lsof -ti:8000`
- Verify `.env` file exists with correct credentials
- Check Python dependencies: `pip install -r requirements.txt`

### Frontend won't connect to backend
- Verify backend is running on port 8000
- Check proxy configuration in `vite.config.ts`
- Verify CORS settings in `backend/main.py`

### OAuth not working
- Verify Google Cloud Console credentials
- Check redirect URIs match exactly
- Clear browser cookies and try again
- Check backend logs for detailed error messages

### Picture not displaying
- Verify Google OAuth returns `picture` field
- Check browser console for image loading errors
- Ensure user has a Google profile picture set

## Git Ignore Recommendations
- `backend/.env` - Contains secrets
- `backend/__pycache__/` - Python cache
- `backend/.venv/` or `backend/venv/` - Virtual environment
- `frontend/node_modules/` - NPM dependencies
- `frontend/dist/` - Build output
- `.DS_Store` - macOS files

## Deployment & DevOps

### Docker Configuration

#### Backend Dockerfile
- Multi-stage build for optimized image size
- Stage 1: Install dependencies with build tools
- Stage 2: Production runtime with minimal dependencies
- Non-root user for security
- Health check endpoint: `/health`
- Runs on port 8000 with uvicorn

#### Frontend Dockerfile
- Multi-stage build: Node.js build + Nginx serve
- Stage 1: Build Vue app with Vite
- Stage 2: Serve static files with Nginx
- Custom nginx.conf for Vue Router history mode
- Gzip compression enabled
- Static asset caching with immutable headers
- Runs on port 80

#### Docker Compose
- **Services**:
  - `backend`: FastAPI application
  - `frontend`: Nginx serving Vue build
  - `nginx`: Reverse proxy for both services
- **Network**: Bridge network for inter-container communication
- **Health Checks**: All services include health check definitions
- **Volumes**: Nginx config and SSL certificates mounted
- **Ports**:
  - 80 (HTTP)
  - 443 (HTTPS, when SSL configured)
  - 8000 (Backend direct access)

#### Nginx Reverse Proxy
- Routes `/api/*` to backend container
- Routes `/` to frontend container
- Rate limiting:
  - API: 10 requests/second
  - Auth: 5 requests/minute
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Gzip compression
- Health check endpoint: `/health`
- SSL/TLS ready (commented out, requires certificates)

### CI/CD Pipeline

#### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Trigger**: Push to `main` branch

**Steps**:
1. **Checkout Code**: Clone repository
2. **Setup SSH**: Configure SSH key from secrets
3. **Create Deployment Directory**: Prepare VPS directory
4. **Sync Files**: rsync code to VPS (excludes .git, node_modules, etc.)
5. **Create .env**: Generate backend `.env` from GitHub Secrets
6. **Deploy**: Run `docker-compose down && build && up -d`
7. **Verify**: Check service status with `docker-compose ps`
8. **Cleanup**: Remove SSH keys

**Required GitHub Secrets**:
- `VPS_HOST`: VPS IP address or hostname
- `VPS_USERNAME`: SSH username
- `VPS_SSH_KEY`: Private SSH key (full content)
- `GOOGLE_CLIENT_ID`: Production Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Production Google OAuth Secret
- `JWT_SECRET_KEY`: Production JWT secret (min 32 characters)
- `FRONTEND_URL`: Production frontend URL (e.g., https://yourdomain.com)

**Environment Injection**:
The workflow creates the `.env` file on the VPS during deployment from GitHub Secrets, ensuring secrets are never committed to the repository.

### Production Configuration

#### Backend Environment Variables
```env
GOOGLE_CLIENT_ID=production-client-id
GOOGLE_CLIENT_SECRET=production-secret
JWT_SECRET_KEY=production-jwt-secret-min-32-chars
JWT_ALGORITHM=HS256
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### CORS Configuration
Updated `main.py` to read `CORS_ORIGINS` from environment:
```python
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5174").split(",")
```

This allows multiple origins for production (e.g., with/without www).

#### VPS Requirements
- Ubuntu/Debian Linux (recommended)
- Docker Engine installed
- docker-compose installed
- SSH access configured with public key authentication
- Firewall configured (ports 80, 443 open)
- Domain name pointed to VPS (optional, for SSL)

#### SSL/TLS Configuration (Optional)
1. Obtain certificates (e.g., Let's Encrypt with certbot)
2. Place certificates in `nginx/ssl/`
3. Uncomment HTTPS server block in `nginx/nginx.conf`
4. Update Google OAuth redirect URIs to HTTPS
5. Set cookie `secure=True` in `backend/app/routers/auth.py`

### Deployment Workflow
1. Developer pushes code to `main` branch
2. GitHub Actions triggers automatically
3. Code is synced to VPS via rsync
4. `.env` file created from GitHub Secrets
5. Docker images rebuilt with no cache
6. Services restarted with docker-compose
7. Old images pruned to save space
8. Health checks verify deployment success

### Local Docker Testing
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build --no-cache backend
docker-compose up -d backend
```

---

**Last Updated**: October 1, 2025
**Primary Developer**: David P. Brazda (davidbrazda61@gmail.com)

**Development Guidelines**:
- Always use Vue 3 Composition API
- Never commit `.env` files
- Test Docker builds locally before pushing
- Update documentation when adding features