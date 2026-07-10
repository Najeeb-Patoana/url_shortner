# LinkSnip — Production-Ready MERN URL Shortener

A full-featured URL shortener built with the MERN stack, featuring JWT authentication, advanced analytics, admin dashboard, QR codes, and a modern Tailwind CSS frontend.

## 🚀 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database with repository pattern |
| JWT (access + refresh) | Authentication with rotation |
| bcryptjs | Password hashing |
| Helmet + CORS | HTTP security |
| Winston | Structured logging |
| Swagger/OpenAPI | Auto-generated API docs |
| NanoID | Collision-resistant short code generation |
| qrcode | QR code PNG generation |
| express-rate-limit | Brute-force and abuse protection |
| ua-parser-js | Browser/device detection |
| ip-api.com | Free IP geolocation |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | Fast SPA with HMR |
| Tailwind CSS v3 | Utility-first styling |
| TanStack Query v5 | Server state management + caching |
| Framer Motion | Animations and transitions |
| React Hook Form + Zod | Form validation |
| Chart.js + react-chartjs-2 | Analytics charts |
| React Router DOM v7 | Client-side routing |
| React Hot Toast | Toast notifications |
| Axios | HTTP client with auto-refresh |

---

## 📁 Folder Structure

```
URL-SHORTNER/
├── server/
│   └── src/
│       ├── config/          # DB, logger, Swagger
│       ├── constants/       # HTTP codes, roles
│       ├── controllers/     # Thin request handlers
│       ├── helpers/         # UA parsing, geo, IP hash
│       ├── jobs/            # Expired URL cleanup
│       ├── middleware/       # Auth, error, rate limit, validate
│       ├── models/          # Mongoose schemas
│       ├── repositories/    # Raw DB operations
│       ├── routes/          # Express route definitions
│       ├── services/        # Business logic
│       ├── utils/           # ApiResponse, ApiError, tokens, QR
│       ├── validators/      # express-validator chains
│       ├── app.js           # Express app setup
│       └── server.js        # HTTP server entry
└── client/
    └── src/
        ├── api/             # Axios API modules
        ├── components/      # Reusable UI components
        │   ├── common/      # Navbar, Modal, Pagination...
        │   ├── url/         # URL cards, modals
        │   └── analytics/   # Charts, StatCard
        ├── context/         # AuthContext, ThemeContext
        ├── hooks/           # TanStack Query hooks
        ├── layouts/         # Main, Dashboard, Auth layouts
        ├── pages/           # All pages
        │   ├── admin/       # Admin dashboard
        │   └── errors/      # 404, expired, disabled
        ├── routes/          # Route guards + AppRoutes
        ├── services/        # QueryClient config
        ├── styles/          # Global CSS
        └── utils/           # Format, truncate, CSV export
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/url-shortener
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
SHORT_CODE_LENGTH=6
IP_HASH_SALT=your_salt_value
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=LinkSnip
```

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Node.js >= 18
- MongoDB (Atlas or local)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Najeeb-Patoana/url_shortner.git
cd url_shortner
```

### 2. Setup the Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev
```

Server runs at: `http://localhost:5000`  
Swagger Docs: `http://localhost:5000/api/docs`

### 3. Setup the Frontend

```bash
cd client
cp .env.example .env  # or create .env from the template above
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/logout` | Logout (clear refresh token) |
| POST | `/api/auth/refresh` | Rotate access token |

### URLs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/urls` | Create short URL |
| GET | `/api/urls` | Get user's URLs (paginated) |
| GET | `/api/urls/:id` | Get single URL |
| PUT | `/api/urls/:id` | Update URL |
| DELETE | `/api/urls/:id` | Delete URL |
| PATCH | `/api/urls/:id/status` | Toggle active/disabled |
| PATCH | `/api/urls/:id/favorite` | Toggle favorite |
| POST | `/api/urls/bulk/delete` | Bulk delete |
| PATCH | `/api/urls/bulk/status` | Bulk enable/disable |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/urls/:id/analytics` | URL analytics |
| GET | `/api/analytics/dashboard` | Global dashboard data |
| GET | `/api/analytics/urls/:id/analytics/export` | Export raw data |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/profile/password` | Change password |
| GET | `/api/users/stats` | User dashboard stats |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform-wide stats |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/urls` | All URLs |
| DELETE | `/api/admin/urls/:id` | Delete any URL |
| PATCH | `/api/admin/urls/:id/status` | Toggle any URL |

### Redirect
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:shortCode` | Redirect to original URL |

---

## 🔐 Authentication Flow

1. `POST /api/auth/register` or `POST /api/auth/login` → Returns `accessToken` (15m) + sets `refreshToken` httpOnly cookie (7d)
2. Axios interceptor automatically attaches `Bearer <accessToken>` header
3. On 401 → Axios interceptor calls `POST /api/auth/refresh` using the cookie → Updates token → Retries original request
4. Logout → Clears server-side refresh token + removes cookie

---

## 📊 Analytics Tracked Per Click

- Total clicks + unique clicks
- Browser (Chrome, Firefox, Safari...)
- Operating System (Windows, macOS, Linux, iOS, Android)
- Device Type (Desktop, Mobile, Tablet)
- Country + City (via ip-api.com)
- Referrer URL
- Accept-Language header
- Timezone
- Anonymized IP hash (SHA-256 HMAC)
- User-Agent string
- Timestamp

---

## 🚀 Deployment

### Backend → Render/Railway

1. Push `server/` directory
2. Set all environment variables in dashboard
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend → Vercel

1. Push `client/` directory
2. Set `VITE_API_URL=https://your-backend.render.com/api`
3. Build command: `npm run build`
4. Output directory: `dist`

### Database → MongoDB Atlas

1. Create free M0 cluster
2. Create database user
3. Whitelist Render/Railway IPs or use 0.0.0.0/0
4. Copy connection string to `MONGODB_URI`

---

## 📜 License

MIT © 2024 LinkSnip
