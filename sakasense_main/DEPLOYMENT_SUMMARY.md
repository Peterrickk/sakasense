# SakaSense System - Deployment Instructions

Your SakaSense soil monitoring system has been updated to be ready for production deployment. Here's what was implemented:

## Changes Made

### 1. Django Backend (`mysite/settings.py`)
- Updated to use environment variables for security
- Added WhiteNoise for efficient static file serving
- Added CORS headers support
- Configured for both SQLite (development) and PostgreSQL (production) via DATABASE_URL
- Added security settings for production
- Proper static files configuration

### 2. Django URL Configuration (`mysite/urls.py`)
- Added dashboard endpoint: `path("api/dashboard/", sakasense_views.dashboard, name="dashboard")`

### 3. Django Views (`hello/views.py`)
- Enhanced `device_ingest` view to properly handle sensor data storage
- Added `dashboard` view that returns real data from database:
  - Farms and plots information
  - Latest sensor readings for each plot
  - Latest recommendations for each plot
  - Proper JSON formatting matching frontend expectations

### 4. Next.js API Routes (`web/src/app/api/`)
- **Device Ingest** (`device/ingest/route.ts`): Now proxies to Django backend
- **Dashboard** (`dashboard/route.ts`): Now proxies to Django backend
- Both routes forward requests to your Django server at `http://127.0.0.1:8000/`

## What You Need to Do for Deployment

Since you mentioned you'll handle the API keys and setup yourself, here are the key steps:

### For Local Development
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   cd web && npm install
   ```

2. Start Django server:
   ```bash
   python manage.py runserver
   ```

3. Start Next.js dev server:
   ```bash
   cd web && npm run dev
   ```

4. Visit `http://localhost:3000` to see the application

### For Production Deployment (Recommended: Render.com)

The system is now configured for easy deployment to Render.com's free tier. Here's what you need to do:

#### Option 1: Using render.yaml (Recommended)
1. Create a GitHub repository with your code
2. Sign up at [render.com](https://render.com)
3. Use the "New +" → "Blueprints" option
4. Connect your repository and use the provided `render.yaml` file
5. Render will automatically create:
   - Backend service (Python/Django)
   - Frontend service (Node.js/Next.js)
   - PostgreSQL database

#### Option 2: Manual Setup
1. **Backend Service**:
   - Name: `sakasense-backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn mysite.wsgi:application`
   - Environment Variables:
     - `SECRET_KEY`: (generate a secure one)
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `.onrender.com`
     - `DATABASE_URL`: (automatically set when you add PostgreSQL)

2. **Frontend Service**:
   - Name: `sakasense-frontend`
   - Build Command: `cd web && npm install && npm run build`
   - Start Command: `cd web && npm start`
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: `https://sakasense-backend.onrender.com/api`

3. **Database**:
   - Add PostgreSQL database to your backend service
   - Name: `sakasense-db`
   - Plan: Free

### For ESP32 Device Configuration
Your devices should POST to:
```
https://your-backend-service.onrender.com/api/device/ingest/
```

**Important**: Before devices can store data, you must:
1. Create a user in Django admin (`/admin/`)
2. Create a farm and plot
3. Create a device record with the ESP32's serial number
4. Assign the device to the plot

Only then will sensor readings and recommendations be stored in the database.

## Verification
After deployment, verify:
1. Backend health: `https://your-backend.onrender.com/api/health/`
2. Dashboard data: `https://your-backend.onrender.com/api/dashboard/`
3. Frontend loads correctly: `https://your-frontend.onrender.com`

The system now uses real data from your database instead of demo data, and is ready to receive actual sensor data from your ESP32 devices.

## Notes
- All existing designs and frontend functionality have been preserved
- The Django admin interface is available at `/admin/` for managing your farms, plots, and devices
- Free tier services on Render may sleep after inactivity but will wake on request
- For production use with many devices, consider upgrading to paid plans on Render