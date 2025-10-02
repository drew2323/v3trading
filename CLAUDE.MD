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

### Docker/Deployment Issues

#### `docker-compose: command not found`
- Modern Docker uses `docker compose` (space, not hyphen)
- Install: `sudo apt-get install docker-compose-plugin`
- Or use `docker compose` command instead

#### Permission denied on Docker socket
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login, or run:
newgrp docker

# Verify
docker ps
```

#### GitHub Actions deployment fails
- Check GitHub Secrets are set correctly
- Verify VPS SSH key is the complete private key (including headers)
- Ensure VPS has Docker and docker-compose installed
- Check VPS has ports 80/443 open: `sudo ufw status`
- View GitHub Actions logs for detailed error messages

#### Container won't start
```bash
# On VPS, check logs
cd ~/v3trading
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

# Check container status
docker compose ps

# Restart specific service
docker compose restart backend
```

#### OAuth callback fails in production
- Update Google Cloud Console with production URLs
- Verify `FRONTEND_URL` in GitHub Secrets matches your VPS IP/domain
- Check redirect URI: `http://YOUR_VPS_IP/api/auth/callback`
- Ensure `CORS_ORIGINS` allows your frontend URL

## Git Ignore Recommendations
- `backend/.env` - Contains secrets
- `backend/__pycache__/` - Python cache
- `backend/.venv/` or `backend/venv/` - Virtual environment
- `frontend/node_modules/` - NPM dependencies
- `frontend/dist/` - Build output
- `.DS_Store` - macOS files

## Deployment & DevOps

**📖 For Release Management:** See [docs/RELEASES.md](../docs/RELEASES.md) for complete guide on creating releases, semantic versioning, and rollback procedures.

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

**Triggers:**
- **Tag Push**: `v*.*.*` (e.g., v1.0.0, v1.2.3) - Primary deployment method
- **Manual**: workflow_dispatch - Emergency/manual deployments

**Deployment Strategy:**
- Automatic deployment ONLY on version tag creation
- No auto-deploy on master branch pushes (prevents accidental production deploys)
- Version extraction and Docker image tagging
- Deployment history tracking in `.deployment-version` file
- **Automatic GitHub Release creation** with changelog and download links

**Steps**:
1. **Checkout Code**: Clone repository
2. **Setup SSH**: Configure SSH key from secrets
3. **Create Deployment Directory**: Prepare VPS directory (`~/v3trading`)
4. **Sync Files**: rsync code to VPS (excludes .git, node_modules, __pycache__, venv, .env)
5. **Create .env**: Generate backend `.env` from GitHub Secrets (auto-includes CORS_ORIGINS from FRONTEND_URL)
6. **Deploy**: Run `docker compose down && build --no-cache && up -d`
7. **Verify**: Check service status with `docker compose ps`
8. **Cleanup**: Remove SSH keys for security

**Required GitHub Secrets**:
- `VPS_HOST`: VPS IP address or hostname
- `VPS_USERNAME`: SSH username
- `VPS_SSH_KEY`: Private SSH key (full content)
- `GOOGLE_CLIENT_ID`: Production Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Production Google OAuth Secret
- `JWT_SECRET_KEY`: Production JWT secret (min 32 characters)
- `FRONTEND_URL`: Production frontend URL (e.g., https://yourdomain.com)

**Environment Injection**:
The workflow creates the `.env` file on the VPS during deployment from GitHub Secrets, ensuring secrets are never committed to the repository. `CORS_ORIGINS` is automatically set to match `FRONTEND_URL` value.

**Setup Steps for Deployment**:

1. **Prepare VPS:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install -y docker-compose-plugin

# Add user to docker group (replace with your username)
sudo usermod -aG docker $USER

# Logout and login, or run:
newgrp docker

# Verify installation
docker ps
docker compose version

# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
```

2. **Setup SSH Keys:**
```bash
# On your local machine (if you don't have SSH keys)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to VPS
ssh-copy-id user@your_vps_ip

# Copy private key content for GitHub Secrets
cat ~/.ssh/id_ed25519
```

3. **Configure GitHub Secrets:**
- Go to GitHub repo → Settings → Secrets and variables → Actions
- Add all required secrets (see list above)
- For `FRONTEND_URL` without domain: `http://YOUR_VPS_IP`

4. **Update Google OAuth:**
- Go to Google Cloud Console → Credentials
- Add authorized JavaScript origin: `http://YOUR_VPS_IP`
- Add authorized redirect URI: `http://YOUR_VPS_IP/api/auth/callback`

5. **Create First Release:**
```bash
# Commit your code
git add .
git commit -m "Initial release"
git push origin master

# Create version tag to trigger deployment
git tag -a v1.0.0 -m "Release v1.0.0 - Initial production release"
git push origin v1.0.0
```

6. **Monitor Deployment:**
- Go to GitHub → Actions tab
- Watch the deployment workflow
- Check for any errors in the logs

7. **Verify:**
- Visit `http://YOUR_VPS_IP` in browser
- Test Google OAuth login
- Check API endpoints work

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

#### SSL/TLS Configuration (Adding HTTPS)

When you're ready to add a domain with HTTPS, follow these steps:

**1. Point Domain to VPS:**
- Configure DNS A record: `yourdomain.com` → VPS IP
- Configure DNS A record: `www.yourdomain.com` → VPS IP (optional)
- Wait for DNS propagation (can take up to 48 hours)

**2. Obtain SSL Certificates (Let's Encrypt):**

SSH into your VPS and run:
```bash
# Install certbot
sudo apt-get update
sudo apt-get install -y certbot

# Stop nginx temporarily (port 80 needs to be free)
cd ~/v3trading
docker compose stop nginx

# Obtain certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start nginx again
docker compose start nginx
```

Certificates will be saved to: `/etc/letsencrypt/live/yourdomain.com/`

**3. Update Docker Compose Volumes:**

Edit `docker-compose.yml` to mount certificates:
```yaml
nginx:
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro  # Add this line
```

**4. Update Nginx Configuration:**

Edit `nginx/nginx.conf` and uncomment/update the HTTPS server block:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... (rest of location blocks same as HTTP)
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

**5. Update Backend Cookie Settings:**

Edit `backend/app/routers/auth.py` line 78:
```python
redirect_response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=True,  # Change from False to True
    samesite="lax",
    max_age=60 * 60 * 24 * 7
)
```

**6. Update GitHub Secrets:**
```
FRONTEND_URL=https://yourdomain.com
```

Note: `CORS_ORIGINS` will automatically be set to match.

**7. Update Google OAuth Settings:**

In Google Cloud Console, update:
- Authorized JavaScript origins: `https://yourdomain.com`, `https://www.yourdomain.com`
- Authorized redirect URIs: `https://yourdomain.com/api/auth/callback`

**8. Deploy Changes:**
```bash
git add .
git commit -m "Add HTTPS support"
git push origin master
```

**9. Restart Services on VPS:**
```bash
cd ~/v3trading
docker compose down
docker compose up -d
```

**10. Setup Auto-Renewal:**

Let's Encrypt certificates expire after 90 days. Setup auto-renewal:
```bash
# Test renewal process
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e

# Add this line (runs twice daily):
0 0,12 * * * certbot renew --quiet --deploy-hook "cd /home/YOUR_USERNAME/v3trading && docker compose restart nginx"
```

**Verification:**
- Visit `https://yourdomain.com` - should work with valid SSL
- Visit `http://yourdomain.com` - should redirect to HTTPS
- Test Google OAuth login with HTTPS
- Check browser shows padlock icon (secure connection)

### Deployment Workflow

**Release-Based Deployment Process:**

**Creating a Release:**
```bash
# 1. Ensure code is committed
git add .
git commit -m "Add new trading features"
git push origin master

# 2. Create version tag (triggers deployment)
git tag -a v1.1.0 -m "Release v1.1.0 - New features"
git push origin v1.1.0
```

**What Happens Automatically:**
1. GitHub Actions detects tag push
2. Extracts version number (e.g., `v1.1.0`)
3. SSH connection established to VPS
4. Code synced to VPS via rsync (to `~/v3trading`)
5. `.env` file created from GitHub Secrets
6. Version recorded in `.deployment-version` file
7. Docker images rebuilt with `--no-cache` flag
8. Images tagged with version number (`v3trading-backend:v1.1.0`)
9. Services restarted with `docker compose up -d`
10. Old untagged images pruned to save disk space
11. Health checks verify deployment success
12. **GitHub Release created automatically** with changelog, links, and downloads

**Manual Deployment (Emergency):**
- Go to GitHub → Actions → Deploy to VPS → Run workflow
- Creates deployment tagged as `manual-YYYYMMDD-HHMMSS`

**See [docs/RELEASES.md](../docs/RELEASES.md) for complete release management guide.**

**Common Deployment Commands on VPS:**
```bash
# Check deployment status
cd ~/v3trading
docker compose ps

# View logs
docker compose logs -f
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

# Restart services
docker compose restart

# Stop all services
docker compose down

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d

# Check resource usage
docker stats

# Clean up
docker system prune -a
```

### Local Docker Testing (Optional)

**Note:** Requires Docker Desktop installed on macOS/Windows or Docker Engine on Linux.

```bash
# From project root
cd /path/to/v3trading

# Create local .env file for testing
cp backend/.env.example backend/.env
# Edit backend/.env with your development credentials

# Build and run
docker compose up -d

# View logs
docker compose logs -f

# Check service status
docker compose ps

# Restart specific service
docker compose restart backend

# Stop all services
docker compose down

# Rebuild specific service
docker compose build --no-cache backend
docker compose up -d backend
```

If you don't have Docker installed locally, you can skip local testing and deploy directly to VPS via GitHub Actions.

---

**Last Updated**: October 1, 2025
**Primary Developer**: David P. Brazda (davidbrazda61@gmail.com)

**Development Guidelines**:
- Always use Vue 3 Composition API
- Never commit `.env` files
- Test Docker builds locally before pushing
- Update documentation when adding features