# Giveaway Backend API

Secure proxy server for theMarketer integration. This keeps your API keys private and not exposed in the frontend code.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
```bash
cd api
npm install
```

2. **Create `.env` file**:
```bash
cp .env.example .env
```

3. **Edit `.env` and add your theMarketer credentials**:
```env
THEMARKETER_CUSTOMER_KEY=your_actual_customer_key
THEMARKETER_REST_KEY=your_actual_rest_key
THEMARKETER_ENDPOINT=https://t.themarketer.com/api/v1/save_customer
PORT=3000
ALLOWED_ORIGINS=http://localhost:8000,https://mayiecosmetics.github.io
```

4. **Start the server**:
```bash
npm start
```

Server will run on `http://localhost:3000`

## 📡 API Endpoints

### POST `/api/subscribe`
Subscribe a user to theMarketer newsletter.

**Request Body**:
```json
{
  "email": "user@example.com",
  "firstname": "John",
  "gdpr_consent": true
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Successfully subscribed"
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET `/health`
Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Create `vercel.json`** in the `api` folder:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. **Deploy**:
```bash
cd api
vercel
```

4. **Set environment variables** in Vercel dashboard:
   - Go to your project settings
   - Add `THEMARKETER_CUSTOMER_KEY`
   - Add `THEMARKETER_REST_KEY`
   - Add `ALLOWED_ORIGINS` (your frontend URL)

5. **Update frontend** `script.js`:
```javascript
const API_CONFIG = {
    endpoint: 'https://your-project.vercel.app/api/subscribe'
};
```

### Option 2: Railway.app (Free Tier Available)

1. **Create account** at [railway.app](https://railway.app)
2. **Connect GitHub** repo
3. **Select the `api` folder** as root
4. **Add environment variables** in Railway dashboard
5. Railway will auto-deploy on push

### Option 3: Render.com (Free Tier Available)

1. **Create account** at [render.com](https://render.com)
2. **New Web Service** → Connect repository
3. **Settings**:
   - Root Directory: `api`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add environment variables**
5. Deploy!

### Option 4: Your Own Server

Deploy to any VPS (DigitalOcean, Linode, AWS, etc.):

```bash
# Clone repo
git clone https://github.com/mayiecosmetics/LP-Giveaway-decembrie-2025.git
cd LP-Giveaway-decembrie-2025/api

# Install dependencies
npm install

# Create .env file with your credentials
nano .env

# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start server.js --name giveaway-api

# Setup auto-restart on server reboot
pm2 startup
pm2 save
```

## 🔒 Security Features

- ✅ API keys stored securely on server (not in frontend code)
- ✅ CORS protection (only allowed origins can access)
- ✅ Input validation (email format, required fields)
- ✅ Error handling with detailed logging
- ✅ Environment-based configuration

## 🧪 Testing

**Test health endpoint**:
```bash
curl http://localhost:3000/health
```

**Test subscription endpoint**:
```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstname":"Test","gdpr_consent":true}'
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `THEMARKETER_CUSTOMER_KEY` | Your theMarketer customer key | ✅ Yes |
| `THEMARKETER_REST_KEY` | Your theMarketer REST API key | ✅ Yes |
| `THEMARKETER_ENDPOINT` | theMarketer API endpoint | No (has default) |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment (production/development) | No |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins for CORS | No (default: localhost) |

## 🐛 Troubleshooting

**CORS errors**: Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

**theMarketer errors**: Check that your API keys are correct and have proper permissions

**Connection errors**: Ensure the backend server is running and accessible from your frontend

## 📚 Documentation

- [theMarketer API Docs](https://themarketer.com/documentation)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
